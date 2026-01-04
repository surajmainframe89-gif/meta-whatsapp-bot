const axios = require("axios");

const { buildReply } = require("../logic/replyBuilder");
const { saveOutboundMessage } = require("../db_handle/db_repo");

const PHONE_NUMBER_ID = process.env.PHONE_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function sendReply(to, incomingText, parentMessageId) {

  try {
  
  const replyText = buildReply(incomingText)  
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: replyText },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

  const outboundMessageId = response.data.messages[0].id;

  await saveOutboundMessage(to, replyText, outboundMessageId, parentMessageId)
      console.log(`📤 REPLY sent to ${to} (in response to ${parentMessageId})`);
  
  } 
  catch (err) {
    console.error("❌ Failed to send reply:", err.response?.data || err.message);
  }
}
  
module.exports = { sendReply };
