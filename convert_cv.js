const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Starting PDF conversion...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const filePath = path.resolve(__dirname, 'eyoab_nigusie_cv (3).html');
  const fileUrl = `file://${filePath}`;
  
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: 'public/resume.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });

  await browser.close();
  console.log("PDF successfully generated at public/resume.pdf");
})();
