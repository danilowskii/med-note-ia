import { type Request, type Response } from "express";
import { generateDiagnose } from "../services/diagnose.service.js";

export const diagnoseController = async (req: Request, res: Response) => {
  try {
    const { transcript, appointmentType, appointmentNotes, speciality } =
      req.body;

    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({
        error: "O campo 'transcript' é obrigatório e deve ser uma string.",
      });
    }

    const savedReport = await generateDiagnose(
      transcript,
      appointmentType || "Presencial",
      appointmentNotes || "",
      speciality || "Clínica Médica"
    );
    console.log("Criado em diagnose controller:", savedReport);
    return res.status(201).json({
      message: "Diagnóstico gerado com sucesso.",

      report: savedReport,
    });
  } catch (error) {
    console.error("Erro no diagnoseController:", error);

    return res.status(500).json({
      error: "Erro ao gerar diagnóstico.",
    });
  }
};
