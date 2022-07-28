import { Router, Request, Response, NextFunction } from "express";
import db from "../database";
import { compareStates } from "../site-state";
import { SupportedSites } from "../utils/types";
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

router.get(
  "/jumbo",
  getUpdatedMiddleware(SupportedSites.jumbo),
  async (_, res) => {
    try {
      const results = await getJumboSales();

      const result = await db.saveListToDb(results);

      res.send({
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);

export default router;
