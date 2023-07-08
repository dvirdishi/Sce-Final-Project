import { MongoClient } from "mongodb";

const uri = "mongodb+srv://dvirdishi:t5Jydy4cVlutlnOw@cluster0.elho4ao.mongodb.net/test";

async function main() {
  const client = await MongoClient.connect(uri);
  try {
    const command = process.argv[2];

    switch (command) {
      case "rm":
        await client.db("detections_db").collection("detections").deleteMany({});
        break;
      default:
        console.log("Invalid command");
        break;
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
}

main();
