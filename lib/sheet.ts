import "server-only";
import { JWT } from "google-auth-library";

// Sheet storage: the only code that talks to Google Sheets (ADR 0001).
// Returns raw cell values; validation lives in Catalog read.

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

// One client per server process, so its access token is reused between calls.
let jwt: JWT | undefined;
const client = () =>
  (jwt ??= new JWT({
    email: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: env("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  }));

// All data rows of the `Games` tab (the header row is skipped), in one call.
export async function readGameRows(): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env("GOOGLE_SHEET_ID")}/values/Games!A2:N`;
  const res = await client().request<{ values?: string[][] }>({ url });
  return res.data.values ?? [];
}
