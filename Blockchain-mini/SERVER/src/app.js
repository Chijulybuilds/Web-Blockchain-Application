import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.send({ ok: true });
});

app.use(routes);

app.use((error, _req, res, _next) => {
  const status = Number(error.status) || 500;
  res.status(status).send({
    message: status === 500 ? "Internal server error" : error.message,
  });
});

export default app;
