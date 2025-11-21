import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// ====================== CORS CONFIG ======================
const allowedOrigins = [
  process.env.CLIENT_ORIGIN, // localhost
  process.env.CLIENT_PROD, // produção
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  next();
});

// ====================== MIDDLEWARES GLOBAIS ======================
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

// ====================== HEALTH CHECK ======================
app.get("/", (req, res) => {
  res.send("MedNote API funcionando");
});

// ====================== ROTAS ======================
const apiVersion = "/api/v1";
app.use(apiVersion, routes);

export default app;
