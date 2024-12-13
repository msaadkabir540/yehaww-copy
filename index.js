const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const cors = require("cors");
const compression = require("compression");
const { cronJob } = require("./controllers/job");
const { cronEmailExpiry } = require("./controllers/auth");

const fileUpload = require("express-fileupload");
require("dotenv").config();

const dbConnection = require("./config/database");
const corsOption = {
  origin: true,
  credentials: true,
  exposedHeaders: ["authorization"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(compression());

app.use(
  fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors(corsOption));
app.use("/", require("./app/app"));

const server = http.createServer(app);

app.use("/public", express.static(path.join(__dirname, "./public")));

const setPort = process.env.PORT || 8080;

cronJob.start();
cronEmailExpiry.start();

dbConnection().then(() => {
  server.listen(setPort, () => console.log(`Yehaww running on PORT # ${setPort}`));
});
