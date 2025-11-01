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

const SPREADSHEET_ID = '1q1mo556ComV_PkDb14wmZcP6Tv__aB6Q2qCfhElmFaU';

// ========== TECHNOLOGIES SHEET ==========

export async function readTechnologies() {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Technologies!A2:J', // Skip header row
    });

    const rows = response.data.values || [];
    
    return rows.map(row => ({
      name: row[0] || '',
      category: row[1] || '',
      subCategory: row[2] || '',
      displayOrder: parseInt(row[3]) || 0,
      vacancies: parseInt(row[4]) || 0,
      fresherPackage: row[5] || '',
      experiencedPackage: row[6] || '',
      topCompanies: row[7] || '',
      popularityScore: parseInt(row[8]) || 5,
      description: row[9] || '',
    }));
  } catch (error) {
    console.error("Error reading technologies from sheets:", error);
    throw error;
  }
}

export async function writeTechnologies(technologies: any[]) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // First, clear existing data (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Technologies!A2:J',
    });
    
    // Prepare data rows
    const rows = technologies.map(tech => [
      tech.name,
      tech.category,
      tech.subCategory || '',
      tech.displayOrder || 0,
      tech.vacancies || 0,
      tech.fresherPackage || '',
      tech.experiencedPackage || '',
      tech.topCompanies || '',
      tech.popularityScore || 5,
      tech.description || '',
    ]);
    
    // Write data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Technologies!A2:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
    
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("Error writing technologies to sheets:", error);
    throw error;
  }
}

export async function updateTechnology(name: string, updates: any) {
  try {
    const technologies = await readTechnologies();
    const index = technologies.findIndex(t => t.name === name);
    
    if (index === -1) {
      throw new Error(`Technology ${name} not found`);
    }
    
    technologies[index] = { ...technologies[index], ...updates };
    await writeTechnologies(technologies);
    
    return technologies[index];
  } catch (error) {
    console.error("Error updating technology:", error);
    throw error;
  }
}

export async function deleteTechnology(name: string) {
  try {
    const technologies = await readTechnologies();
    const filtered = technologies.filter(t => t.name !== name);
    await writeTechnologies(filtered);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting technology:", error);
    throw error;
  }
}

// ========== COMBINATIONS SHEET ==========

export async function readCombinations() {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Combinations!A2:H', // Skip header row
    });

    const rows = response.data.values || [];
    
    return rows.map(row => ({
      technologies: (row[0] || '').split(',').map((t: string) => t.trim()),
      jobRole: row[1] || '',
      category: row[2] || '',
      vacancies: parseInt(row[3]) || 0,
      fresherPackage: row[4] || '',
      experiencedPackage: row[5] || '',
      topCompanies: (row[6] || '').split(',').map((c: string) => c.trim()),
      popularityScore: parseInt(row[7]) || 5,
    }));
  } catch (error) {
    console.error("Error reading combinations from sheets:", error);
    throw error;
  }
}

export async function writeCombinations(combinations: any[]) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // First, clear existing data (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Combinations!A2:H',
    });
    
    // Prepare data rows
    const rows = combinations.map(combo => [
      Array.isArray(combo.technologies) ? combo.technologies.join(', ') : combo.technologies,
      combo.jobRole || '',
      combo.category || '',
      combo.vacancies || 0,
      combo.fresherPackage || '',
      combo.experiencedPackage || '',
      Array.isArray(combo.topCompanies) ? combo.topCompanies.join(', ') : combo.topCompanies,
      combo.popularityScore || 5,
    ]);
    
    // Write data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Combinations!A2:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
    
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("Error writing combinations to sheets:", error);
    throw error;
  }
}

export async function updateCombination(jobRole: string, updates: any) {
  try {
    const combinations = await readCombinations();
    const index = combinations.findIndex(c => c.jobRole === jobRole);
    
    if (index === -1) {
      throw new Error(`Combination ${jobRole} not found`);
    }
    
    combinations[index] = { ...combinations[index], ...updates };
    await writeCombinations(combinations);
    
    return combinations[index];
  } catch (error) {
    console.error("Error updating combination:", error);
    throw error;
  }
}

export async function deleteCombination(jobRole: string) {
  try {
    const combinations = await readCombinations();
    const filtered = combinations.filter(c => c.jobRole !== jobRole);
    await writeCombinations(filtered);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting combination:", error);
    throw error;
  }
}

// ========== COMPANIES SHEET ==========

export async function readCompanies() {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Companies!A2:D', // Skip header row
    });

    const rows = response.data.values || [];
    
    return rows.map(row => ({
      name: row[0] || '',
      logoUrl: row[1] || '',
      totalPlacements: parseInt(row[2]) || 0,
      avgPackage: row[3] || '',
    }));
  } catch (error) {
    console.error("Error reading companies from sheets:", error);
    throw error;
  }
}

export async function writeCompanies(companies: any[]) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // First, clear existing data (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Companies!A2:D',
    });
    
    // Prepare data rows
    const rows = companies.map(company => [
      company.name,
      company.logoUrl || '',
      company.totalPlacements || 0,
      company.avgPackage || '',
    ]);
    
    // Write data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Companies!A2:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
    
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("Error writing companies to sheets:", error);
    throw error;
  }
}

// ========== PLACEMENTS SHEET ==========

export async function readPlacements() {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Placements!A2:I', // Skip header row
    });

    const rows = response.data.values || [];
    
    return rows.map(row => ({
      studentName: row[0] || '',
      company: row[1] || '',
      package: row[2] || '',
      phone: row[3] || '',
      photoUrl: row[4] || '',
      profile: row[5] || '',
      course: row[6] || '',
      review: row[7] || '',
      joiningDate: row[8] || '',
    }));
  } catch (error) {
    console.error("Error reading placements from sheets:", error);
    throw error;
  }
}

export async function writePlacements(placements: any[]) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // First, clear existing data (except header)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Placements!A2:I',
    });
    
    // Prepare data rows
    const rows = placements.map(placement => [
      placement.studentName,
      placement.company,
      placement.package || '',
      placement.phone || '',
      placement.photoUrl || '',
      placement.profile || '',
      placement.course || '',
      placement.review || '',
      placement.joiningDate || '',
    ]);
    
    // Write data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Placements!A2:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
    
    return { success: true, count: rows.length };
  } catch (error) {
    console.error("Error writing placements to sheets:", error);
    throw error;
  }
}

// ========== INQUIRIES SHEET ==========

export async function readInquiries() {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inquiries!A2:J', // Skip header row
    });

    const rows = response.data.values || [];
    
    return rows.map(row => ({
      timestamp: row[0] || '',
      name: row[1] || '',
      fatherName: row[2] || '',
      phone: row[3] || '',
      email: row[4] || '',
      dob: row[5] || '',
      courseInterest: row[6] || '',
      college: row[7] || '',
      branch: row[8] || '',
      status: row[9] || 'Pending',
    }));
  } catch (error) {
    console.error("Error reading inquiries from sheets:", error);
    throw error;
  }
}

export async function appendInquiry(inquiry: any) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    const row = [
      new Date().toISOString(),
      inquiry.name,
      inquiry.fatherName,
      inquiry.phone,
      inquiry.email,
      inquiry.dob,
      inquiry.courseInterest,
      inquiry.college,
      inquiry.branch,
      inquiry.status || 'Pending',
    ];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inquiries!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error appending inquiry to sheets:", error);
    throw error;
  }
}

export async function updateInquiryStatus(phone: string, status: string) {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // Read all inquiries
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inquiries!A2:J',
    });

    const rows = response.data.values || [];
    
    // Find row index by phone number (column D, index 3)
    const rowIndex = rows.findIndex(row => row[3] === phone);
    
    if (rowIndex === -1) {
      throw new Error(`Inquiry with phone ${phone} not found`);
    }
    
    // Update status (column J, index 9)
    const actualRowNumber = rowIndex + 2; // +2 because: +1 for header, +1 for 1-indexed
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Inquiries!J${actualRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    throw error;
  }
}

// ========== HELPER FUNCTIONS ==========

export async function initializeSheets() {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // Create headers for all 5 sheets
    const headers = {
      'Technologies': [['Technology', 'Main Category', 'Sub Category', 'Display Order', 'Vacancies', 'Fresher Package', 'Experienced Package', 'Top Companies', 'Popularity Score', 'Description']],
      'Combinations': [['Technologies', 'Job Role', 'Category', 'Vacancies', 'Fresher Package', 'Experienced Package', 'Top Companies', 'Popularity Score']],
      'Companies': [['Company Name', 'Logo URL', 'Total Placements', 'Avg Package']],
      'Placements': [['Student Name', 'Company', 'Package', 'Phone', 'Photo URL', 'Profile', 'Course', 'Review', 'Joining Date']],
      'Inquiries': [['Timestamp', 'Name', 'Father Name', 'Phone', 'Email', 'DOB', 'Course Interest', 'College', 'Branch', 'Status']],
    };
    
    for (const [sheetName, headerRow] of Object.entries(headers)) {
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:J1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: headerRow,
          },
        });
        console.log(`Initialized ${sheetName} sheet with headers`);
      } catch (error) {
        console.error(`Error initializing ${sheetName}:`, error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error initializing sheets:", error);
    throw error;
  }
}
