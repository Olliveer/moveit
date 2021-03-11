import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';
import url from 'url';

let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const dbName = url.parse(uri).pathname.substr(1);

    const db = client.db(dbName);

    cachedDb = db;

    return db;
}

export default async (req: VercelRequest, res: VercelResponse) => {
    const { name, email, password } = req.body;

    const db = await connectToDatabase(process.env.DATABASE_URL);

    const collection = db.collection('users');

    await collection.insertOne({
        name,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    return res.status(201).json({ ok: true });
}