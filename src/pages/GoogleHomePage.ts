import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GoogleHomePage extends BasePage {
  // Google homepage specific selectors
  private readonly searchBox = 'input[name="q"], textarea[name="q"], input[title="Search"]';
  private readonly googleLogo = 'img[alt="Google"], [role="img"][aria-label*="Google"]';
  private readonly searchButton = 'input[name="btnK"], button[aria-label="Google Search"]';
  private readonly feelingLuckyButton = 'input[name="btnI"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify that Google homepage is loaded successfully
   */
  async isGoogleHomepageLoaded(): Promise<boolean> {
    try {
      console.log('🔍 Checking if Google homepage is loaded...');
      
      // Check for Google logo using BasePage method
      const hasGoogleLogo = await this.isElementVisible(this.googleLogo);
      console.log(`📊 Google logo visible: ${hasGoogleLogo}`);
      
      // Check for search box using BasePage method
      const hasSearchBox = await this.isElementVisible(this.searchBox);
      console.log(`📊 Search box visible: ${hasSearchBox}`);
      
      // Check URL contains google.com
      const currentUrl = await this.getCurrentUrl();
      const isGoogleUrl = currentUrl.includes('google.com');
      console.log(`📊 URL contains google.com: ${isGoogleUrl} (${currentUrl})`);
      
      // Check page title
      const pageTitle = await this.getTitle();
      const hasGoogleTitle = pageTitle.toLowerCase().includes('google');
      console.log(`📊 Page title contains 'Google': ${hasGoogleTitle} (${pageTitle})`);
      
      // At least 2 of these conditions should be true for successful validation
      const validationScore = [hasGoogleLogo, hasSearchBox, isGoogleUrl, hasGoogleTitle].filter(Boolean).length;
      const isValid = validationScore >= 2;
      
      console.log(`✅ Google homepage validation score: ${validationScore}/4, Valid: ${isValid}`);
      return isValid;
      
    } catch (error) {
      console.error('❌ Error checking Google homepage:', error);
      return false;
    }
  }

  /**
   * Perform a search on Google (optional method for future use)
   */
  async performSearch(searchTerm: string): Promise<void> {
    try {
      console.log(`🔍 Performing search for: ${searchTerm}`);
      
      // Wait for search box to be visible using BasePage method
      await this.waitForVisible(this.searchBox, 10000);
      
      // Clear and enter search term using BasePage method
      await this.sendText(this.searchBox, searchTerm);
      
      // Press Enter or click search button
      await this.page.keyboard.press('Enter');
      
      // Wait for search results
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
      
      console.log('✅ Search completed successfully');
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  /**
   * Get current page information for debugging
   */
  async getPageInfo(): Promise<{ url: string; title: string; userAgent: string }> {
    try {
      const url = await this.getCurrentUrl();
      const title = await this.getTitle();
      const userAgent = await this.page.evaluate(() => navigator.userAgent);
      
      return { url, title, userAgent };
    } catch (error) {
      console.error('❌ Error getting page info:', error);
      return { url: 'unknown', title: 'unknown', userAgent: 'unknown' };
    }
  }
}
