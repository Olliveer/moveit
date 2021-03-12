import { VercelRequest, VercelResponse } from "@vercel/node";
import { Db, MongoClient } from "mongodb";
import url from "url";

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
    const { name, email, level, currentExperience, challengesCompleted } = req.body;

    const db = await connectToDatabase(process.env.DATABASE_URL);
    const users = db.collection('users');   
    const user = await users.findOne({ email: email, name: name });
    const rank = db.collection('rank');
    const userRank = await rank.findOne(user._id);

    if (!userRank) {
        await rank.insertOne({
            _id: user._id,
            level,
            currentExperience,
            challengesCompleted,
            createdAt: new Date(),
        })
        return res.status(201).json({ ok: true });
    }

    await rank.updateOne({ _id: user._id }, {
       $set: {
           level: level,
           currentExperience: currentExperience,
           challengesCompleted: challengesCompleted
       }
    })

    return res.status(201).json({ message: 'Rank updated' });
}