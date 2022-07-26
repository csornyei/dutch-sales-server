import express from "express";
import { getJumboSales } from "./jumbo";
import db from "./database";

const { PORT } = process.env;

const app = express();

app.get("/", (_, res) => {
  res.send({
    message: "hello from the scrapper!",
  });
});

app.get("/jumbo", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
