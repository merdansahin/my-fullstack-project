import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Burada email servisi veya DB kaydı yapılabilir
  console.log("New contact message:", { name, email, message });

  res.status(200).json({ message: "Message received successfully" });
});

export default router;
