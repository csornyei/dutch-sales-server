import express from "express";
import morgan from "morgan";
import { createWriteStream } from "fs";
import db from "./database";
import { getJumboSales } from "./jumbo";
import { compareStates } from "./site-state";
import { SupportedSites } from "./utils/types";
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

app.get("/jumbo", async (_, res) => {
  try {
    const updated = await compareStates(SupportedSites.jumbo);

    if (updated) {
      const results = await getJumboSales();

      const saveOps = [];

      for (const key in results) {
        if (Object.prototype.hasOwnProperty.call(results, key)) {
          const saleList = results[key];
          for (const saleKey in saleList) {
            if (Object.prototype.hasOwnProperty.call(saleList, saleKey)) {
              const sale = saleList[saleKey];
              saveOps.push(
                new Promise(async (res, rej) => {
                  try {
                    const id = await db.save(sale);
                    res(id);
                  } catch (error) {
                    rej(error);
                  }
                })
              );
            }
          }
        }
      }

      const result = await Promise.all(saveOps);

      res.send({
        result,
      });
    } else {
      res.send({
        message: "there are no updates!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
