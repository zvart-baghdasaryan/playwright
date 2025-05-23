import { Page, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    
    async goto() {
        await this.page.goto('/');
    }

    async isNewsletterFormVisible() {
        //it should consist of an email field and a submit button, and they shoud be in the same form
        const form = this.page.locator('form:has(input[type="email"])');
        await expect(form).toBeVisible();
        const emailInput = form.locator('input[type="email"]');
        const submitButton = form.getByRole('button', {name: /subscribe/i});

        await expect(emailInput).toBeVisible();
        await expect(submitButton).toBeVisible();
    }

    async submitEmail(email: string) {
        await this.page.fill('input[type="email"]', email);
        await this.page.getByRole('button', {name: /subscribe/i}).click();
    }

    //BUG - there is no any error message, TODO - review the message after fixing the issue
    async expectedValidationError() {
        await expect(this.page.locator('text=/invalid email/i')).toBeVisible();
    }

    //BUG - there is no any message, TODO - review success message after fixing the issue
    async expectedSuccessMessage() {
        await expect(this.page.locator('text=/thank you/i')).toBeVisible();
    }
}