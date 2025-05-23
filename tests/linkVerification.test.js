import {test, expect, request} from '@playwright/test';
const pagesToTest = ['/', '/pricing', '/products'];
const MAX_LINKS_PER_PAGE = 20;

test('404 link verification', async ({page}) => {
    const apiContext = await request.newContext();

    for (const path of pagesToTest) {
        await page.goto(`${path}`);

        const links = await page.$$eval('a[href]', anchors => 
            anchors.map(a => a.getAttribute('href'))
            .filter(href => href && !href.startsWith('mailto:') && !href.startsWith('tel:'))
        );

        const linksToCheck = links.slice(0, MAX_LINKS_PER_PAGE);

        for (const href of linksToCheck) {
            let url = href;
            if(!url.startsWith('http')) {
                url = new URL(url, page.url()).toString();
            }
        
            const response = await apiContext.get(url);
            expect(response.status(), `Link ${url} on page ${path} should not return 404`).not.toBe(404);
        }
    }
})