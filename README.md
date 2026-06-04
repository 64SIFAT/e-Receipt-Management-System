# e-Receipt-Management-System

A simple Google Apps Script for automating receipt generation and delivery from Google Sheets data.

## Overview

This project automates e-receipt creation for membership invoicing. When a new row is submitted in the `Invoices` Google Sheet, the script:

- reads invoice details from the `Invoices` sheet
- looks up the customer email from the `Members` sheet
- copies a Google Docs template and fills placeholders
- converts the filled document to PDF
- saves the PDF in a specified Google Drive folder
- sends the PDF by email to the member and CCs a configured email address
- writes the invoice number, email, date, and PDF URL back to the `Invoices` sheet

## What it does

The script in `main.js` performs the following tasks:

1. Validates that `Invoices` and `Members` sheets exist.
2. Reads the latest submission from the `Invoices` sheet.
3. Finds member email using the name in the `Members` sheet.
4. Generates a sequential invoice number.
5. Creates a copy of a Google Docs template and replaces placeholder fields:
   - `{{INVOICENO}}`
   - `{{DATE}}`
   - `{{NAME}}`
   - `{{EMAIL}}`
   - `{{MONTHS}}`
   - `{{AMOUNT}}`
6. Converts the document copy to PDF.
7. Sends the receipt PDF by email.
8. Updates the `Invoices` sheet with the email, invoice number, date, and PDF link.

## Required files and sheets

- `main.js` — the Apps Script automation code.
- Google Docs template file with placeholder tags.
- Google Sheets workbook containing:
  - `Invoices` sheet
  - `Members` sheet

### `Invoices` sheet expected columns

The script reads columns A–D from the newest row and writes back to columns E–H.

- Column A: (any row identifier or form timestamp)
- Column B: Name
- Column C: Months
- Column D: Amount
- Column E: Email (written by script)
- Column F: Invoice number (written by script)
- Column G: Date (written by script)
- Column H: Receipt PDF URL (written by script)

### `Members` sheet expected columns

- Column A: Name
- Column B: Email

## Setup

1. Open the script in Google Apps Script attached to your Google Sheet.
2. Set the configuration constants at the top of `main.js`:

```js
const TEMPLATE_DOC_ID = 'YOUR_GOOGLE_DOC_TEMPLATE_ID';
const DEST_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';
const INVOICE_PREFIX = 'BASCA-5.0';
const CC_EMAIL = 'email@gmai.com';
```

3. Make sure the template file contains the placeholder tags listed above.
4. Grant the script permission to access Google Drive, Google Docs, Gmail, and Google Sheets.
5. Install a trigger for `onFormSubmit(e)`:
   - In the Apps Script editor, go to "Triggers"
   - Add a trigger for `onFormSubmit` on event type `On form submit`

## Customization

- Change `INVOICE_PREFIX` to fit your organization’s invoice numbering style.
- Change `CC_EMAIL` to copy another recipient on every receipt email.
- Modify the email subject and body in `main.js` to match your tone and branding.

## Error handling

If the script encounters an error, it will:

- log the error to the Apps Script logger
- send an email notification to the hard-coded error recipient in `main.js`

Update the error notification email address in the catch block if needed.

## Notes

- Invoice numbers are generated from the count of existing values in column F of `Invoices`, so the sheet should store previous invoice numbers sequentially.
- The generated receipt PDF is saved in the configured Drive destination folder.
- The script uses the current script timezone when formatting dates.

## Example usage

1. A new invoice is submitted through the form or entered into the `Invoices` sheet.
2. The script runs automatically and creates a receipt PDF.
3. The receipt is emailed to the member and CC address.
4. The invoice row is updated with email, invoice number, date, and receipt link.

## License

This repository does not include a license file by default. Add a `LICENSE` file if you want to specify reuse terms.
