import express from "express";
import databaseService from "./services/database.service.js";
import userRoute from "./routes/users.route.js";

const PORT = 4000;
const app = express();

app.use(express.json());

databaseService.connect();

app.use("/users", userRoute);

app.use((err, req, res, next) => {
  if (err.message) {
    return res.json({ error: err.message });
  } else {
    return res.json({ err });
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error", err);
    return;
  }
  console.log(`Your app is listening on port ${PORT}`);
});
