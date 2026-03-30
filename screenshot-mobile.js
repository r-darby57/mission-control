const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  console.log('🎯 Starting Mission Control Mobile UI Screenshot...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  // Set mobile viewport (iPhone 14 Pro)
  await page.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  try {
    // Navigate to Mission Control
    console.log('📱 Loading Mission Control on mobile...');
    await page.goto('https://mission-control-ryan.fly.dev/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForSelector('.text-blue-400', { timeout: 10000 });
    
    // Create screenshots directory
    const screenshotDir = './screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }
    
    // Screenshot 1: Default tab (Mission Overview)
    console.log('📸 Screenshot 1: Mission Overview Tab');
    await page.screenshot({
      path: path.join(screenshotDir, '01-mission-overview-mobile.png'),
      fullPage: true
    });
    
    // Screenshot 2: Click Task Management tab
    console.log('📸 Screenshot 2: Task Management Tab');
    try {
      await page.click('button:has-text("📋")');
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(screenshotDir, '02-task-management-mobile.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('⚠️ Could not click Task Management tab');
    }
    
    // Screenshot 3: Click Agent Office tab
    console.log('📸 Screenshot 3: Agent Office Tab');
    try {
      await page.click('button:has-text("🏢")');
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(screenshotDir, '03-agent-office-mobile.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('⚠️ Could not click Agent Office tab');
    }
    
    // Screenshot 4: Click Memory Archive tab
    console.log('📸 Screenshot 4: Memory Archive Tab');
    try {
      await page.click('button:has-text("🧠")');
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(screenshotDir, '04-memory-archive-mobile.png'),
        fullPage: true
      });
    } catch (e) {
      console.log('⚠️ Could not click Memory Archive tab');
    }
    
    // Screenshot 5: Desktop view for comparison
    console.log('📸 Screenshot 5: Desktop View for Comparison');
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    });
    
    await page.goto('https://mission-control-ryan.fly.dev/', {
      waitUntil: 'networkidle2'
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotDir, '05-desktop-comparison.png'),
      fullPage: true
    });
    
    console.log('✅ All screenshots completed!');
    console.log('📁 Screenshots saved in: ./screenshots/');
    
  } catch (error) {
    console.error('❌ Screenshot error:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots().catch(console.error);