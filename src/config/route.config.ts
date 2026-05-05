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
};

export default envConfig