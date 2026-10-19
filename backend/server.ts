import app from "./src/app.js";
import { env } from "./src/config/env.js";

const stratServer = () => {
  try {
    //db

    app.listen(Number(env.PORT), "0.0.0.0", () => {
      console.log(`Example app listening on port ${env.PORT} 🚀`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

stratServer();

const port = Number(process.env.PORT) || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
