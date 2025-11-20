import { type Request, type Response } from "express";
import { connectDB } from "../config/database.js";
import { type Report } from "../models/Appointment.model.js";

export const getReportsController = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const reports: Report[] = await db
      .collection<Report>("reports")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    res.status(500).json({ error: "Erro ao buscar relatórios." });
  }
};
