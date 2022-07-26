import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

class Database {
  private instance: Firestore;

  constructor() {
    initializeApp({
      credential: cert("./sales-app-sa-key.json"),
    });
    this.instance = getFirestore();
  }

  async save(item: any) {
    const res = await this.instance.collection("sales").add(item);
    return res.id;
  }
}

export default new Database();
