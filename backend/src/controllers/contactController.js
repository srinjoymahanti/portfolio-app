import nodemailer from "nodemailer";

export async function postContact(req, res, next) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are all required." });
  }

  // If email credentials are not configured, accept the message but skip sending.
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("[CONTACT] (email not configured) message received:", { name, email, message });
    return res.json({ success: true, note: "Message received (email delivery not configured)." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
