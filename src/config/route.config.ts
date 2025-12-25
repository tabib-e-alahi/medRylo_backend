import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL as string,
  BACKEND_URL: process.env.BACKEND_URL as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  DEMO_USER_PASSWORD: process.env.DEMO_USER_PASSWORD || 'DemoPass@2024!',
  CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME as string,
  CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY as string,
  CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET as string,
  SMTP_HOST: process.env.SMTP_HOST as string,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
  SMTP_USER: process.env.SMTP_USER as string,
  SMTP_PASS: process.env.SMTP_PASS as string,
  SMTP_FROM: process.env.SMTP_FROM as string,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL as string,
  ADMIN_Name: process.env.ADMIN_Name as string,
  ADMIN_Email: process.env.ADMIN_Email as string,
  ADMIN_Password: process.env.ADMIN_Password as string,
  PHARMACY_Name: process.env.PHARMACY_Name as string,
  PHARMACY_Email: process.env.PHARMACY_Email as string,
  PHARMACY_Password: process.env.PHARMACY_Password as string,
  STAFF_Name: process.env.STAFF_Name as string,
  STAFF_Email: process.env.STAFF_Email as string,
  STAFF_Password: process.env.STAFF_Password as string,
  USER_Name: process.env.USER_Name as string,
  USER_Email: process.env.USER_Email as string,
  USER_Password: process.env.USER_Password as string,
  PENDING_OWNER_EMAIL: process.env.PENDING_OWNER_EMAIL as string,
  REJECTED_OWNER_EMAIL: process.env.REJECTED_OWNER_EMAIL as string,
};

export default envConfig