import * as jwt from 'jsonwebtoken';
import { Db, ObjectID } from 'mongodb';

const getUserFromToken = async (db: Db, token?: string) => {
  if (!token) {
    return null;
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

  if (!tokenData.id) {
    return null;
  }

  return db.collection('Users').findOne({ _id: new ObjectID(tokenData.id) });
};
export default getUserFromToken;
