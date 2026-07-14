const { chromium } = require('playwright');
const fs = require('fs');
const PDFDocument = require('pdfkit');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 414, height: 896 }, // iPhone XR dimensions
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  });
  
  // Disable confetti to prevent screenshot hangs
  await context.addInitScript(() => {
    window.confetti = function() {};
  });

  const page = await context.newPage();
  
  try {
    console.log("Navigating to local dev server...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Screenshot Creator
    console.log("Capturing creator...");
    await page.waitForTimeout(1000);
    const s1Path = 'step1.png';
    await page.screenshot({ path: s1Path });

    // Fill form to enable generation
    await page.fill('input[placeholder="Например: Вася"]', 'Артём');
    await page.waitForTimeout(500);

    // Click generate button
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Создать приглашение'));
      if (btn) btn.click();
    });

    // 2. Screenshot Ready state
    console.log("Capturing ready...");
    await page.waitForTimeout(2000); // Wait for transition
    const s2Path = 'step2.png';
    await page.screenshot({ path: s2Path });

    // Open envelope (Guest View)
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Посмотреть превью') || el.textContent.includes('Открыть'));
      if (btn) btn.click();
    });

    // 3. Screenshot Envelope
    console.log("Capturing envelope...");
    await page.waitForTimeout(2000); // Wait for transition
    const s3Path = 'step3.png';
    await page.screenshot({ path: s3Path });

    // Click envelope
    await page.evaluate(() => {
      const envelope = document.querySelector('div[role="button"]') || document.querySelector('.cursor-pointer');
      if (envelope) envelope.click();
    });

    // 4. Screenshot Opened Invitation
    console.log("Capturing opened invitation...");
    await page.waitForTimeout(3000); // Wait for animation
    const s4Path = 'step4.png';
    await page.screenshot({ path: s4Path, fullPage: true });

    await browser.close();

    console.log("Generating PDF...");
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(fs.createWriteStream('/Users/dima/.gemini/antigravity-ide/brain/3a588712-cc31-4672-99ad-dd3359d6dc3d/Instruction_HelloPark.pdf'));
    
    // Embed custom font for Cyrillic support, fallback to standard if fails
    // PDFKit default Helvetica doesn't support Cyrillic well. Let's try to find a system font.
    // Mac OS has Arial or Helvetica which we can load if needed, but we'll try Times New Roman.
    const fontPath = '/System/Library/Fonts/Supplemental/Arial.ttf';
    if (fs.existsSync(fontPath)) {
        doc.font(fontPath);
    }
    
    doc.fontSize(20).text('Инструкция по приглашениям Hello Park', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Руководство для Банкетного Менеджера', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(16).text('Шаг 1. Настройка приглашения');
    doc.fontSize(12).text('На стартовом экране заполните данные: имя, дату, время, язык и выберите парк. Затем нажмите кнопку "Создать приглашение".');
    doc.moveDown();
    doc.image(s1Path, { width: 250, align: 'center' });
    doc.moveDown(2);
    doc.addPage();

    doc.fontSize(16).text('Шаг 2. Отправка ссылки гостям');
    doc.fontSize(12).text('Скопируйте сгенерированную ссылку и отправьте её гостям в любой мессенджер.');
    doc.moveDown();
    doc.image(s2Path, { width: 250, align: 'center' });
    doc.moveDown(2);
    doc.addPage();

    doc.fontSize(16).text('Шаг 3. Что видит гость (Получение конверта)');
    doc.fontSize(12).text('Перейдя по ссылке, гость увидит интерактивный конверт. Чтобы открыть, нужно просто нажать на него.');
    doc.moveDown();
    doc.image(s3Path, { width: 250, align: 'center' });
    doc.moveDown(2);
    doc.addPage();

    doc.fontSize(16).text('Шаг 4. Детали праздника и форма RSVP');
    doc.fontSize(12).text('Открыв конверт, гость видит все детали и форму ответа (RSVP), где можно подтвердить свое участие.');
    doc.moveDown();
    doc.image(s4Path, { width: 250, align: 'center' });
    
    doc.end();
    console.log("PDF generated successfully: /Users/dima/.gemini/antigravity-ide/brain/3a588712-cc31-4672-99ad-dd3359d6dc3d/Instruction_HelloPark.pdf");

  } catch (error) {
    console.error("Error generating PDF:", error);
    await browser.close();
    process.exit(1);
  }
})();
