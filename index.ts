import express from "express";
import morgan from "morgan";
import { createWriteStream } from "fs";
import shopRoutes from "./shop";
import packageJson from "./package.json";

const { PORT } = process.env;

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
    status: "OK",
    uptime: process.uptime(),
    version: packageJson.version,
  });
});

app.use("/shop", shopRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
