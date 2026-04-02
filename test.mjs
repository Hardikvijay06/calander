import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));

  await page.goto('http://localhost:5173/');

  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    // find day 15 and click it
    const spans = Array.from(document.querySelectorAll('span'));
    const day15 = spans.find(s => s.innerText === '15');
    if (day15) day15.parentElement.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  console.log("Wait for input...");

  const input = await page.$('input');
  if (!input) {
    console.log("Input not found! Body is:");
    console.log(await page.evaluate(() => document.body.innerHTML));
  } else {
    console.log("Input found, typing...");
    await input.click();
    await page.keyboard.type('My Test Event');
    
    await page.evaluate(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
    
    await new Promise(r => setTimeout(r, 1000));
    console.log("Checking errors");
    const errText = await page.evaluate(() => document.body.innerText);
    console.log('BODY TEXT AFTER ADD:', errText);
  }

  await browser.close();
})();
