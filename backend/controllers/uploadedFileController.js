import * as XLSX from "xlsx";
import UploadedFile from "../models/uploadedFileModel.js";

const normalizeUrl = (value) => {
  if (!value) return null;

  const trimmed = String(value).trim();
  if (!trimmed) return null;

  try {
    const withProtocol =
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);

    if (!parsed.hostname.includes(".")) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
};

const extractUrlsFromBuffer = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(firstSheet, {
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

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file.",
      });
    }

    const urls = extractUrlsFromBuffer(req.file.buffer);

    const savedFile = await UploadedFile.create({
      fileName: req.file.originalname,
      urls,
      totalUrls: urls.length,
      sourceType: req.file.mimetype.includes("csv") ? "csv" : "excel",
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      data: savedFile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not process the uploaded file.",
      error: error.message,
    });
  }
};

export const getUploadedFiles = async (req, res) => {
  try {
    const files = await UploadedFile.find({})
      .sort({ createdAt: -1 })
      .select("fileName totalUrls sourceType createdAt");

    return res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch previous files.",
      error: error.message,
    });
  }
};

export const getUploadedFileById = async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    return res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not fetch the selected file.",
      error: error.message,
    });
  }
};
