import * as jwt from 'jsonwebtoken';
import { User } from '../types';

const signToken = (user: User) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
export default signToken;
