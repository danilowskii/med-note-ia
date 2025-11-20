import express, { urlencoded } from "express";
import cors from "cors";
import doenv from "dotenv";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

doenv.config();

const app = express();
//=========== middlewares globais ========
app.use(
  cors({
    origin: [process.env.URL_PROD || process.env.URL_DEV!],
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));

//logger para acompanhar requisicoes
app.use(morgan("dev"));

//=========== rotas ===========
app.use("/api", routes); //config ficou /api/v1/nome da rota

//============= middleware de erro global ===========
app.use(errorHandler);

export default app;
