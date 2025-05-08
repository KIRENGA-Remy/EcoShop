import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export default generateToken;