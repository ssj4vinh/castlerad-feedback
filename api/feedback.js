
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
