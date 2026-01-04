
const express = require("express");
const router  = express.Router();

const {
  isMessageAlreadyProcessed,
  saveInboundMessage,
  saveStatusEvents
} = require("./db_handle/db_repo");

const { sendReply } = require("./services/whatsappService");

//---------------------------------------------------------------------------------------------------------------------

router.get("/health", (req, res) => {
  try{
        res.status(200).json({
        status: "UP",
        service: "whatsapp-webhook",
        timestamp: new Date().toISOString()
        });
  }  
  catch(err) 
  {
        console.error("🔥 GET health processing failed:", err);
        return res.sendStatus(200); // NEVER 500
  }
    
});
//Inform meta cloud api that you own the webhook
router.get("/", (req, res) => {
  try{
  const VERIFY_TOKEN = "my_verify890_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } 
  else {
    res.sendStatus(403);
  }
  }
  catch (err) {
    console.error("🔥 GET Webhook processing failed:", err);
    return res.sendStatus(200); // NEVER 500
  }
 
});
//---------------------------------------------------------------------------------------------------------------------
// Webhook endpoint to receive messages from WhatsApp subscriber
router.post("/", async (req, res) => {
  
  try{
  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;

  // 1️⃣ Incoming user message
  if (value?.messages) {
    const msg = value.messages[0];
    const from = msg.from;
    const text = msg.text?.body;
    const messageId = msg.id;

    if (msg.type !== "text" || !text) {
        console.log("ℹ️ Non-text message ignored");
        return res.sendStatus(200);
    }

    console.log("📩 Incoming message:", from, text);

  //Idempotency check

    const alreadyProcessed = await isMessageAlreadyProcessed(messageId);

    if (alreadyProcessed) {
      console.log(`🔁 Duplicate message ignored: ${messageId}`);
      return res.sendStatus(200); //stops further processing and exits 
    }

    await saveInboundMessage(msg);
  //If all good then build reply and send outbound message from whatsappService.js
    await sendReply(from, text, messageId);
  }

  // 🔹 STATUS UPDATES
  if (value?.statuses) {
    const status = value.statuses[0];

    await saveStatusEvents(status,status.id);

    console.log(
        `📬 STATUS ${status.status.toUpperCase()} for message ${status.id}`
     );
    
   }
  }
  catch (err) {
    console.error("🔥 POST Webhook processing failed:", err);
    return res.sendStatus(200); // NEVER 500
  }

  res.sendStatus(200);
});

//---------------------------------------------------------------------------------------------------------------------

module.exports = router;

    
