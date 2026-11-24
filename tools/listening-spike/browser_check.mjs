import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'fs';

const cases = JSON.parse(readFileSync('../tools/listening-spike/work/fake2/cases.json', 'utf-8'));
const out = [];
for (const c of cases) {
  const browser = await chromium.launch({
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${c.file}`],
  });
  const ctx = await browser.newContext({ permissions: ['microphone'] });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/listening-lab', { waitUntil: 'commit' });
  const select = page.getByLabel('Syllable to practise');
  await select.waitFor({ timeout: 60000 });
  const options = await select.locator('option').allTextContents();
  await select.selectOption(String(options.findIndex((o) => o.includes(`(${c.target})`))));
  await page.getByRole('button', { name: /Say it/ }).click();
  await page.getByRole('status').waitFor({ timeout: 30000 });
  const title = (await page.getByRole('status').innerText()).split('\n').filter(Boolean)[1];
  out.push({ ...c, title });
  console.log(c.kind.padEnd(12), c.target.padEnd(6), 'said', c.said.padEnd(6), '->', title);
  await browser.close();
}
const ok = (k, re) => out.filter((o) => o.kind === k && re.test(o.title)).length;
console.log('right accepted:', ok('right', /Well done/), '/', out.filter((o) => o.kind === 'right').length);
console.log('wrong vowel named as vowel:', ok('wrong-vowel', /check the vowel/), '| accepted by mistake:', ok('wrong-vowel', /Well done/), '/', out.filter((o) => o.kind === 'wrong-vowel').length);
writeFileSync('tmp-lab-results.json', JSON.stringify(out, null, 1));
