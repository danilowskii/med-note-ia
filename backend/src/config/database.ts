import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export const client = new MongoClient(process.env.MONGOURI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (!db) {
    try {
      //conectando cliente ao server
      await client.connect();
      db = client.db("medNote");
      //enviando ping para confirmar sucesso
      await client.db("admin").command({ ping: 1 });
      console.log("Conexão com MongoDB realizada com sucesso");
      return client.db("medNote");
    } catch (error) {
      console.error("Erro ao conectar ao MongoDB.", error);
      process.exit(1); //se der erro critico encerra conexão
    }
  }
  return db;
}
connectDB().catch(console.dir);
