# Google Apps Script Setup Guide

This document explains how to set up Google Apps Script to handle inquiry form submissions.

## Why Google Apps Script?

Google Apps Script avoids the 4KB environment variable limit imposed by AWS Lambda (used by Netlify Functions). The service account credentials are stored directly in Apps Script, not in environment variables.

## Setup Instructions

### Step 1: Create the Apps Script

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Delete any existing code
4. Paste the following code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'submitInquiry') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inquiries');
      
      const row = [
        new Date().toISOString(),
        data.data.name,
        data.data.fatherName,
        data.data.phone,
        data.data.email,
        data.data.dob,
        data.data.courseInterest,
        data.data.college,
        data.data.branch,
        'Pending'
      ];
      
      sheet.appendRow(row);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Configure:
   - **Description**: "Inquiry Form Handler"
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the deployment URL** (it will look like: `https://script.google.com/macros/s/AKfycbxXXXX/exec`)

### Step 3: Add URL to Environment Variables

#### For Replit:
1. Go to **Secrets** (🔒 in the sidebar)
2. Add a new secret:
   - **Key**: `VITE_APPS_SCRIPT_URL`
   - **Value**: Your deployment URL from Step 2

#### For Netlify:
1. Go to your site settings
2. Navigate to **Environment Variables**
3. Add:
   - **Key**: `VITE_APPS_SCRIPT_URL`
   - **Value**: Your deployment URL from Step 2

### Step 4: Remove Old Environment Variables

You can now **remove** these environment variables (they're no longer needed):

- ❌ `VITE_SERVICE_ACCOUNT_EMAIL`
- ❌ `VITE_SERVICE_ACCOUNT_PRIVATE_KEY`
- ❌ `SERVICE_ACCOUNT_EMAIL` (Netlify only)
- ❌ `SERVICE_ACCOUNT_PRIVATE_KEY` (Netlify only)

Keep these:

- ✅ `VITE_GOOGLE_SHEET_ID` (for reading data)
- ✅ `VITE_GOOGLE_API_KEY` (for reading data)
- ✅ `VITE_APPS_SCRIPT_URL` (new - for writing inquiries)

## Testing

1. Restart your development server or redeploy to Netlify
2. Navigate to the Inquiry Form page
3. Fill out and submit a test inquiry
4. Check your Google Sheet's "Inquiries" tab for the new entry

## Benefits of This Approach

✅ **No 4KB limit** - Credentials stay in Google Apps Script  
✅ **More secure** - Credentials never leave Google's infrastructure  
✅ **100% free** - No additional costs  
✅ **Simpler** - No Netlify Functions needed  
✅ **Works everywhere** - Compatible with Netlify, Vercel, Replit, etc.

## Troubleshooting

### "Configuration Error" when submitting
- Make sure `VITE_APPS_SCRIPT_URL` is set in your environment
- Restart your development server after adding the secret

### Form submits but data doesn't appear
- Check that your Google Sheet has an "Inquiries" tab
- Verify the Apps Script deployment is set to "Anyone" access
- Check the Apps Script execution logs for errors

### CORS errors in browser console
- This is normal! We use `mode: 'no-cors'` to bypass CORS restrictions
- The form will still work even with these console messages
