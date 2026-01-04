function buildReply(text) {
  const msg = text.trim().toLowerCase();

  if (msg === "hi" || msg === "hello") {
    return "Hello 👋 Thanks for messaging us. How can I help you today?";
  }

  if (msg.includes("help")) {
    return (
      "Here’s what I can help you with:\n" +
      "1️⃣ Order status\n" +
      "2️⃣ Support\n" +
      "3️⃣ Working hours\n\n" +
      "Reply with a number."
    );
  }

  return (
    "Thanks for your message 👍\n" +
    "Type *help* to see available options."
  );
}

module.exports = {buildReply};