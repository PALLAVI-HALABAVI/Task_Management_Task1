exports.getBotResponse = (req, res) => {
  const { message } = req.body;

  const responses = {
    hello: "Hello! How can I assist you today?",
    help: "Sure! You can ask me about tasks, meetings, or your dashboard features.",
    task: "You can view your tasks in the Tasks section.",
    meeting: "Check your meetings under the Meetings section. Admins can schedule new ones.",
    bye: "Goodbye! Let me know if you need anything else.",
  };

  const key = message?.toLowerCase()?.trim();
  const reply = responses[key] || "I'm sorry, I didn't understand that. Try keywords like 'task', 'meeting', 'help'.";

  return res.status(200).json({ reply });
};
