import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/enhanced-world';
import { TestConfig } from '../utils/TestConfig';

// Updated Browser Launch Steps with Latest Devices
Given('I launch Chrome browser on Android device', async function (this: ICustomWorld) {
  console.log('🤖 Chrome browser launched on Android device (Pixel 8 Pro)');
  const userAgent = await this.page!.evaluate(() => navigator.userAgent);
  console.log(`📱 User Agent: ${userAgent}`);
  expect(userAgent).toContain('Mobile');
  console.log('✅ Chrome browser launched successfully on Android device');
});

Given('I launch Safari browser on iOS device', async function (this: ICustomWorld) {
  console.log('🍎 Safari browser launched on iOS device (iPhone 15 Pro Max)');
  const userAgent = await this.page!.evaluate(() => navigator.userAgent);
  console.log(`📱 User Agent: ${userAgent}`);  
  expect(userAgent).toContain('Mobile');
  console.log('✅ Safari browser launched successfully on iOS device');
});

// Navigation Steps
When('I navigate to Google homepage', { timeout: 60000 }, async function (this: ICustomWorld) {
  console.log('🌐 Navigating to Google homepage');
  try {
    // Use BasePage's navigateTo method which handles navigation and wait states
    await this.googleHomePage!.navigateTo(TestConfig.URLS.GOOGLE_HOMEPAGE);
    console.log('✅ Successfully navigated to Google homepage');
  } catch (error) {
    console.error('❌ Navigation failed:', error);
    // Log current URL and page state for debugging
    const currentUrl = await this.googleHomePage!.getCurrentUrl();
    const pageTitle = await this.googleHomePage!.getTitle();
    console.log(`🔍 Current URL: ${currentUrl}`);
    console.log(`🔍 Page Title: ${pageTitle}`);
    throw new Error(`Failed to navigate to Google homepage: ${error}`);
  }
});

// Verification Steps
Then('I should see Google homepage loaded successfully', async function (this: ICustomWorld) {
  try {
    console.log('🎯 Validating Google homepage is loaded');
    
    // Use BasePage method to wait for stable page state
    await this.page!.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.page!.waitForTimeout(2000); // Allow mobile page to fully render
    
    // Validate homepage using GoogleHomePage method
    const isLoaded = await this.googleHomePage!.isGoogleHomepageLoaded();
    expect(isLoaded).toBe(true);
    
    // Get additional page information using BasePage methods
    const pageInfo = await this.googleHomePage!.getPageInfo();
    console.log(`✅ Google homepage loaded successfully!`);
    console.log(`📄 Page Title: ${pageInfo.title}`);
    console.log(`🔗 Current URL: ${pageInfo.url}`);
    console.log(`🤖 User Agent: ${pageInfo.userAgent}`);
    console.log('🎉 Mobile Google homepage validation completed successfully!');
  } catch (error) {
    console.error('❌ Google homepage validation failed:', error);
    
    // Use BasePage methods for error diagnostics
    try {
      const currentUrl = await this.googleHomePage!.getCurrentUrl();
      const pageTitle = await this.googleHomePage!.getTitle();
      console.log(`🔍 Debug Info - Current URL: ${currentUrl}`);
      console.log(`🔍 Debug Info - Page Title: ${pageTitle}`);
      
      // Check if basic elements are visible using BasePage methods
      const hasSearchBox = await this.googleHomePage!.isElementVisible('input[name="q"]');
      const hasGoogleLogo = await this.googleHomePage!.isElementVisible('img[alt="Google"]');
      console.log(`🔍 Debug Info - Search box visible: ${hasSearchBox}`);
      console.log(`🔍 Debug Info - Google logo visible: ${hasGoogleLogo}`);
    } catch (debugError) {
      console.error('❌ Debug information collection failed:', debugError);
    }
    
    throw new Error(`Google homepage validation failed: ${error}`);
  }
});
