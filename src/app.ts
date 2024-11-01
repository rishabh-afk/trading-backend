import 'colors';
import cors from "cors";
import colors from 'colors';
import helmet from "helmet";
import express from "express";
import router from './routes';
import { logger } from "./config/logger";
import { corsOptions } from "./middlewares/corsMiddleware";
import { notFoundHandler } from './middlewares/notFounHandler';
import { globalErrorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const startTime = process.hrtime();
  res.on("finish", () => {
    const fetchStatus = () => {
      if (res.statusCode >= 500) return colors.red(`${res.statusCode}`)
      else if (res.statusCode >= 400) return colors.yellow(`${res.statusCode}`)
      else if (res.statusCode >= 300) return colors.cyan(`${res.statusCode}`)
      else if (res.statusCode >= 200) return colors.green(`${res.statusCode}`)
      else return colors.white(`${res.statusCode}`)
    }
    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    logger.info(
      `${'METHOD:'.blue} ${req.method.yellow} - ${'URL:'.blue} ${req.originalUrl.yellow} - ${'STATUS:'.blue} ${fetchStatus()} - ${'IP:'.blue} ${req.ip ? req.ip.yellow : ""} - ${'Response Time:'.blue} ${responseTime.magenta} ${'ms'.magenta}`
    );
  });
  next();
});

// Handle API Routes
app.use("/api", router);

// Handle 404 errors
app.use(notFoundHandler);

// Handle global errors
app.use(globalErrorHandler);

export default app;
