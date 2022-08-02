import express from "express";
import morgan from "morgan";
import { createWriteStream } from "fs";
import shopRoutes from "./shop";
import packageJson from "./package.json";
import { checkStateFiles } from "./site-state";
import logger from "./logger";

const { PORT } = process.env;

checkStateFiles();

const app = express();

app.use(morgan("short"));
app.use(
  morgan("short", {
    stream: createWriteStream("./access.log", { flags: "a" }),
  })
);

app.get("/", (_, res) => {
  res.send({
    message: "hello from the scrapper!",
  });
});

app.get("/healthcheck", (req, res) => {
  res.send({
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
    version: packageJson.version,
  });
});

app.use("/shop", shopRoutes);

app.listen(PORT, () => {
  logger.log("info", `listening on port ${PORT}`);
});
