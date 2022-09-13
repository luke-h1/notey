import * as jwt from 'jsonwebtoken';

const signToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
export default signToken;
