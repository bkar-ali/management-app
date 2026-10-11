import app from "./src/app.js";
import { env } from "./src/config/env.js";

const stratServer = () => {
  try {
    //db

    app.listen(env.PORT, () => {
      console.log(`Example app listening on port ${env.PORT} 🚀`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

stratServer();
