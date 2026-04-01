import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Home.css";

const Home = () => {
  const {
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
    selectPreviousFile,
    goToNext,
    goToPrevious,
    resetState,
  } = useContext(StoreContext);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <main className="home">
      <section className="upload-panel">
        <div className="card">
          <div className="section-heading">
            <h2>Import Data</h2>
            <p>Upload a file or paste a public Google Sheets link.</p>
          </div>

          <label className="file-upload">
            <span className="file-upload__title">Upload Excel or CSV</span>
            <span className="file-upload__text">
              Supported: .csv, .xlsx, .xls
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={onFileChange}
            />
          </label>

          <p className="selected-file">
            Selected file: {sourceName || "No file selected"}
          </p>

          <div className="sheet-import">
            <input
              type="text"
              placeholder="Paste Google Sheets URL"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
            />
            <button onClick={handleGoogleSheetImport}>Import Sheet</button>
          </div>

          <div className="previous-files">
            <h3>Previous Files</h3>
            {isHistoryLoading ? (
              <p className="message">Loading saved files...</p>
            ) : previousFiles.length ? (
              <div className="previous-files__list">
                {previousFiles.map((file) => (
                  <button
                    key={file._id}
                    type="button"
                    className={
                      file._id === selectedFileId
                        ? "previous-file active"
                        : "previous-file"
                    }
                    onClick={() => selectPreviousFile(file._id)}
                  >
                    <span className="previous-file__name">{file.fileName}</span>
                    <span className="previous-file__meta">
                      {file.totalUrls} URLs
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="message">No saved files yet.</p>
            )}
          </div>

          <div className="meta-row">
            <span>Source: {sourceName || "None selected"}</span>
            <span>{urls.length} URL{urls.length === 1 ? "" : "s"}</span>
          </div>

          {error && <p className="message error">{error}</p>}
          {isLoading && <p className="message">Processing data...</p>}

          {!!urls.length && (
            <div className="url-list">
              {urls.map((url, index) => (
                <button
                  key={url}
                  className={
                    index === currentIndex ? "url-pill active" : "url-pill"
                  }
                  onClick={() => setCurrentIndex(index)}
                >
                  <span className="url-pill__index">{index + 1}</span>
                  <span className="url-pill__text">{url}</span>
                </button>
              ))}
            </div>
          )}

          {!!urls.length && (
            <button className="clear-btn" onClick={resetState}>
              Clear List
            </button>
          )}
        </div>
      </section>

      <section className="viewer-panel">
        <div className="card viewer-card">
          <div className="viewer-topbar">
            <div className="section-heading">
              <h2>Website Viewer</h2>
              <p>
                {urls.length
                  ? `Showing ${currentIndex + 1} of ${urls.length}`
                  : "No website selected yet"}
              </p>
            </div>

            <div className="nav-buttons">
              <button onClick={goToPrevious} disabled={currentIndex === 0}>
                Previous
              </button>
              <button
                onClick={goToNext}
                disabled={!urls.length || currentIndex === urls.length - 1}
              >
                Next
              </button>
            </div>
          </div>

          {!currentUrl ? (
            <div className="empty-state">
              <h3>Upload a file to begin</h3>
              <p>Your websites will appear here after parsing.</p>
            </div>
          ) : (
            <>
              <div className="current-url-bar">
                <a href={currentUrl} target="_blank" rel="noreferrer">
                  {currentUrl}
                </a>
              </div>

              <div className="viewer-actions">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="open-link-btn"
                >
                  Open Website
                </a>
              </div>

              <div className="iframe-wrapper">
                <iframe
                  title="website-preview"
                  src={currentUrl}
                  className="website-frame"
                />
              </div>

              <p className="iframe-note">
                Some websites block iframe previews. If a page does not load
                here, use the open button.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
