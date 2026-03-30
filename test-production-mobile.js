const puppeteer = require('puppeteer');

async function testProductionMobile() {
  console.log('🎯 Testing production mobile UI...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set mobile viewport (iPhone 14 Pro)
  await page.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    isMobile: true
  });
  
  try {
    console.log('📱 Testing production mobile UI...');
    await page.goto('https://mission-control-ryan.fly.dev/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for mobile detection and React hydration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await page.screenshot({
      path: './screenshots/03-production-mobile-improved.png',
      fullPage: true
    });
    
    console.log('✅ Production mobile screenshot: 03-production-mobile-improved.png');
    
    // Test collapsible sections by clicking
    try {
      console.log('🔄 Testing collapsible sections...');
      
      // Click to expand Goals section
      await page.click('button:has-text("2026 Goals Progress")');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.screenshot({
        path: './screenshots/04-goals-expanded-mobile.png',
        fullPage: true
      });
      
      console.log('✅ Goals expanded screenshot: 04-goals-expanded-mobile.png');
      
    } catch (e) {
      console.log('⚠️ Could not test collapsible sections:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  await browser.close();
}

testProductionMobile().catch(console.error);