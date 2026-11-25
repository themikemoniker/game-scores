// Checks the Sheet is reachable with the app's env vars and prints its tabs and the `Games`
// header and names, never any secret. Run: node --env-file=.env.local scripts/check-sheet.mjs
import { JWT } from "google-auth-library";

const e = process.env;
const client = new JWT({
  email: e.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: e.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const base = `https://sheets.googleapis.com/v4/spreadsheets/${e.GOOGLE_SHEET_ID}`;

try {
  const meta = await client.request({ url: `${base}?fields=sheets.properties.title` });
  console.log("tabs:", meta.data.sheets.map((s) => s.properties.title));
  const { data } = await client.request({ url: `${base}/values/Games!A1:N` });
  const [header = [], ...rows] = data.values ?? [];
  console.log("header:", header.join(", "));
  console.log(`${rows.length} data rows:`, rows.map((r) => r[2]));
} catch (err) {
  console.log("error:", err.status ?? "", err.message);
}
