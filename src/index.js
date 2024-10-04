import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB();

/*
//First approach
(async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
    app.listen(process.env.PORT, () => {
      app.on("error", (error) => {
        console.log("ERROR", error);
        throw error;
      });
    });
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
})();
*/
