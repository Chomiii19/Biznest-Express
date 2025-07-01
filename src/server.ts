import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB = `${process.env.DB}`.replace(
  "<db_password>",
  process.env.DB_PASSWORD as string,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Successfully connected to DB...");
    app.listen(PORT, () =>
      console.log("Successfully connected to port: ", PORT),
    );
  })
  .catch((err) => console.error("Failed connection to DB: ", err));
