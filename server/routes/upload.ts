import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { requireAuth } from "./auth";

const router: IRouter = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => { cb(null, path.resolve(process.cwd(), "uploads")); },
  filename: (_req, file, cb) => { cb(null, `${randomUUID()}${path.extname(file.originalname)}`); },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg","image/png","image/webp","image/gif","video/mp4","video/webm","video/ogg"];
    cb(allowed.includes(file.mimetype) ? null : new Error("Invalid file type"), allowed.includes(file.mimetype));
  },
});

router.post("/upload", requireAuth, upload.single("file"), (req, res): void => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  res.json({ url: `/api/uploads/${req.file.filename}`, filename: req.file.filename });
});

export default router;
