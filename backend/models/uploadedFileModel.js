import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    urls: {
      type: [String],
      default: [],
    },
    totalUrls: {
      type: Number,
      default: 0,
    },
    sourceType: {
      type: String,
      enum: ["excel", "csv"],
      default: "excel",
    },
  },
  { timestamps: true },
);

const UploadedFile =
  mongoose.models.UploadedFile ||
  mongoose.model("UploadedFile", uploadedFileSchema);

export default UploadedFile;
