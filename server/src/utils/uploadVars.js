import multer from "multer";
import path from "path";
import ValidationError from "./errors/ValidationError.js";
import fs from "fs";

const DIR = path.resolve("public/images/");
const DIR2 = path.resolve("public/");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        "Invalid file type. Only PNG, JPG, and JPEG are allowed."
      )
    );
  }
};
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export const deleteImageFromStorage = (imagePath) => {
  const fullPath = path.join(DIR2, imagePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Failed to delete image at ${fullPath}:`, err);
    } else {
      console.log(`Image deleted: ${fullPath}`);
    }
  });
};
