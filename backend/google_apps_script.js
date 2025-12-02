/**
 * Google Apps Script for Hostel Management System
 * 
 * This script triggers when a Google Form is submitted and sends
 * the data to your Sheets Sync Service webhook.
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet connected to the Form
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Update WEBHOOK_URL with your backend URL
 * 5. Update WEBHOOK_SECRET with a secure secret
 * 6. Save and authorize the script
 * 7. Set up trigger: Edit > Current project's triggers
 *    - Function: onFormSubmit
 *    - Event source: From spreadsheet
 *    - Event type: On form submit
 */

// Configuration - UPDATE THESE VALUES
const WEBHOOK_URL = 'https://your-backend.example.com/api/sheets-webhook';
const WEBHOOK_SECRET = 'your-webhook-secret';

/**
 * Triggered when a form is submitted
 * @param {Object} e - The form submit event
 */
function onFormSubmit(e) {
  try {
    // Get form response values
    // Adjust indices based on your form fields
    const values = e.values;
    
    // Expected form fields (adjust order based on your form):
    // 0: Timestamp
    // 1: Student ID
    // 2: Student Name
    // 3: Email
    // 4: Phone
    // 5: Hostel Code (A-L)
    // 6: Floor Number
    // 7: Room Number
    // 8: Action (Check-in / Check-out)
    
    const payload = {
      timestamp: values[0],
      student_id: values[1],
      student_name: values[2],
      email: values[3] || null,
      phone: values[4] || null,
      hostel_code: values[5].toUpperCase(),
      floor_number: parseInt(values[6]),
      room_label: values[7],
      action: values[8].toLowerCase().includes('out') ? 'checkout' : 'checkin'
    };
    
    // Create signature for security
    const signature = createSignature(JSON.stringify(payload));
    
    // Send to webhook
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'X-Webhook-Signature': signature
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode >= 200 && responseCode < 300) {
      Logger.log('Webhook sent successfully: ' + response.getContentText());
    } else {
      Logger.log('Webhook failed with code ' + responseCode + ': ' + response.getContentText());
      // Optionally send an email notification on failure
      notifyAdmin('Webhook Failed', 'Response: ' + response.getContentText());
    }
    
  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
    notifyAdmin('Apps Script Error', error.toString());
  }
}

/**
 * Create HMAC-SHA256 signature for webhook payload
 * @param {string} payload - The JSON payload string
 * @returns {string} - Hex-encoded signature
 */
function createSignature(payload) {
  const signature = Utilities.computeHmacSha256Signature(payload, WEBHOOK_SECRET);
  return signature.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

/**
 * Send email notification to admin on errors
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
function notifyAdmin(subject, body) {
  // Get the email of the script owner
  const adminEmail = Session.getActiveUser().getEmail();
  if (adminEmail) {
    MailApp.sendEmail({
      to: adminEmail,
      subject: '[Hostel System] ' + subject,
      body: body
    });
  }
}

/**
 * Test function - run manually to test the webhook
 */
function testWebhook() {
  const testPayload = {
    timestamp: new Date().toISOString(),
    student_id: 'TEST001',
    student_name: 'Test Student',
    email: 'test@university.edu',
    phone: '1234567890',
    hostel_code: 'H',
    floor_number: 2,
    room_label: '201',
    action: 'checkin'
  };
  
  const signature = createSignature(JSON.stringify(testPayload));
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'X-Webhook-Signature': signature
    },
    payload: JSON.stringify(testPayload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
  Logger.log('Test response: ' + response.getResponseCode() + ' - ' + response.getContentText());
}
