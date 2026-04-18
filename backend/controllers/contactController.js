import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const receiverEmail = process.env.CONTACT_RECEIVER || process.env.EMAIL;

    if (!process.env.EMAIL || !process.env.PASSWORD || !receiverEmail) {
      return res.status(500).json({ error: "Email service is not configured on server." });
    }

    // Save message in DB
    const newMsg = new Contact({ name, email, message });
    await newMsg.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Send incoming message to portfolio owner
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: receiverEmail,
      replyTo: email,
      subject: "New Portfolio Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    // Optional auto-reply to sender
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Thanks for contacting me",
      text: `Hi ${name},

Thanks for reaching out! I have received your message and will get back to you soon.

Best regards,
Gaurav`,
    });

    res.json({ msg: "Message sent successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};