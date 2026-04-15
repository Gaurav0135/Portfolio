import Contact from "../models/contact.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // save in DB
    const newMsg = new Contact({ name, email, message });
    await newMsg.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // email to YOU
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL,
      subject: "New Portfolio Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // auto reply to USER
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Thanks for contacting me",
      text: `Hi ${name},

Thanks for reaching out! I have received your message and will get back to you soon.

Best regards,
Gaurav`,
    });

    res.json({ msg: "Message sent & auto reply delivered" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};