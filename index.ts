import express from "express";
import morgan from "morgan";
import { getJumboSales } from "./jumbo";
import db from "./database";
import { createWriteStream, readFileSync } from "fs";
import { getPage } from "./puppeteer";
import packageJson from "./package.json";
import { compareStates, SupportedSites } from "./site-state";

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

app.get("/pup", async (_, res) => {
  try {
    const page = await getPage("https://google.com");
    const inputs = await page.$$("input");
    const values = [];
    for (const i in inputs) {
      const input = inputs[i];
      const value = await input.getProperty("value");
      values.push(await value.jsonValue());
    }
    res.send(values);
  } catch (error: any) {
    console.log(error);
    res.status(500).send((error as Error).message);
  }
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
