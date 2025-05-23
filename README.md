**#Setup:**
1.Clone the repo
git clone https://github.com/zvart-baghdasaryan/playwright.git
cd your-repo
2.Install dependencies:
npm install
3. Running tests
npx playwright test

**#Approach:**
this suite uses Playwright with Typescript to verify.
- Newsletter form validation
- The existance and accessability of sitemap.xml
- URLs from the sitemap are reachable
- Pages do not have unwanted noindex meta tags
- Links on page do not lead to 404

**#Notes**
- Tests assume publicly accessable URLs
- Limits the number of links checked per page for performance
- Sitemap XML should be well-formed
