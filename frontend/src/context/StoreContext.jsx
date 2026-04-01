import { createContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";

export const StoreContext = createContext(null);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:4000/api/files";

const normalizeUrl = (value) => {
  if (!value) return null;

  const trimmed = String(value).trim();
  if (!trimmed) return null;

  try {
    const withProtocol =
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);

    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
};

const extractUrlsFromSheet = (sheet) => {
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  const urls = rows
    .flat()
    .map((cell) => normalizeUrl(cell))
    .filter(Boolean);

  return [...new Set(urls)];
};

const sheetUrlToCsvUrl = (url) => {
  if (!url) return "";

  if (url.includes("/export?format=csv")) return url;

  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return "";

  const sheetId = match[1];
  const gidMatch = url.match(/[?&]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : "0";

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

const StoreContextProvider = (props) => {
  const [urls, setUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sourceName, setSourceName] = useState("");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [previousFiles, setPreviousFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");

  const currentUrl = urls[currentIndex] || "";

  const resetState = () => {
    setUrls([]);
    setCurrentIndex(0);
    setSourceName("");
    setError("");
    setSelectedFileId("");
  };

  const loadUrls = (nextUrls, name = "") => {
    setUrls(nextUrls);
    setCurrentIndex(0);
    setSourceName(name);

    if (!nextUrls.length) {
      setError("No valid website URLs were found in the uploaded sheet.");
      return;
    }

    setError("");
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }

      loadUrls(result.data.urls || [], result.data.fileName);
      setSelectedFileId(result.data._id);
      await fetchPreviousFiles();
    } catch (err) {
      console.error("File upload error:", err);
      setError("Could not read the file. Please upload a valid Excel or CSV file.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreviousFiles = async () => {
    setIsHistoryLoading(true);

    try {
      const response = await fetch(API_BASE_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not fetch files");
      }

      setPreviousFiles(result.data || []);
    } catch (err) {
      console.error("Previous files error:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const selectPreviousFile = async (fileId) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/${fileId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load selected file");
      }

      loadUrls(result.data.urls || [], result.data.fileName);
      setSelectedFileId(result.data._id);
    } catch (err) {
      console.error("Selected file error:", err);
      setError("Could not load the selected file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl.trim()) {
      setError("Please enter a Google Sheets URL.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const csvUrl = sheetUrlToCsvUrl(googleSheetUrl);
      if (!csvUrl) {
        throw new Error("Invalid Google Sheets URL");
      }

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet");
      }

      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: "string" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const extractedUrls = extractUrlsFromSheet(firstSheet);

      loadUrls(extractedUrls, "Google Sheet");
    } catch (err) {
      console.error("Google Sheet import error:", err);
      setError("Could not import this Google Sheet. Make sure it is public or published.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, urls.length - 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    fetchPreviousFiles();
  }, []);

  const contextValue = {
    urls,
    currentUrl,
    currentIndex,
    setCurrentIndex,
    sourceName,
    googleSheetUrl,
    setGoogleSheetUrl,
    isLoading,
    isHistoryLoading,
    error,
    previousFiles,
    selectedFileId,
    handleFileUpload,
    handleGoogleSheetImport,
    fetchPreviousFiles,
    selectPreviousFile,
    goToNext,
    goToPrevious,
    resetState,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
