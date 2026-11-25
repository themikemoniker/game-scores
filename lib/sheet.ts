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

const base = () => `https://sheets.googleapis.com/v4/spreadsheets/${env("GOOGLE_SHEET_ID")}`;

// All data rows of the `Games` tab (the header row is skipped), in one call.
export async function readGameRows(): Promise<string[][]> {
  const res = await client().request<{ values?: string[][] }>({ url: `${base()}/values/Games!A2:N` });
  return res.data.values ?? [];
}

// Appends one row (in COLUMNS order) after the last row of the `Games` tab. RAW keeps every value
// as typed text, so dates and IDs aren't reformatted by Sheets.
export async function appendGameRow(row: string[]): Promise<void> {
  await client().request({
    url: `${base()}/values/Games!A:N:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    method: "POST",
    data: { values: [row] },
  });
}

// Deletes the first row of the `Games` tab whose IGDB ID matches. No match (already gone) is a no-op.
export async function deleteGameRow(igdbId: number): Promise<void> {
  const [ids, meta] = await Promise.all([
    client().request<{ values?: string[][] }>({ url: `${base()}/values/Games!A:A` }),
    client().request<{ sheets: { properties: { sheetId: number; title: string } }[] }>({
      url: `${base()}?fields=sheets.properties(sheetId,title)`,
    }),
  ]);
  // Index 0 is the header row.
  const index = (ids.data.values ?? []).findIndex((r, i) => i > 0 && r[0]?.trim() === String(igdbId));
  if (index === -1) return;
  const sheetId = meta.data.sheets.find((s) => s.properties.title === "Games")!.properties.sheetId;
  await client().request({
    url: `${base()}:batchUpdate`,
    method: "POST",
    data: {
      requests: [
        { deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: index, endIndex: index + 1 } } },
      ],
    },
  });
}

// Replaces the rows for the given IGDB IDs (rows in COLUMNS order), all in one batch request.
// Each ID replaces the first row that has it; IDs with no row are skipped.
// ponytail: row numbers come from a read just before the write, so a row inserted or deleted by
// hand in between could shift them. Fine for one owner; lock or re-check if that ever bites.
export async function replaceGameRows(rows: Map<number, string[]>): Promise<void> {
  const ids = await client().request<{ values?: string[][] }>({ url: `${base()}/values/Games!A:A` });
  const data: { range: string; values: string[][] }[] = [];
  const seen = new Set<string>();
  (ids.data.values ?? []).forEach((r, i) => {
    const id = r[0]?.trim();
    const row = rows.get(Number(id));
    // Index 0 is the header row; Sheet row numbers start at 1.
    if (i === 0 || !row || seen.has(id)) return;
    seen.add(id);
    data.push({ range: `Games!A${i + 1}:N${i + 1}`, values: [row] });
  });
  if (data.length === 0) return;
  await client().request({
    url: `${base()}/values:batchUpdate`,
    method: "POST",
    data: { valueInputOption: "RAW", data },
  });
}
