import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  console.warn('MONGODB_URI is not set. MongoDB client will not initialize.');
}

let client: MongoClient | null = null;

export async function getDb() {
  if (!uri) throw new Error('Missing MONGODB_URI');
  if (!client) {
    client = new MongoClient(uri, {});
  }
  // Ensure connected by calling connect() once; MongoDB driver manages pooling internally
  await client.connect();
  return client;
}
