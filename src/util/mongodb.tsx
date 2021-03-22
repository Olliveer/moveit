import { Db, MongoClient } from "mongodb";

let cachedDb: Db = null;

export async function connectToDatabase(uri: string) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        j: true
    });

    const dbName = new URL(uri);

    const db = client.db(dbName.pathname.substring(1));

    cachedDb = db;

    return db;
}