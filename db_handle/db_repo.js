const db = require("../db");

function isMessageAlreadyProcessed(messageId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 1 FROM whatsapp_events 
       WHERE event_type = 'inbound_message' AND message_id = ?`,
      [messageId],
      (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      }
    );
  });
}


function saveInboundMessage(msg) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO whatsapp_events
       (event_type, message_id, from_number, to_number, text, status, parentMessageId, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "inbound_message",
        msg.id,
        msg.from,
        "BUSINESS",
        msg.text.body,
        null,
        "Parent-msg",
        new Date().toISOString()
      ],
      err => {
        if (err) {
            console.error("DB insert failed for Inbound msg:", err.message);
            reject(err);
        }
        else{
            resolve(this.id);
        }        
      }
    );
  });
}

function saveOutboundMessage(to, replyText, outboundMessageId, parentMessageId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO whatsapp_events
       (event_type, message_id, from_number, to_number, text, status, parentMessageId, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "outbound_message",
        outboundMessageId,
        "BUSINESS",
        to,
        replyText,
        "sent",
        parentMessageId,
        new Date().toISOString()
      ],
      (err) => {
        if (err) {
            console.error("DB insert failed for Outbound msg:", err.message);
            reject(err);
        }
        else{
            resolve(this.id);
        }
      });
  });
}

function saveStatusEvents(status, parentId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO whatsapp_events
       (event_type, message_id, from_number, to_number, text, status, parentMessageId, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "status",
        status.id,
        null,
        null,
        null,
        status.status,
        parentId,
        new Date().toISOString()
      ],
      (err) => {
        if (err) {
            console.error("❌ DB insert failed for status:", err.message);
            reject(err);
        }
        else{
            resolve(this.id);
        }
      }
    );
  });
}

module.exports = {isMessageAlreadyProcessed,saveInboundMessage,saveOutboundMessage,saveStatusEvents};