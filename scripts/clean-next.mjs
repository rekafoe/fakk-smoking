/**
 * Remove .next with retries (helps when a stale next dev still holds files).
 * Used by npm run clean on all platforms.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dirs = [
  path.join(root, ".next"),
  path.join(root, "node_modules", ".cache"),
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function removeDir(target, maxAttempts = 5) {
  const label = path.basename(target);
  if (!fs.existsSync(target)) {
    console.log(`${label} not present`);
    return;
  }
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      console.log(`Removed ${label}`);
      return;
    } catch (err) {
      if (i === maxAttempts) throw err;
      console.warn(`Retry ${i}/${maxAttempts} removing ${label}: ${err.message}`);
      await sleep(1500);
    }
  }
}

async function clean() {
  for (const dir of dirs) {
    await removeDir(dir);
  }
}

clean().catch((err) => {
  console.error(err.message);
  console.error(
    process.platform === "win32"
      ? "On Windows: stop next dev (ports 3000/3001), then run: npm run clean:win"
      : "Stop any running next dev, then run: npm run clean"
  );
  process.exit(1);
});
