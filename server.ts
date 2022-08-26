import storeRoute from './src/routes/store.route';
import clientRoute from "./src/routes/client.route";
import express from 'express';
import CartTimer from "./src/services/cartTimer"

// const cors = require("cors");
const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081",
// };

// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// simple route
app.get("/", (req: express.Request, res:express.Response) => {
  res.json({ message: "Welcome to online shop application." });
});

// db initilize
// require("./initilizeCourierApi");

app.use("/store", storeRoute);
app.use("/clients", clientRoute);

// cart timer
CartTimer.run();

// set port, listen for requests
// const PORT = process.env.PORT || 8080;
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;