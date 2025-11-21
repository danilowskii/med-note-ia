import { type Request, type Response } from "express";
import { contextualChat } from "../services/chat.service.js";

export async function chatController(req: Request, res: Response) {
  try {
    const { transcript, diagnose, question, lang } = req.body;

    if (!question) {
      return res.status(400).json({ error: "A pergunta é obrigatória." });
    }

    const result = await contextualChat(
      transcript,
      diagnose,
      question,
      lang || "pt"
    );

    return res.json(result);
  } catch (error) {
    console.error("Erro no chat contextual:", error);
    return res.status(500).json({
      error: "Erro interno ao gerar resposta contextual.",
    });
  }
}
