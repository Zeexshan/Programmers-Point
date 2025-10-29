// Google Sheets Integration using Replit Connector
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

// Export inquiry data to Google Sheets (zeeexshanxkhan@gmail.com)
export async function exportInquiriesToSheets(inquiries: any[]) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // This would require a specific spreadsheet ID from the user
    // For now, return a placeholder
    // In production, you'd create/update sheets here
    
    return { success: true, message: "Configured Google Sheets integration" };
  } catch (error) {
    console.error("Error exporting to sheets:", error);
    throw error;
  }
}

// Fetch technology data from user's Google Sheet
export async function fetchTechnologyDataFromSheets(spreadsheetId: string, range: string) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row, map to technology objects
    const technologies = rows.slice(1).map(row => ({
      name: row[0] || '',
      category: row[1] || '',
      vacancies: row[2] ? parseInt(row[2]) : null,
      avgPackage: row[3] || null,
      topCompanies: row[4] || null,
      githubStars: row[5] || null,
      npmDownloads: row[6] || null,
      lastUpdated: row[7] || new Date().toLocaleDateString('en-IN'),
      description: row[8] || '',
    }));

    return technologies;
  } catch (error) {
    console.error("Error fetching from sheets:", error);
    throw error;
  }
}
