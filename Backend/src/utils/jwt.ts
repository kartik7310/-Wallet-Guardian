import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken';

interface Payload{
  id:number,
  email?:string
}
const JWT_SECRET = process.env.JWT_SECRET;
export async function generateJWTToken(payload:Payload): Promise<string> {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn:'1h',
  });
}
