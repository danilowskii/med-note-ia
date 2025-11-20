import path from "node:path";
import fs from "node:fs";
import { file as tmpFile } from "tmp-promise";
import Groq from "groq-sdk";
import { float32ToWav } from "../utils/float32ToWav.js";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const groqPartialTranscription = async (
  webmBuffer: Buffer
): Promise<string> => {
  // cria arquivo temporário
  const { path: tmpPath, cleanup } = await tmpFile({ postfix: ".webm" });
  try {
    // grava o buffer no arquivo temporário
    await fs.promises.writeFile(tmpPath, webmBuffer);

    // cria readstream
    const stream = fs.createReadStream(tmpPath);

    const response = await groq.audio.transcriptions.create({
      file: stream,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
    });

    return response.text ?? "";
  } finally {
    // limpa arquivo temporário
    await cleanup();
  }
};
export const groqFullTranscription = async (
  webmBuffer: Buffer
): Promise<string> => {
  const { path: tmpPath, cleanup } = await tmpFile({ postfix: ".webm" });

  try {
    await fs.promises.writeFile(tmpPath, webmBuffer);

    const stream = fs.createReadStream(tmpPath);

    const response = await groq.audio.transcriptions.create({
      file: stream,
      model: "whisper-large-v3-turbo",
      response_format: "json",
    });
    return response.text ?? "";
  } finally {
    await cleanup();
  }
};
