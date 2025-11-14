import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
export declare class LoginPage extends BasePage {
    private readonly usernameInput;
    private readonly passwordInput;
    private readonly loginButton;
    private readonly finalLoginButton;
    private readonly successMessage;
    constructor(page: Page);
    enterUsername(username: string): Promise<void>;
    clickLoginAfterUsername(): Promise<void>;
    enterPassword(password: string): Promise<void>;
    clickLoginButton(): Promise<void>;
    clickContinueButton(): Promise<void>;
    waitAndClose(): Promise<void>;
    clickFinalLoginButton(): Promise<void>;
    isPasswordPageVisible(): Promise<boolean>;
    isLoggedIn(): Promise<boolean>;
}
//# sourceMappingURL=LoginPage.d.ts.map