import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Run on the Node.js runtime (Nodemailer needs Node, not Edge)
export const runtime = "nodejs";

// Simple RFC-5322-ish email regex. Good enough for funnel opt-in validation.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email?.toString().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const {
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_TO,
      NEXT_PUBLIC_AFFILIATE_URL,
    } = process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
      console.error(
        "Missing SMTP env vars. Required: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS."
      );
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 }
      );
    }

    const port = Number(EMAIL_PORT);
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port,
      // 465 = implicit TLS, anything else (587/25) = STARTTLS
      secure: port === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // 1) Notification email to the site owner (existing behavior)
    await transporter.sendMail({
      from: `"AI Funnel" <${EMAIL_USER}>`,
      to: EMAIL_TO || "support@briansanford.com",
      subject: "New Lead Captured - AI Funnel",
      text: `You have a new lead. Email: ${email}`,
      html: `<p>You have a new lead.</p><p><strong>Email:</strong> ${email}</p>`,
    });

    // 2) Breakdown email to the person who submitted the form
    const affiliateUrl =
      NEXT_PUBLIC_AFFILIATE_URL || "https://example.com?ref=affiliate";

    const breakdownText = [
      "Hi there,",
      "",
      "Here's the simple breakdown I promised.",
      "",
      "The live demo is showing how an AI dashboard can bring the moving pieces of a business into one place.",
      "",
      "Here's what to watch for:",
      "",
      "1. The dashboard",
      "How the system brings tools, data, marketing, leads, and sales into one central place.",
      "",
      "2. The offer",
      "How the business idea gets shaped into something people can understand and respond to.",
      "",
      "3. The lead system",
      "How the AI system helps create marketing and lead flow instead of making you jump between a dozen tools.",
      "",
      "4. The sales path",
      "How the pieces connect so leads can move toward a real offer instead of getting lost.",
      "",
      "5. The big idea",
      "This is not just about using another AI tool. It is about seeing how AI can operate more like a business command center.",
      "",
      `You can watch the live demo here: ${affiliateUrl}`,
      "",
      "My suggestion: watch it with this question in mind:",
      "",
      '"What part of my business could be simplified if everything was connected in one dashboard?"',
      "",
      "Hope this helps,",
      "Brian",
    ].join("\n");

    const breakdownHtml = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#111;max-width:600px;margin:0 auto;padding:16px;">
  <p>Hi there,</p>
  <p>Here's the simple breakdown I promised.</p>
  <p>The live demo is showing how an AI dashboard can bring the moving pieces of a business into one place.</p>
  <p><strong>Here's what to watch for:</strong></p>
  <ol style="padding-left:20px;margin:0 0 16px;">
    <li style="margin-bottom:14px;"><strong>The dashboard</strong><br/>How the system brings tools, data, marketing, leads, and sales into one central place.</li>
    <li style="margin-bottom:14px;"><strong>The offer</strong><br/>How the business idea gets shaped into something people can understand and respond to.</li>
    <li style="margin-bottom:14px;"><strong>The lead system</strong><br/>How the AI system helps create marketing and lead flow instead of making you jump between a dozen tools.</li>
    <li style="margin-bottom:14px;"><strong>The sales path</strong><br/>How the pieces connect so leads can move toward a real offer instead of getting lost.</li>
    <li style="margin-bottom:14px;"><strong>The big idea</strong><br/>This is not just about using another AI tool. It is about seeing how AI can operate more like a business command center.</li>
  </ol>
  <p>You can watch the live demo here: <a href="${affiliateUrl}" style="color:#047857;font-weight:600;">${affiliateUrl}</a></p>
  <p>My suggestion: watch it with this question in mind:</p>
  <p style="font-style:italic;">"What part of my business could be simplified if everything was connected in one dashboard?"</p>
  <p>Hope this helps,<br/>Brian</p>
</div>`;

    try {
      await transporter.sendMail({
        from: `"Brian Sanford" <${EMAIL_USER}>`,
        to: email,
        subject: "Your AI Business Build Breakdown",
        text: breakdownText,
        html: breakdownHtml,
      });
    } catch (userMailErr) {
      console.error("Error sending breakdown email to user:", userMailErr);
      return NextResponse.json(
        { error: "Could not send the breakdown email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/subscribe:", err);
    return NextResponse.json(
      { error: "Could not process subscription." },
      { status: 500 }
    );
  }
}

// Block other methods cleanly
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
