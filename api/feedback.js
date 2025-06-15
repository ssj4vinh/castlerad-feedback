import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send("Method Not Allowed");

  const { filename, content, token } = req.body;
  if (token !== 'castleRad2024SecureToken') return res.status(403).send("Unauthorized");
  if (!filename || !content) return res.status(400).send("Missing filename or content");

  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = '1mdFxd7N27KPC2S4GV-6msFc6zZ1wqtFX6kByJ1C-yw';
  const timestamp = new Date().toISOString();

  try {
    // Log available sheet titles for verification
    const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const sheetNames = metadata.data.sheets.map(s => s.properties.title);
    console.log("✅ Available sheet tabs:", sheetNames);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:C',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[timestamp, filename, content]]
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Google Sheets API Error:", error);
    return res.status(500).json({ error: error.message || 'Failed to write to Google Sheet' });
  }
}
