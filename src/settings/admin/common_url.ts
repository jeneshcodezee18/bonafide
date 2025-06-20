import app from "../../app";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Request } from "express";



export function bindURL() {
  const storage = multer.diskStorage({
    destination: "uploads",
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const originalnameWithoutSpaces = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}_${originalnameWithoutSpaces}`);
    },
  });

  const upload = multer({ storage });
  app.post(
    "/admin/upload",
    upload.single("file"),
    async (req: any, res: any) => {
      try {
        const oldImagePath = req?.body.oldImagePath;
        if (oldImagePath) {
          const filePath = path.join(
            __dirname,
            "../../../uploads",
            path.basename(oldImagePath)
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        if (req.file) {
          // File uploaded successfully, return the file path
          const imagePath = `/${req.file.filename}`;
          res.json({ filePath: imagePath });
        } else {
          // Error during file upload
          res.status(500).json({ error: "Error during file upload" });
        }
      } catch (error) {
        // Catch any errors and return a response
        console.error("Error during file upload:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
}
