# AI Funnel — Affiliate Bridge + Bonus Opt-in

A minimal Next.js (App Router) + Tailwind bridge funnel.

- `/` — Bridge page. Primary CTA sends traffic to the affiliate link. Secondary CTA links to `/bonus`.
- `/bonus` — Lead capture page. Submits email to `/api/subscribe` without reloading. On success, shows a confirmation plus a second button to the affiliate link.
- `/api/subscribe` — POST-only API route. Validates email and sends a notification to `support@briansanford.com` via Nodemailer.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000

---

## Setup (plain English)

Do these steps in order. Should take about 5 minutes.

**1. Set the affiliate link.**
Open `.env.local` in a text editor. On the line that says `NEXT_PUBLIC_AFFILIATE_URL=`, paste your real affiliate URL after the `=` sign. Example:
```
NEXT_PUBLIC_AFFILIATE_URL=https://your-affiliate-link.com?ref=you
```
That's it — both the bridge page button and the post-opt-in button on `/bonus` will use it automatically.

**2. Create a Gmail App Password.**
Nodemailer cannot log into Gmail with your normal password. You need an **App Password**.
- Go to https://myaccount.google.com/apppasswords (you must have 2-Step Verification turned on first — enable it at https://myaccount.google.com/security if you haven't).
- Pick "Mail" as the app and "Other" as the device (name it "AI Funnel" or similar).
- Google will show you a 16-character password like `abcd efgh ijkl mnop`. Copy it. You won't see it again.

**3. Paste the SMTP credentials into `.env.local`.**
In the same `.env.local` file you edited in step 1:
```
EMAIL_USER=your-full-gmail-address@gmail.com
EMAIL_PASS=paste-the-16-character-app-password-here
```
Leave `EMAIL_HOST`, `EMAIL_PORT`, and `EMAIL_TO` alone — they're already set correctly. You can remove the spaces from the App Password when you paste it, or leave them in — both work.

**4. Install dependencies.**
In your terminal, inside the project folder, run:
```
npm install
```

**5. Start the dev server.**
```
npm run dev
```
Open http://localhost:3000 in your browser. You should see the bridge page.

**6. Test the form on `/bonus`.**
- Go to http://localhost:3000/bonus
- Type a real email you control into the box and click "Send Me the Breakdown"
- You should see a green "You're in" success message and a new CTA to the affiliate link
- Check the inbox for `support@briansanford.com` — you should see a new email with the subject `New Lead Captured - AI Funnel` containing the email you submitted
- If it fails, you'll see a red error box on the page, and the dev server terminal will log the underlying reason (most common: wrong App Password, or 2-Step Verification not enabled on the Gmail account)

---

## 1. Where to replace the affiliate link

Two places read the same value. Easiest: set the env var and don't touch the code.

**Option A — env var (recommended):**
In `.env.local`:
```
NEXT_PUBLIC_AFFILIATE_URL=https://your-real-affiliate-link.com?ref=you
```

**Option B — hardcode:**
Edit the `AFFILIATE_URL` constant at the top of:
- `app/page.jsx`
- `app/bonus/page.jsx`

Both fall back to `https://example.com?ref=affiliate` if no env var is set.

---

## 2. Where to add real SMTP credentials

In `.env.local` (already scaffolded in `.env.local.example`):

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=support@briansanford.com
```

**Important — Gmail users:**
- `EMAIL_PASS` must be a **Gmail App Password**, NOT your normal Gmail password.
- Generate one at: https://myaccount.google.com/apppasswords
- 2-Step Verification must be enabled on the Google account first.

You can swap Gmail for any SMTP provider (SendGrid, Mailgun, Postmark, SES, Resend SMTP, etc.) by changing `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS`.

Restart the dev server after changing `.env.local`.

---

## 3. How to test the `/api/subscribe` route

**With the app running (`npm run dev`):**

```bash
# Happy path
curl -i -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# → 200 {"ok":true}  and a notification email to EMAIL_TO

# Missing email
curl -i -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{}'
# → 400 {"error":"Email is required."}

# Invalid email
curl -i -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email"}'
# → 400 {"error":"Please enter a valid email address."}

# Wrong method
curl -i http://localhost:3000/api/subscribe
# → 405 {"error":"Method not allowed."}
```

You can also test end-to-end through the UI: go to `/bonus`, submit an email, and confirm the success message appears and that `support@briansanford.com` receives the notification.

If sending fails, check the dev server terminal — errors are logged via `console.error` with enough detail to debug (missing env vars, auth failure, etc.).

---

## 4. Swapping in a real email service (ConvertKit / GoHighLevel / etc.) later

All email capture logic lives in one file:

**`app/api/subscribe/route.js`**

To plug in a proper ESP/CRM, replace the `transporter.sendMail(...)` call with an HTTP call to their API. For example:

**ConvertKit (add subscriber to a form):**
```js
await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email,
  }),
});
```

**GoHighLevel (create/update contact):**
```js
await fetch("https://services.leadconnectorhq.com/contacts/", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.GHL_API_KEY}`,
    "Version": "2021-07-28",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    locationId: process.env.GHL_LOCATION_ID,
  }),
});
```

You can keep the Nodemailer notification *and* add the ESP call — both in the same route — so leads flow into your CRM AND you get an instant email alert.

---

## Deploying to Vercel

This project is ready to deploy as-is. Push to GitHub, import the repo into Vercel, and in **Project Settings → Environment Variables** add the same six variables you used locally:

```
NEXT_PUBLIC_AFFILIATE_URL
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASS
EMAIL_TO
```

Notes:
- `NEXT_PUBLIC_AFFILIATE_URL` is baked in at build time. If you change it later in Vercel, click **Redeploy** so the new value gets picked up.
- `EMAIL_PASS` must still be a Gmail App Password, same as local.
- The `/api/subscribe` route is pinned to the Node.js runtime (Nodemailer does not run on Edge), so it will deploy as a standard serverless function. No extra config needed.

---

## Conversion notes (so you don't break it later)

- Email form is on `/bonus` only. **Do not** put it on `/` — that would reduce click-through to the affiliate offer.
- The primary CTA on `/` opens the affiliate link in a new tab (`target="_blank"`). Keeps the funnel window alive.
- After the opt-in succeeds on `/bonus`, the user is handed back to the affiliate link with a second CTA. The bonus captures the email *without stealing the click*.
