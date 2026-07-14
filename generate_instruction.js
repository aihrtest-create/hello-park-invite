const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to mobile to simulate a phone
  await page.setViewport({ width: 390, height: 844 });
  
  console.log("Navigating to local dev server...");
  await page.goto('http://localhost:3000');
  
  // Wait for the form to render
  await page.waitForSelector('input[type="text"]');
  
  const artifactsDir = '/Users/dima/.gemini/antigravity-ide/brain/3a588712-cc31-4672-99ad-dd3359d6dc3d';
  
  // 1. Screenshot Creator
  const s1 = await page.screenshot({ encoding: 'base64' });
  console.log("Captured creator...");
  
  // Fill form
  await page.type('input[type="text"]', 'Артём');
  
  // Click generate button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Создать приглашение'));
    if (btn) btn.click();
  });
  
  // Wait for ready title
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('h2, div, p')).some(el => el.textContent.includes('Приглашение готово!'));
  }, {timeout: 5000});
  
  // 2. Screenshot Ready state
  const s2 = await page.screenshot({ encoding: 'base64' });
  console.log("Captured ready...");
  
  // Click 'Посмотреть превью' to go to guest view
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Посмотреть превью') || el.textContent.includes('Открыть'));
    if (btn) btn.click();
  });
  
  // Wait for envelope
  await page.waitForFunction(() => {
    return document.querySelector('.cursor-pointer') || Array.from(document.querySelectorAll('div')).some(el => el.textContent.includes('TAP'));
  }, {timeout: 5000});
  await page.waitForTimeout(1000);
  
  // 3. Screenshot Envelope
  const s3 = await page.screenshot({ encoding: 'base64' });
  console.log("Captured envelope...");
  
  // Open envelope
  await page.evaluate(() => {
    const envelope = document.querySelector('div[role="button"]') || document.querySelector('.cursor-pointer');
    if (envelope) envelope.click();
  });
  
  // Wait for card animation
  await page.waitForTimeout(3000);
  
  // 4. Screenshot Opened Invitation
  const s4 = await page.screenshot({ encoding: 'base64' });
  console.log("Captured opened...");
  
  // Generate HTML
  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Инструкция: Как работает интерактивное приглашение</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 40px;
          background: #fff;
        }
        h1 {
          color: #FF6022;
          text-align: center;
          margin-bottom: 30px;
        }
        .step {
          margin-bottom: 50px;
          page-break-inside: avoid;
        }
        .step h2 {
          color: #444;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        .step p {
          font-size: 16px;
        }
        .img-container {
          text-align: center;
          margin-top: 20px;
        }
        img {
          max-width: 390px;
          border: 1px solid #ddd;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <h1>Инструкция по приглашениям Hello Park</h1>
      <p style="text-align:center; font-size:18px;">Руководство для Банкетного Менеджера</p>

      <div class="step">
        <h2>Шаг 1. Настройка приглашения</h2>
        <p>На этой странице вы заполняете данные для праздника. Выберите <b>Язык приглашения</b>, введите <b>Имя именинника</b>, выберите <b>Парк</b> из списка, укажите <b>Дату</b> и <b>Время сбора гостей</b>, а также выберите <b>Эмодзи</b>. Затем нажмите кнопку <b>"Создать приглашение"</b>.</p>
        <div class="img-container">
          <img src="data:image/png;base64,${s1}" alt="Настройка">
        </div>
      </div>

      <div class="step">
        <h2>Шаг 2. Отправка ссылки</h2>
        <p>После создания приглашения вы увидите экран с готовой ссылкой. Вы можете нажать на иконку копирования рядом со ссылкой и отправить её гостям в любой мессенджер (WhatsApp, Telegram и т.д.). Вы также можете посмотреть превью, нажав <b>"Посмотреть превью"</b>.</p>
        <div class="img-container">
          <img src="data:image/png;base64,${s2}" alt="Готовая ссылка">
        </div>
      </div>

      <div class="step">
        <h2>Шаг 3. Что видит гость (Конверт)</h2>
        <p>Когда гость переходит по вашей ссылке, он видит интерактивный конверт с надписью <b>"Вам прислали приглашение!"</b>. Для того чтобы открыть его, гостю нужно просто тапнуть (нажать) по конверту.</p>
        <div class="img-container">
          <img src="data:image/png;base64,${s3}" alt="Конверт">
        </div>
      </div>

      <div class="step">
        <h2>Шаг 4. Детали приглашения и RSVP</h2>
        <p>Конверт эффектно открывается (с конфетти!), и гость видит все детали праздника: имя, дату, время, адрес и карту. Ниже расположена форма подтверждения участия (RSVP). Гость выбирает <b>"Мы придем"</b> или <b>"Не сможем"</b>, а вы увидите эти ответы.</p>
        <div class="img-container">
          <img src="data:image/png;base64,${s4}" alt="Детали">
        </div>
      </div>
      
    </body>
    </html>
  `;
  
  console.log("Generating PDF...");
  const pdfPage = await browser.newPage();
  await pdfPage.setContent(html, { waitUntil: 'networkidle0' });
  await pdfPage.pdf({
    path: artifactsDir + '/Instruction.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  
  console.log("PDF created successfully at", artifactsDir + '/Instruction.pdf');
  await browser.close();
})();
