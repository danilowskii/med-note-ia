import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

app.get("/", (req: Request, res: Response) => {
  res.json("Eu estou funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
