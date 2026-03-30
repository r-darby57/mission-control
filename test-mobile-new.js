const puppeteer = require('puppeteer');

async function testMobileImprovement() {
  console.log('🎯 Testing improved mobile UI...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    isMobile: true
  });
  
  try {
    // Test local version first (should have the improvements)
    console.log('📱 Testing local mobile UI...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait a moment for mobile detection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({
      path: './screenshots/02-mobile-improved-local.png',
      fullPage: true
    });
    
    console.log('✅ Local mobile screenshot taken: 02-mobile-improved-local.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  await browser.close();
}

testMobileImprovement().catch(console.error);