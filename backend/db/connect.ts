import { MongoClient } from "mongodb";

const uri = "mongodb+srv://flatPrj:flatPrj2508@flat-project.ipg6e7g.mongodb.net/GC-flat-project"; // DB 이름 명시 안 해서 이런 듯
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");
    return client.db("GC-flat-project"); // 사용할 DB 이름
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
