import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Example selectors
  private readonly welcomeBanner = '.home-welcome-banner, .dashboard-header, h1';
  private readonly profileButton = '.profile-btn, .user-avatar';

  constructor(page: Page) {
    super(page);
  }

  // Example method: check if welcome banner is visible
  async isWelcomeBannerVisible(timeout = this.defaultTimeout): Promise<boolean> {
    return await this.isElementVisible(this.welcomeBanner);
  }

  // Example method: click profile button
  async clickProfileButton(timeout = this.defaultTimeout): Promise<boolean> {
    return await this.clickButton(this.profileButton, timeout);
  }

  // Example method: get welcome text
  async getWelcomeText(timeout = this.defaultTimeout): Promise<string | null> {
    return await this.getText(this.welcomeBanner, timeout);
  }
}
