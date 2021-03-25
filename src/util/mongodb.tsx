// import { Db, MongoClient } from "mongodb";

// let cachedDb: Db = null;

// export async function connectToDatabase(uri: string) {
//     if (cachedDb) {
//         return cachedDb;
//     }

//     const client = await MongoClient.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     const dbName = new URL(uri);

//     const db = client.db(dbName.pathname.substring(1));

//     cachedDb = db;

//     return db;
// }

import { MongoClient } from "mongodb";
let cachedDb: any = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    console.log('👌 Using existing connection');
    return Promise.resolve(cachedDb);
  }

  return MongoClient.connect(process.env.MONGODB_URI, {
    native_parser: true,
    useUnifiedTopology: true
  })
    .then((client) => {
      let db = client.db(process.env.MONGODB);
      console.log('🔥 New DB Connection');
      cachedDb = db;
      return cachedDb;
    })
    .catch((error) => {
      console.log('Mongo connect Error');
      console.log(error);
    });
};

