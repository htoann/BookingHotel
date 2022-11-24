import route from "./routes";
import logger from "./utils/logger";
import initDatabase from "./initDatabase";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

const forms = multer();
const app = express();

// App Setup
app.use(
  cors({
    origin: ["https://bookinghotels.vercel.app", "http://localhost:3000"],
    methods: "GET, POST, PUT, DELETE, PATCH",
    credentials: true,
    maxAge: 3600,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

initDatabase();

if (!process.env.JWT_SECRET) {
  const err = new Error("No JWT_SECRET in env variable");
  logger.warn(err.message);
}

// Routes Init
route(app);

// Server Setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server listening on: http://localhost:${PORT}`);
});
