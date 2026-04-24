import "./globals.css";

export const metadata = {
  title: "Watch a Full AI Business Built Live in 60 Minutes",
  description:
    "A live demo where someone builds a full AI business — offer, brand, and lead system — in one session. Free, no pitch upfront.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
