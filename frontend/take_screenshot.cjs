const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const baseUrl = 'http://localhost:5173';
    const artifactsDir = 'C:/Users/adity/.gemini/antigravity/brain/c057e9bb-2053-4a95-8454-e3ebfc2774cc';

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    try {
        console.log('Navigating to login...');
        await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });
        
        console.log('Performing login...');
        await page.type('input[placeholder="RECIPIENT_ID"]', 'aditya');
        await page.type('input[type="password"]', '123');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Capturing Dashboard...');
        await page.screenshot({ path: path.join(artifactsDir, 'dashboard_verified.png'), fullPage: true });

        console.log('Capturing Create Bill...');
        await page.goto(`${baseUrl}/create`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 3000)); // Wait for 3D/animations
        await page.screenshot({ path: path.join(artifactsDir, 'create_bill_hud_final.png'), fullPage: true });

        console.log('Capturing History Bill...');
        await page.goto(`${baseUrl}/history`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 4000)); // Wait for 3D/animations/HUD
        await page.screenshot({ path: path.join(artifactsDir, 'history_hud_final.png'), fullPage: true });

        console.log('Capturing View Bill...');
        await page.goto(`${baseUrl}/view/69b03fda733c13cd58014ffd`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 4000)); // Wait for 3D/animations/HUD
        await page.screenshot({ path: path.join(artifactsDir, 'view_bill_hud_final.png'), fullPage: true });

        console.log('Authentication and capture complete.');
    } catch (err) {
        console.error('Capture failed:', err);
    } finally {
        await browser.close();
    }
})();
