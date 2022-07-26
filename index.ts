import express from "express";
import { getJumboSales } from "./jumbo";

const { PORT } = process.env;

const app = express();

app.get("/", (_, res) => {
  res.send({
    message: "hello from the scrapper!",
  });
});

app.get("/jumbo", async (req, res) => {
  const results = await getJumboSales();
  res.send({
    results,
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
