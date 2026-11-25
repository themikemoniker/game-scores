import { fontVariables } from "../fonts";
import "../globals.css";

// The admin page has its own root layout: English only, outside the locale prefix.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
