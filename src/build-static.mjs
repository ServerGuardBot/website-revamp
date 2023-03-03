import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { load } from 'cheerio';
import { fileURLToPath } from 'url';
import { createElement } from 'react';
import puppeteer from 'puppeteer';

const doBuild = false;

if (doBuild) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dirs = fs.readdirSync(path.resolve(__dirname, '..', 'public'));

    for (let index = 0; index < dirs.length; index++) {
        const element = dirs[index];
        if (element.endsWith('.html')) {
            const name = element.split('.')[0];
            if (fs.existsSync(path.resolve(__dirname, '..', 'public', 'js', 'pages', name + '.js'))) {
                const htmlPath = path.join('js', 'pages', name + '.js');
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(`file://${path.resolve(__dirname, '..', 'public', element)}`);
                const html = await page.evaluate(async (htmlPath, renderToString, createElement) => {
                    return SSR();
                }, htmlPath, renderToString, createElement);

                let $ = load(fs.readFileSync(path.resolve(__dirname, '..', 'public', element)));
                $('body').replaceWith(
                    `<body>${html}</body>`
                );
                fs.writeFileSync(path.resolve(__dirname, '..', 'public', element), $.html());
            }
        }
    }
}