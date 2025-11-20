import { groqFullTranscription } from "./groq.service.js";

export const transcribeAudioBuffer = async (
  audioBuffer: Buffer
): Promise<string> => {
  const transcript = await groqFullTranscription(audioBuffer);
  return transcript;
};

export const transcribeText = async (text: string): Promise<string> => {
  return text.trim();
};
