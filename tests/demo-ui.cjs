const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/bayta/.cache/ms-playwright-go/1.57.0/package');
const server = require('./static-server.cjs')();
const root = path.resolve(__dirname, '..');
const output = path.join(os.tmpdir(), '3jsdemo-ui');
fs.mkdirSync(output, { recursive: true });
const demos = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/class="launch" href="\.\/([^"]+)"/g)].map(match => match[1]);
const sizes = [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 320, height: 640 }];

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/snap/chromium/current/usr/lib/chromium-browser/chrome',
    headless: true,
    env: { ...process.env, LD_LIBRARY_PATH: '/snap/chromium/current/usr/lib/x86_64-linux-gnu:/snap/gnome-46-2404/current/usr/lib/x86_64-linux-gnu' },
    args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage'],
  });
  const failures = [];
  const results = [];
  try {
    assert.equal(demos.length, 16);
    for (const demo of demos.filter(name => !process.env.DEMO_FILTER || name.includes(process.env.DEMO_FILTER))) {
      const name = demo.split('/')[0];
      const page = await browser.newPage({ viewport: sizes[0], reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/${demo}?test=1`);
        await page.waitForFunction(() => {
          const canvas = document.querySelector('#stage canvas, #scene canvas');
          return canvas && canvas.width > 1 && canvas.height > 1;
        }, null, { timeout: 90000 });
        // The 23-row board intentionally locks pause/speed in reduced-motion mode.
        // Reset becomes available only once its first render completes.
        await page.waitForFunction(() => !document.querySelector('#reset:disabled'), null, { timeout: 20000 });
        const theme = await page.evaluate(() => {
          const button = document.querySelector('button');
          const style = getComputedStyle(button);
          const canvas = document.querySelector('#stage canvas, #scene canvas');
          const gl = canvas.getContext('webgl2');
          return { radius: style.borderRadius, font: style.fontFamily, height: button.getBoundingClientRect().height, webgl: !!gl && !gl.isContextLost(), css: [...document.styleSheets].some(sheet => sheet.href?.endsWith('/shared/demo-ui.css') && sheet.cssRules.length > 0) };
        });
        assert.equal(theme.radius, '0px');
        assert(theme.font.includes('system-ui'));
        assert(theme.height >= 40);
        assert(theme.webgl, 'WebGL context must remain active');
        assert(theme.css, 'Shared stylesheet must load as CSS');
        const toggle = page.locator('button[aria-pressed]:not(:disabled)').first();
        if (await toggle.count()) {
          const before = await toggle.getAttribute('aria-pressed');
          await toggle.click();
          assert.notEqual(await toggle.getAttribute('aria-pressed'), before);
          await toggle.click();
          assert.equal(await toggle.getAttribute('aria-pressed'), before);
        }
        const notes = page.locator('.knowledge > summary');
        if (await notes.count()) {
          await notes.click();
          assert(await page.locator('.knowledge').getAttribute('open') !== null);
          await notes.click();
        }
        for (const size of sizes) {
          await page.setViewportSize(size);
          await page.waitForTimeout(150);
          try {
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
            const issues = await page.evaluate(() => {
              const issues = [];
              for (const el of document.querySelectorAll('button, select, input, header a[href="../index.html"], summary')) {
                if (!el.checkVisibility()) continue;
                el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
                const r = el.getBoundingClientRect();
                const label = el.id || el.textContent.trim().slice(0, 30);
                if (r.x < -1 || r.y < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) issues.push(`Control outside viewport: ${label} ${JSON.stringify(r)}`);
                const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
                if (hit !== el && !el.contains(hit)) issues.push(`Control covered: ${label}`);
              }
              return issues;
            });
            assert.deepEqual(issues, [], issues.join('\n'));
          } catch (error) { failures.push(`${name} ${size.width}×${size.height}: ${error.message}`); }
          await page.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('aside').forEach(el => el.scrollTop = 0); });
          // Let WebGL/compositor redraw after scrolling a canvas back into view.
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          await page.screenshot({ path: path.join(output, `${name}-${size.width}.png`), fullPage: true });
        }
        assert.deepEqual(errors, [], 'Runtime or resource errors');
        const back = page.locator('header a[href="../index.html"]');
        await back.click();
        await page.waitForSelector('.launch');
        assert.equal(await page.locator('.launch').count(), 16);
        results.push(name);
        console.log(`PASS ${name}: WebGL, shared theme, toggle, notes, gallery navigation; responsive checks recorded`);
      } catch (error) {
        failures.push(`${name}: ${error.message}`);
        console.error(`FAIL ${name}: ${error.message}`);
        await page.screenshot({ path: path.join(output, `${name}-failure.png`), fullPage: true }).catch(() => {});
      } finally { await page.close(); }
    }
    const reportName = process.env.DEMO_FILTER ? `results-${process.env.DEMO_FILTER.replace(/[^a-z0-9-]/gi, '_')}.json` : 'results.json';
    fs.writeFileSync(path.join(output, reportName), JSON.stringify({ results, failures }, null, 2));
    assert.deepEqual(failures, [], failures.join('\n'));
    console.log(`PASS ${results.length} demos across ${sizes.length} viewports. Screenshots: ${output}`);
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
