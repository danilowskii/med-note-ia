import path from "node:path";
import fs from "node:fs";
import { file as tmpFile } from "tmp-promise";
import Groq, { toFile } from "groq-sdk";

import "dotenv/config";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const groqPartialTranscription = async (
  webmBuffer: Buffer
): Promise<string> => {
  // cria arquivo temporário

  try {
    //const { path: tmpPath, cleanup } = await tmpFile({ postfix: ".webm" });
    // ===== usando toFile aqui para enviar com segurança sem faltar os headers que groq pede
    const file = await toFile(webmBuffer, "partial-audio.webm");
    // grava o buffer no arquivo temporário
    //await fs.promises.writeFile(tmpPath, webmBuffer);

    // cria readstream
    //const stream = fs.createReadStream(tmpPath);

    const response = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
      temperature: 0.0,
    });

    return response.text ?? "";
  } catch (error) {
    console.error("Erro Groq Partial: ", error);
    return "";
  }
};
export const groqFullTranscription = async (
  webmBuffer: Buffer
): Promise<string> => {
  try {
    //const { path: tmpPath, cleanup } = await tmpFile({ postfix: ".webm" });
    //await fs.promises.writeFile(tmpPath, webmBuffer);
    const file = await toFile(webmBuffer, "full-audio.webm");
    //const stream = fs.createReadStream(tmpPath);

    const response = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "pt",
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Erro Groq Full:", error);
    throw error;
  }
};
