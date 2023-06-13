import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const doBuild = true;

if (doBuild) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dirs = fs.readdirSync(path.resolve(__dirname, 'html'));
    console.log(path.resolve(__dirname, 'html'));

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--user-agent=Puppeteer']
    });
    const page = await browser.newPage();

    for (let index = 0; index < dirs.length; index++) {
        const element = dirs[index];
        console.log(`pre-rendering ${element}...`);
        if (element.endsWith('.html')) {
            const template = fs.readFileSync(path.resolve(__dirname, 'html', element), 'utf8');
            fs.writeFileSync(path.resolve(__dirname, '..', 'public', element), template);

            await page.goto(`file://${path.resolve(__dirname, '..', 'public', element)}`, {'timeout': 10000, 'waitUntil':'networkidle2'});
            await page.waitForFunction('window.status === "ready"');

            const content = await page.content();

            fs.writeFileSync(path.resolve(__dirname, '..', 'public', element), content);
        }
        console.log(`${element} has been pre-rendered`);
    }

    await page.close();
    await browser.close();
}