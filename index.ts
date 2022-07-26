import express from "express";
import morgan from "morgan";
import { getJumboSales } from "./jumbo";
import db from "./database";
import { createWriteStream } from "fs";

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

app.get("/jumbo", async (_, res) => {
  try {
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
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
