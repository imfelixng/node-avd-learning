const puppeteer = require('puppeteer');

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('The header has the context text', async () => { 
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});
