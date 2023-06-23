import express, { type Application } from "express";

const app: Application = express();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
