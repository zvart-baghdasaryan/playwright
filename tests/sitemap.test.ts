import {test, expect, request, Page} from '@playwright/test';
import * as xml2js from 'xml2js';

const importantPaths = ['/', '/pricing', '/products'];
const MAX_URL_TO_TEST = 5;

async function getSitemapUrls(): Promise<string[]> {
    const res = await request.newContext().then(ctx => ctx.get('/sitemap.xml'));
    const xml = await res.text();
    const parsed = await xml2js.parseStringPromise(xml);
    return parsed.urlset.url.map((u: any) => u.loc[0]);
} 

async function hasNoIndexMeta(page: Page): Promise<boolean> {
    const meta = await page.locator('meta[name="robots"]').first().getAttribute('content');
    return !!meta?.includes('noindex');
}

function isPathBlocked(robotsTxt: string, path:string): boolean {
    const disallowed = robotsTxt.split('\n')
    .filter(line => line.toLowerCase().startsWith('disallow'))
    .map(line => line.split(':')[1].trim());
    return disallowed.some(rule => path.startsWith(rule));
}

test.describe('Sitemap and Crawlability Verification', () => { 
 
    test('Sitemap.xml exists and has URLs', async () => {
        const url = await getSitemapUrls();
        expect(url.length).toBeGreaterThan(0);
    });

    test('URLs in sitemap are accessable', async () => {
        const urls = await getSitemapUrls();
        const ctx = await request.newContext();
        for (const url of urls.slice(0, MAX_URL_TO_TEST)) {
            const res = await ctx.get(url);
            expect(res.status(), `Failed: ${url}`).toBeLessThan(400);
        }
    });

    test('Important pages do not have noindex meta', async ({page}) => {
        for (const path of importantPaths) {
            await page.goto(`${path}`);
            expect(await hasNoIndexMeta(page)).toBeFalsy();
        }
    });

    test('Important pages are not blocked by robot.txt', async () => {
        const res = await request.newContext().then(ctx => ctx.get('/robot.txt'));
        const robotsTxt = await res.text();
        for (const path of importantPaths) {
            expect(isPathBlocked(robotsTxt, path)).toBeFalsy();
        }
    })
});