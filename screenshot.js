const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  
  // Wait for 3D load and animation
  console.log('waiting for animations...');
  await new Promise(r => setTimeout(r, 4000));
  
  // Scroll to About section (Board Setup - 02)
  console.log('Scrolling to About...');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/home/renaldodev/www/portfolio/test-about.png' });
  
  // Scroll to Skills section
  console.log('Scrolling to Skills...');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.8));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/home/renaldodev/www/portfolio/test-skills.png' });
  
  await browser.close();
  console.log('Done');
})();
