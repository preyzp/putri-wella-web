// Test-only year override. Never imported by the application or included in its bundle.
import { readFileSync } from 'node:fs';
const actualYear = Date.prototype.getFullYear;
Date.prototype.getFullYear = function () {
  try {
    const year = JSON.parse(readFileSync(process.env.SANITY_TEST_STATE_FILE, 'utf8')).footerYear;
    if (Number.isInteger(year)) return year;
  } catch { /* Normal clock when a local test state is unavailable. */ }
  return actualYear.call(this);
};
