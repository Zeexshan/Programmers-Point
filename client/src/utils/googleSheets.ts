import type { Technology, Combination, Company, Placement, InquiryFormData, AllData } from '../types';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SERVICE_ACCOUNT_EMAIL = import.meta.env.VITE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = import.meta.env.VITE_SERVICE_ACCOUNT_PRIVATE_KEY;

const CACHE_DURATION = 3600000;

export function getCachedData(key: string) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

export function setCachedData(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Cache error:', error);
  }
}

export function clearCache() {
  localStorage.removeItem('allData');
}

export async function readSheet(sheetName: string, range = 'A2:Z'): Promise<any[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Sheets API Error:', errorData);
      throw new Error(errorData.error?.message || `Failed to fetch ${sheetName}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error(`Error reading ${sheetName}:`, error);
    // Return empty array instead of throwing, so UI doesn't break
    return [];
  }
}

export async function fetchAllData(): Promise<AllData> {
  const cached = getCachedData('allData');
  if (cached) {
    return cached;
  }

  console.log('Fetching data from Google Sheets...');
  console.log('Sheet ID:', SHEET_ID ? 'Set' : 'Missing');
  console.log('API Key:', API_KEY ? 'Set' : 'Missing');

  try {
    const [technologies, combinations, companies, placements] = await Promise.all([
      readSheet('Technologies', 'A2:J'),
      readSheet('Combinations', 'A2:H'),
      readSheet('Companies', 'A2:D'),
      readSheet('Placements', 'A2:I')
    ]);

    console.log('Data fetched:', {
      technologies: technologies.length,
      combinations: combinations.length,
      companies: companies.length,
      placements: placements.length
    });

    const allData: AllData = {
      technologies: technologies.map(row => ({
        name: row[0] || '',
        mainCategory: row[1] || '',
        subCategory: row[2] || '',
        displayOrder: parseInt(row[3]) || 0,
        vacancies: parseInt(row[4]) || 0,
        fresherPackage: row[5] || '',
        experiencedPackage: row[6] || '',
        topCompanies: row[7] || '',
        popularityScore: parseInt(row[8]) || 0,
        description: row[9] || ''
      })),
      combinations: combinations.map(row => ({
        technologies: (row[0] || '').split(', ').filter(Boolean),
        jobRole: row[1] || '',
        category: row[2] || '',
        vacancies: parseInt(row[3]) || 0,
        fresherPackage: row[4] || '',
        experiencedPackage: row[5] || '',
        topCompanies: row[6] || '',
        popularityScore: parseInt(row[7]) || 0
      })),
      companies: companies.map(row => ({
        name: row[0] || '',
        logoUrl: row[1] || '',
        totalPlacements: parseInt(row[2]) || 0,
        avgPackage: row[3] || ''
      })),
      placements: placements.map(row => ({
        studentName: row[0] || '',
        company: row[1] || '',
        package: row[2] || '',
        phone: row[3] || '',
        photoUrl: row[4] || '',
        profile: row[5] || '',
        course: row[6] || '',
        review: row[7] || '',
        joiningDate: row[8] || ''
      }))
    };

    setCachedData('allData', allData);
    return allData;
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
}

async function createJWT(email: string, privateKey: string): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const base64UrlEncode = (obj: any) => {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;
  
  const keyData = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\\n/g, '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const signatureArray = new Uint8Array(signature);
  const base64Signature = btoa(String.fromCharCode.apply(null, Array.from(signatureArray)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${unsignedToken}.${base64Signature}`;
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const jwt = await createJWT(email, privateKey);
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to get access token');
  }
  
  const data = await response.json();
  return data.access_token;
}

export async function appendToInquiries(formData: InquiryFormData): Promise<void> {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Service account credentials not configured');
  }

  const token = await getAccessToken(SERVICE_ACCOUNT_EMAIL, PRIVATE_KEY);
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Inquiries!A:J:append?valueInputOption=RAW`;
  
  const row = [
    new Date().toISOString(),
    formData.name,
    formData.fatherName,
    formData.phone,
    formData.email,
    formData.dob,
    formData.courseInterest,
    formData.college,
    formData.branch,
    'Pending'
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] })
  });

  if (!response.ok) {
    throw new Error('Failed to submit inquiry');
  }
}

export async function updateSheet(
  sheetName: string,
  range: string,
  values: any[][]
): Promise<void> {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Service account credentials not configured');
  }

  const token = await getAccessToken(SERVICE_ACCOUNT_EMAIL, PRIVATE_KEY);
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}!${range}?valueInputOption=RAW`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values })
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${sheetName}`);
  }

  clearCache();
}

export async function readInquiries(): Promise<any[]> {
  try {
    const data = await readSheet('Inquiries', 'A2:J');
    return data.map(row => ({
      timestamp: row[0] || '',
      name: row[1] || '',
      fatherName: row[2] || '',
      phone: row[3] || '',
      email: row[4] || '',
      dob: row[5] || '',
      courseInterest: row[6] || '',
      college: row[7] || '',
      branch: row[8] || '',
      status: row[9] || 'Pending'
    }));
  } catch (error) {
    console.error('Failed to load inquiries:', error);
    return [];
  }
}
