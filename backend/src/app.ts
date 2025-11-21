import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
//=========== middlewares globais ========
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));

//logger para acompanhar requisicoes
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("MedNote API funcionando");
});

//=========== rotas ===========
const apiVersion: string = "/api/v1";
app.use(`${apiVersion}`, routes); //config ficou /api/v1/nome da rota

export default app;
