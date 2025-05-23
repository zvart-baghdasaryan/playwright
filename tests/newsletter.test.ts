import { test } from '@playwright/test';
import { HomePage } from 'pages/homePage';

test.describe('Lead Capture Form Validation', () => {
    let home: HomePage;
    
    test.beforeEach(async({page}) => {
        //Verify the newsletter form present and properly functioning
        home = new HomePage(page);
        await home.goto();
        await home.isNewsletterFormVisible();
    })

    test('Test form submition with valid data', async({page}) => {
        await home.submitEmail('test@test.test');
        //Verify proper feedback is displayed to user after submission
        await home.expectedSuccessMessage();
    });

    test('Test form validation with invalid data', async ({page}) => {
        await home.submitEmail('some-text.tst');
        //Verify proper feedback is displayed to user after submission
        await home.expectedValidationError();
    })
})