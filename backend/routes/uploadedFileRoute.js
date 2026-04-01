import express from "express";
import multer from "multer";
import {
  getUploadedFileById,
  getUploadedFiles,
  uploadFile,
} from "../controllers/uploadedFileController.js";

const uploadedFileRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

uploadedFileRouter.post("/upload", upload.single("file"), uploadFile);
uploadedFileRouter.get("/", getUploadedFiles);
uploadedFileRouter.get("/:id", getUploadedFileById);

export default uploadedFileRouter;
