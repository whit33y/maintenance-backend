import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_DATABASE"];

for (const env of requiredEnv) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
