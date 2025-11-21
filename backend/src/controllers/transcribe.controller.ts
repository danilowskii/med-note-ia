import { type Request, type Response } from "express";
import multer from "multer";
import {
  transcribeAudioBuffer,
  transcribeText,
} from "../services/transcribe.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "audio/webm") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos .webm são permitidos"));
    }
  },
});

export const transcribeController = async (req: Request, res: Response) => {
  try {
    // se veio arquivo via multipart (multer coloca em req.file)
    if (req.file && req.file.buffer) {
      const transcript = await transcribeAudioBuffer(req.file.buffer);
      return res.status(200).json({ transcript });
    } else {
      console.log("Caiu aqui, req.file do transcribe.controller");
    }
    // se for enviado json para teste
    if (req.body && typeof req.body.text === "string") {
      const transcript = await transcribeText(req.body.text);
      return res.status(200).json({ transcript });
    }
    //se nao cair em nenhum if
    return res.status(400).json({
      error:
        "Envie um arquivo no campo 'audio' (multipart/form-data) ou JSON com 'text'.",
    });
  } catch (error) {
    console.error("transcribeController error:", error);
    return res.status(500).json({ error: "Erro ao processar transcrição." });
  }
};

export const uploadAudioMiddleware = upload.single("audio");
