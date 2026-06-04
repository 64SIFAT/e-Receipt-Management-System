const TEMPLATE_DOC_ID = '1DUSaodfAFS4Cz5IKfGOTBZi_SMNBMnJA359rsRr0xGw'; //Google Docs template ID
const DEST_FOLDER_ID = '13Qeh1L4QC6fVrfX24lYOwrNfh0TiIiQ1';        // Google Drive folder ID
const INVOICE_PREFIX = 'BASCA-5.0';            // prefix for invoice number
const CC_EMAIL = 'email@gmai.com';           // CC address who you want to notify
// ==========================

function onFormSubmit(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const invoiceSheet = ss.getSheetByName('Invoices');
    const memberSheet = ss.getSheetByName('Members');

    if (!invoiceSheet) throw new Error('Sheet "Invoices" not found');
    if (!memberSheet) throw new Error('Sheet "Members" not found');

    // Get the last submitted row
    const row = invoiceSheet.getLastRow();
    const data = invoiceSheet.getRange(row, 1, 1, 4).getValues()[0]; // A-D columns

    const name = data[1];   // Column B
    const months = data[2]; // Column C
    const amount = data[3]; // Column D

    // Find email from Members sheet
    const members = memberSheet.getDataRange().getValues();
    let email = '';
    for (let i = 1; i < members.length; i++) {
      if (members[i][0].toString().trim().toLowerCase() === name.toString().trim().toLowerCase()) {
        email = members[i][1];
        break;
      }
    }
    if (!email) throw new Error('No email found for: ' + name);

    
const invoices = SpreadsheetApp.getActive().getSheetByName('Invoices');
const all = invoices.getRange(2, 6, invoices.getLastRow() - 1, 1).getValues().map(r => r[0]);
let counter = all.filter(v => v).length + 1; // Next sequential number

// Build invoiceNo as: BASCA-2026-00001
const invoiceNo = `${INVOICE_PREFIX}-2026-${('00000' + counter).slice(-5)}`;



    
    const template = DriveApp.getFileById(TEMPLATE_DOC_ID);
    const folder = DriveApp.getFolderById(DEST_FOLDER_ID);
    const copyName = `Receipt_${name}_${invoiceNo}`;
    const copy = template.makeCopy(copyName, folder);
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();

  
   const today = new Date();
const datePart = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyyMMdd');
    body.replaceText('{{INVOICENO}}', invoiceNo);
body.replaceText('{{DATE}}', Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd'));
body.replaceText('{{NAME}}', name || '');
body.replaceText('{{EMAIL}}', email || '');
body.replaceText('{{MONTHS}}', months || '');
body.replaceText('{{AMOUNT}}', amount || '');
doc.saveAndClose();



    // Convert to PDF & rename
    const pdfFile = DriveApp.getFileById(copy.getId()).getAs('application/pdf').setName(`${name}-${invoiceNo}.pdf`);
    const pdfDoc = folder.createFile(pdfFile);
    const pdfUrl = pdfDoc.getUrl();

    // Send email with PDF
    const subject = `${name}-Official Receipt - BASCA (${invoiceNo})`;
    const message =
`Dear ${name},

Greetings from the BASCA Treasurer's Office,

We are pleased to acknowledge the receipt of your kind contribution.
Please find the attached official receipt [Auto-generated] for your record.

Your generous support helps us continue our efforts towards transparency and community development.
We truly value your commitment and trust in us.

Warm regards,
SIFAT ULLAH
Treasurer
Bangladeshi Students' Community AIU (BASCA)
`;

    MailApp.sendEmail({
      to: email,
      cc: CC_EMAIL, 
      subject: subject,
      body: message,
      attachments: [pdfDoc.getBlob()]
    });

    // Update the sheet
    invoiceSheet.getRange(row, 5).setValue(email);
    invoiceSheet.getRange(row, 6).setValue(invoiceNo);
    invoiceSheet.getRange(row, 7).setValue(Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd'));
    invoiceSheet.getRange(row, 8).setValue(pdfUrl);

  } catch (err) {
    Logger.log('Error: ' + err);
    MailApp.sendEmail({
      to: 'YOUR_EMAIL@gmail.com', // gets notified if error happens
      subject: 'BASCA Receipt Script Error',
      body: 'Error: ' + err
    });
  }
}
