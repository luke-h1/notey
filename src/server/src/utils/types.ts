import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

export type RegisterInput = Omit<User, '_id'>;

export type LoginInput = Omit<User, '_id' | 'name'>;
