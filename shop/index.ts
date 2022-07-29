import { Router, Request, Response, NextFunction } from "express";
import db from "../database";
import { compareStates } from "../site-state";
import { SupportedSites } from "../utils/types";
import { getAHSales } from "./ah";
import { getJumboSales } from "./jumbo";

const router = Router();

function getUpdatedMiddleware(site: SupportedSites) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const updated = await compareStates(site);
    if (updated) {
      next();
    } else {
      res.status(404).send({
        message: "there are no updates!",
      });
    }
  };
}

router.get("/", (_, res) => {
  res.send(
    `
      <h1>Current shops</h1>
      <ul>
        <li>
          <a href="/shop/jumbo">Jumbo</a>
        </li> 
        <li>
          <a href="albert-heijn">Albert Heijn</a>
        </li>
      </ul>
    `
  );
});

router.get(
  "/jumbo",
  getUpdatedMiddleware(SupportedSites.jumbo),
  async (_, res) => {
    try {
      const results = await getJumboSales();
      let result: any[];
      if (process.env.NODE_ENV === "production") {
        result = await db.saveListToDb(results);
      } else {
        result = [];
      }

      res.send({
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);

router.get(
  "/albert-heijn",
  getUpdatedMiddleware(SupportedSites.albertHeijn),
  async (_, res) => {
    try {
      const results = await getAHSales();

      let result: any[];
      if (process.env.NODE_ENV === "production") {
        result = await db.saveListToDb(results);
      } else {
        result = [];
      }

      res.send({
        results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);

export default router;
