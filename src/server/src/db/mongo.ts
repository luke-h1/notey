import { MongoClient } from 'mongodb';

const setupDb = async (): Promise<MongoClient> => {
  const client = new MongoClient(process.env.DATABASE_URL as string, {
    maxPoolSize: 50,
  });

  await client.connect();
  return client;
};
export default setupDb;
