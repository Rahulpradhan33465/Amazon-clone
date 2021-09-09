// import db from '../../utils/db';
import dotenv from 'dotenv';
dotenv.config();
export default async function handler(req, res) {
  // db.connect();
  // db.disconnect();

  res.status(200).json({ message: 'Welcome To home page' });
}
