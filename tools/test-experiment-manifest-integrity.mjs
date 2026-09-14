import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const validator = path.join(repoRoot, "tools", "validate-experiment-manifest.mjs");
const manifestPath = path.join(repoRoot, "experiments", "example-q1-manifest.json");

const valid = spawnSync(process.execPath, [validator, manifestPath], {
  cwd: repoRoot,
  encoding: "utf8",
});
assert.equal(valid.status, 0, `expected valid manifest to pass:\n${valid.stderr || valid.stdout}`);
assert.match(valid.stdout, /Dataset hash verified: sha256:[a-f0-9]{64}/i);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const sourceDataset = path.join(repoRoot, manifest.dataset.path);
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "cairn-manifest-test-"));

try {
  const tamperedDataset = path.join(repoRoot, "experiments", `.tampered-${path.basename(tempRoot)}.json`);
  const tamperedManifest = path.join(repoRoot, "experiments", `.tampered-${path.basename(tempRoot)}-manifest.json`);

  fs.writeFileSync(tamperedDataset, `${fs.readFileSync(sourceDataset, "utf8").trim()}\n `, "utf8");
  fs.writeFileSync(
    tamperedManifest,
    JSON.stringify(
      {
        ...manifest,
        experimentId: `${manifest.experimentId}-tamper-check`,
        dataset: {
          ...manifest.dataset,
          path: path.relative(repoRoot, tamperedDataset).replaceAll(path.sep, "/"),
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  const tampered = spawnSync(process.execPath, [validator, tamperedManifest], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.notEqual(tampered.status, 0, "expected tampered dataset to be rejected");
  assert.match(`${tampered.stderr}\n${tampered.stdout}`, /dataset hash mismatch/i);

  fs.rmSync(tamperedDataset, { force: true });
  fs.rmSync(tamperedManifest, { force: true });
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log("Cairn experiment manifest integrity validation passed.");
