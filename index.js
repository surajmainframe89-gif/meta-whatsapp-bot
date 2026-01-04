require("dotenv").config();


const PHONE_NUMBER_ID = process.env.PHONE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;


const express = require("express");
const bodyParser = require("body-parser");
const webhookRoutes = require("./webhook");

const app = express();
app.use(bodyParser.json());

//ENV check
if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

app.use("/webhook", webhookRoutes);


app.listen(3000, () => {
  console.log("Bot running on port 3000");
});