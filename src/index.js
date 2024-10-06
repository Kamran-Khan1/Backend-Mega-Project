import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

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
