import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { SalesList } from "./utils/types";

class Database {
  private instance: Firestore;

  constructor() {
    initializeApp({
      credential: cert(process.env.GCLOUD_CERT_FILE_PATH!),
    });
    this.instance = getFirestore();
  }

  async save(item: any) {
    const res = await this.instance.collection("sales").add(item);
    return res.id;
  }

  async saveListToDb(results: SalesList) {
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
                  const id = await this.save(sale);
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

    return await Promise.all(saveOps);
  }
}

export default new Database();
