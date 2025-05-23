import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'https:/www.netlify.com',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
});