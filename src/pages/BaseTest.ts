import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;
  protected defaultTimeout: number = 10000; // 10 seconds

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }


  // Wait for element to be visible
  async waitForVisible(selector: string, timeout = this.defaultTimeout): Promise<Locator | null> {
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'visible', timeout });
      return locator;
    } catch (error) {
      console.error(`waitForVisible failed for selector: ${selector}`, error);
      return null;
    }
  }

  // Wait for element to be attached to DOM
  async waitForPresent(selector: string, timeout = this.defaultTimeout): Promise<Locator | null> {
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'attached', timeout });
      return locator;
    } catch (error) {
      console.error(`waitForPresent failed for selector: ${selector}`, error);
      return null;
    }
  }

  // Click element with wait and error handling (Mobile-optimized)
  async clickButton(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      // Wait for element to be stable before clicking (mobile-specific)
      const isStable = await this.waitForElementStable(selector, timeout);
      if (!isStable) {
        console.warn(`Element not stable, attempting click anyway: ${selector}`);
      }

      // Try to get visible element first
      let locator = await this.waitForVisible(selector, timeout);
      if (!locator) {
        // If not visible, try to get present element
        locator = await this.waitForPresent(selector, timeout);
      }
      if (locator) {
        // Ensure element is in viewport for mobile
        await this.scrollIntoViewport(selector);
        // Small delay for mobile rendering
        await this.page.waitForTimeout(300);
        
        // Scroll into view before clicking
        await locator.scrollIntoViewIfNeeded({ timeout });
        await locator.click({ timeout });
        
        // Wait for any navigation or state changes after click
        await this.page.waitForTimeout(500);
        return true;
      }
    } catch (error) {
      console.error(`First click attempt failed for selector: ${selector}`, error);
      
      // Second attempt - try with different approach
      try {
        console.log(`Retrying click for selector: ${selector}`);
        const locator = this.page.locator(selector).first();
        await locator.scrollIntoViewIfNeeded({ timeout: timeout / 2 });
        // Use force click for stubborn mobile elements
        await locator.click({ force: true, timeout: timeout / 2 });
        // Wait for mobile UI to respond
        await this.page.waitForTimeout(800);
        console.log(`Second click attempt succeeded for selector: ${selector}`);
        return true;
      } catch (retryError) {
        console.error(`Second click attempt also failed for selector: ${selector}`, retryError);
        throw new Error(`Both click attempts failed for selector: ${selector}. First error: ${error instanceof Error ? error.message : String(error)}, Second error: ${retryError instanceof Error ? retryError.message : String(retryError)}`);
      }
    }
    return false;
  }

  // Type text into input (Mobile-optimized)
  async sendText(selector: string, text: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      // Wait for element to be stable before typing (mobile-specific)
      const isStable = await this.waitForElementStable(selector, timeout);
      if (!isStable) {
        console.warn(`Input field not stable, attempting type anyway: ${selector}`);
      }

      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        // Ensure input is in viewport for mobile
        await this.scrollIntoViewport(selector);
        
        // Focus the input field first (important for mobile)
        await locator.focus();
        await this.page.waitForTimeout(200);
        
        // Clear existing content with mobile-friendly approach
        await this.clearInput(selector, timeout);
        
        // Type with mobile-appropriate delay
        await locator.type(text, { delay: 100, timeout });
        
        // Verify text was entered (mobile validation)
        const enteredValue = await locator.inputValue();
        if (enteredValue !== text) {
          console.warn(`Text verification failed. Expected: ${text}, Got: ${enteredValue}`);
          // Try fill method as fallback
          await locator.fill(text);
        }
        
        // Small delay for mobile keyboard to hide
        await this.page.waitForTimeout(300);
        return true;
      }
    } catch (error) {
      console.error(`Type failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Get text content from element (Mobile-optimized)
  async getText(selector: string, timeout = this.defaultTimeout): Promise<string | null> {
    try {
      // Wait for element to be stable before reading text (mobile-specific)
      const isStable = await this.waitForElementStable(selector, timeout);
      if (!isStable) {
        console.warn(`Element not stable, attempting text read anyway: ${selector}`);
      }

      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        // Ensure element is in viewport for accurate text reading
        await this.scrollIntoViewport(selector);
        
        // Small delay for mobile rendering
        await this.page.waitForTimeout(200);
        
        // Try textContent first
        let text = await locator.textContent();
        
        // If textContent is empty, try innerText (better for mobile)
        if (!text || text.trim() === '') {
          text = await locator.innerText().catch(() => null);
        }
        
        // If still empty, try getting attribute value for input elements
        if (!text || text.trim() === '') {
          text = await locator.inputValue().catch(() => null);
        }
        
        return text?.trim() || null;
      }
    } catch (error) {
      console.error(`getText failed for selector: ${selector}`, error);
    }
    return null;
  }

  // Get attribute value from element
  async getAttribute(selector: string, attribute: string, timeout = this.defaultTimeout): Promise<string | null> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        return await locator.getAttribute(attribute);
      }
    } catch (error) {
      console.error(`getAttribute failed for selector: ${selector}`, error);
    }
    return null;
  }

  // Scroll element into view
  async scrollToElement(selector: string, timeout = this.defaultTimeout): Promise<void> {
    try {
      const locator = await this.waitForPresent(selector, timeout);
      if (locator) {
        await locator.scrollIntoViewIfNeeded({ timeout });
      }
    } catch (error) {
      console.error(`scrollToElement failed for selector: ${selector}`, error);
    }
  }

  // Wait for page to load (URL change)
  async waitForUrlChange(oldUrl: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        'window.location.href !== url',
        oldUrl,
        { timeout }
      );
      return true;
    } catch (error) {
      console.error(`waitForUrlChange failed from ${oldUrl}`, error);
      return false;
    }
  }

  // Get page title
  async getPageTitle(timeout = this.defaultTimeout): Promise<string | null> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout });
      return await this.page.title();
    } catch (error) {
      console.error('getPageTitle failed', error);
      return null;
    }
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fill(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  // Hover over element (like moveToElement in Selenium Actions)
  async hoverElement(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        await locator.hover({ timeout });
        return true;
      }
    } catch (error) {
      console.error(`Hover failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Double click
  async doubleClick(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        await locator.dblclick({ timeout });
        return true;
      }
    } catch (error) {
      console.error(`Double click failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Right click (context menu)
  async rightClick(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        await locator.click({ button: 'right', timeout });
        return true;
      }
    } catch (error) {
      console.error(`Right click failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Send keyboard keys (like sendKeys in Selenium Actions)
  async sendKeys(keys: string): Promise<void> {
    try {
      await this.page.keyboard.type(keys);
    } catch (error) {
      console.error(`Send keys failed for keys: ${keys}`, error);
      throw error;
    }
  }

  // Press specific keys (like keyDown/keyUp in Selenium Actions)
  async pressKey(key: string): Promise<void> {
    try {
      await this.page.keyboard.press(key);
    } catch (error) {
      console.error(`Press key failed for key: ${key}`, error);
      throw error;
    }
  }

  // Drag and drop
  async dragAndDrop(sourceSelector: string, targetSelector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const sourceLocator = await this.waitForVisible(sourceSelector, timeout);
      const targetLocator = await this.waitForVisible(targetSelector, timeout);
      if (sourceLocator && targetLocator) {
        await sourceLocator.dragTo(targetLocator, { timeout });
        return true;
      }
    } catch (error) {
      console.error(`Drag and drop failed from ${sourceSelector} to ${targetSelector}`, error);
    }
    return false;
  }

  // Hold key down
  async keyDown(key: string): Promise<void> {
    try {
      await this.page.keyboard.down(key);
    } catch (error) {
      console.error(`Key down failed for key: ${key}`, error);
      throw error;
    }
  }

  // Release key
  async keyUp(key: string): Promise<void> {
    try {
      await this.page.keyboard.up(key);
    } catch (error) {
      console.error(`Key up failed for key: ${key}`, error);
      throw error;
    }
  }

  // Mobile-specific: Tap at coordinates
  async tapAtCoordinates(x: number, y: number): Promise<void> {
    try {
      await this.page.mouse.click(x, y);
    } catch (error) {
      console.error(`Tap at coordinates failed for (${x}, ${y})`, error);
      throw error;
    }
  }

  // Mobile-specific: Swipe gesture
  async swipe(startX: number, startY: number, endX: number, endY: number): Promise<void> {
    try {
      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();
      await this.page.mouse.move(endX, endY);
      await this.page.mouse.up();
    } catch (error) {
      console.error(`Swipe failed from (${startX}, ${startY}) to (${endX}, ${endY})`, error);
      throw error;
    }
  }

  // Touch & Gesture Methods
  // Long press/touch and hold
  async longPress(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        const box = await locator.boundingBox();
        if (box) {
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.down();
          await this.page.waitForTimeout(1000); // Hold for 1 second
          await this.page.mouse.up();
        }
        return true;
      }
    } catch (error) {
      console.error(`Long press failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Pinch to zoom (multi-touch simulation)
  async pinchZoom(selector: string, scale: number): Promise<boolean> {
    try {
      const element = await this.page.locator(selector);
      const box = await element.boundingBox();
      if (box) {
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        
        // Simulate pinch gesture with mouse events
        await this.page.mouse.move(centerX - 50, centerY);
        await this.page.mouse.down();
        await this.page.mouse.move(centerX - 50 * scale, centerY);
        await this.page.mouse.up();
        
        await this.page.mouse.move(centerX + 50, centerY);
        await this.page.mouse.down();
        await this.page.mouse.move(centerX + 50 * scale, centerY);
        await this.page.mouse.up();
        return true;
      }
    } catch (error) {
      console.error(`Pinch zoom failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Scroll with touch
  async touchScroll(selector: string, direction: 'up' | 'down' | 'left' | 'right', distance: number = 300): Promise<boolean> {
    try {
      const element = await this.page.locator(selector);
      const box = await element.boundingBox();
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        
        let endX = startX, endY = startY;
        switch (direction) {
          case 'up': endY -= distance; break;
          case 'down': endY += distance; break;
          case 'left': endX -= distance; break;
          case 'right': endX += distance; break;
        }
        
        await this.swipe(startX, startY, endX, endY);
        return true;
      }
    } catch (error) {
      console.error(`Touch scroll failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Device Orientation & Viewport Methods
  // Rotate device
  async rotateDevice(orientation: 'portrait' | 'landscape'): Promise<void> {
    try {
      const viewport = orientation === 'portrait' 
        ? { width: 375, height: 667 } 
        : { width: 667, height: 375 };
      await this.page.setViewportSize(viewport);
    } catch (error) {
      console.error(`Rotate device failed for orientation: ${orientation}`, error);
      throw error;
    }
  }

  // Check if element is in viewport (alternative implementation)
  async isElementInViewport(selector: string): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, this.defaultTimeout);
      if (locator) {
        const box = await locator.boundingBox();
        if (box) {
          const viewport = this.page.viewportSize();
          return viewport ? 
            box.x >= 0 && box.y >= 0 && 
            box.x + box.width <= viewport.width && 
            box.y + box.height <= viewport.height : false;
        }
      }
    } catch (error) {
      console.error(`Check viewport failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Scroll element into viewport
  async scrollIntoViewport(selector: string): Promise<boolean> {
    try {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
      return true;
    } catch (error) {
      console.error(`Scroll into viewport failed for selector: ${selector}`, error);
      return false;
    }
  }

  // Mobile Input Methods
  // Clear input field (mobile-friendly)
  async clearInput(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        await locator.clear();
        // Alternative: Select all and delete
        await locator.selectText();
        await this.page.keyboard.press('Delete');
        return true;
      }
    } catch (error) {
      console.error(`Clear input failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Type with mobile keyboard delay
  async typeWithDelay(selector: string, text: string, delay: number = 100): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, this.defaultTimeout);
      if (locator) {
        await locator.type(text, { delay });
        return true;
      }
    } catch (error) {
      console.error(`Type with delay failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Mobile-Specific Waits
  // Wait for network to be idle (useful after mobile interactions)
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      console.error(`Wait for network idle failed`, error);
      throw error;
    }
  }

  // Wait for element to be stable (no animation)
  async waitForElementStable(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        await locator.waitFor({ state: 'visible', timeout });
        // Wait a bit more for any animations to complete
        await this.page.waitForTimeout(500);
        return true;
      }
    } catch (error) {
      console.error(`Wait for stable failed for selector: ${selector}`, error);
    }
    return false;
  }

  // Mobile Navigation Methods
  // Mobile back button
  async goBack(): Promise<void> {
    try {
      await this.page.goBack();
    } catch (error) {
      console.error(`Go back failed`, error);
      throw error;
    }
  }

  // Mobile refresh
  async refresh(): Promise<void> {
    try {
      await this.page.reload();
    } catch (error) {
      console.error(`Refresh failed`, error);
      throw error;
    }
  }

  // Handle mobile popups/alerts
  async handleAlert(action: 'accept' | 'dismiss' = 'accept'): Promise<void> {
    try {
      this.page.on('dialog', async dialog => {
        if (action === 'accept') {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
      });
    } catch (error) {
      console.error(`Handle alert failed`, error);
      throw error;
    }
  }

  // Mobile Debugging & Utilities
  // Get device info
  async getDeviceInfo(): Promise<any> {
    try {
      return await this.page.evaluate(() => {
        return {
          userAgent: (globalThis as any).navigator.userAgent,
          screenWidth: (globalThis as any).screen.width,
          screenHeight: (globalThis as any).screen.height,
          viewportWidth: (globalThis as any).window.innerWidth,
          viewportHeight: (globalThis as any).window.innerHeight,
          devicePixelRatio: (globalThis as any).window.devicePixelRatio
        };
      });
    } catch (error) {
      console.error(`Get device info failed`, error);
      throw error;
    }
  }

  // Check if running on mobile
  async isMobile(): Promise<boolean> {
    try {
      const userAgent = await this.page.evaluate(() => navigator.userAgent);
      return /Mobile|Android|iPhone|iPad/.test(userAgent);
    } catch (error) {
      console.error(`Check mobile failed`, error);
      return false;
    }
  }

  // Take mobile-specific screenshot
  async takeMobileScreenshot(name: string, fullPage: boolean = true): Promise<void> {
    try {
      await this.page.screenshot({
        path: `reports/screenshots/mobile-${name}-${Date.now()}.png`,
        fullPage,
        type: 'png'
      });
    } catch (error) {
      console.error(`Take mobile screenshot failed for name: ${name}`, error);
      throw error;
    }
  }

  // Additional Mobile Utilities
  // Wait for element to disappear
  async waitForElementToDisappear(selector: string, timeout = this.defaultTimeout): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'detached', timeout });
      return true;
    } catch (error) {
      console.error(`Wait for disappear failed for selector: ${selector}`, error);
      return false;
    }
  }

  // Get element count
  async getElementCount(selector: string): Promise<number> {
    try {
      return await this.page.locator(selector).count();
    } catch (error) {
      console.error(`Get element count failed for selector: ${selector}`, error);
      return 0;
    }
  }

  // Check if element exists
  async isElementPresent(selector: string): Promise<boolean> {
    try {
      const count = await this.page.locator(selector).count();
      return count > 0;
    } catch (error) {
      console.error(`Check element present failed for selector: ${selector}`, error);
      return false;
    }
  }

  // Get element inner text
  async getInnerText(selector: string, timeout = this.defaultTimeout): Promise<string | null> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        return await locator.innerText();
      }
    } catch (error) {
      console.error(`Get inner text failed for selector: ${selector}`, error);
    }
    return null;
  }

  // Get element value (for input fields)
  async getInputValue(selector: string, timeout = this.defaultTimeout): Promise<string | null> {
    try {
      const locator = await this.waitForVisible(selector, timeout);
      if (locator) {
        return await locator.inputValue();
      }
    } catch (error) {
      console.error(`Get input value failed for selector: ${selector}`, error);
    }
    return null;
  }

  // Check if element is enabled
  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isEnabled();
    } catch (error) {
      console.error(`Check enabled failed for selector: ${selector}`, error);
      return false;
    }
  }

  // Check if element is visible
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch (error) {
      console.error(`Check visible failed for selector: ${selector}`, error);
      return false;
    }
  }
}
