import express from "express";
import morgan from "morgan";
import { createWriteStream } from "fs";
import shopRoutes from "./shop";
import packageJson from "./package.json";
import { checkStateFiles } from "./site-state";
import logger from "./logger";
import os from "os";

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
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const usage = (totalMemory - freeMemory) / totalMemory;
  const memory = {
    free: freeMemory,
    total: totalMemory,
    usage: `${Math.round(usage * 1000) / 10}%`,
  };
  const [one, five, fifteen] = os.loadavg();
  res.json({
    env: process.env.NODE_ENV,
    system_uptime: os.uptime(),
    uptime: process.uptime(),
    memory,
    loadAvg: {
      1: one,
      5: five,
      15: fifteen,
    },
    version: packageJson.version,
  });
});

app.use("/shop", shopRoutes);

app.listen(PORT, () => {
  logger.log("info", `listening on port ${PORT}`);
});
