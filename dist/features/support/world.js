"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomWorld = void 0;
const LoginPage_1 = require("../../src/pages/LoginPage");
class CustomWorld {
    constructor() {
        // Initialize any default properties if needed
    }
    async initializePageObjects() {
        if (this.page) {
            this.loginPage = new LoginPage_1.LoginPage(this.page);
        }
    }
}
exports.CustomWorld = CustomWorld;
//# sourceMappingURL=world.js.map