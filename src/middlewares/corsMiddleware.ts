import { config } from "dotenv";
import { CorsOptions } from "cors";

config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

export const corsOptions: CorsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin) return callback(null, true); // Allow requests with no origin (e.g. mobile apps)
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
