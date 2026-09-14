import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function fail(message) {
  console.error(`Experiment manifest rejected: ${message}`);
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) fail("provide a manifest path, for example: node tools/validate-experiment-manifest.mjs experiments/q1.json");

const repoRoot = process.cwd();
const absolute = path.resolve(repoRoot, inputPath);
if (!fs.existsSync(absolute)) fail(`file not found: ${inputPath}`);

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(absolute, "utf8"));
} catch (error) {
  fail(`invalid JSON (${error instanceof Error ? error.message : String(error)})`);
}

if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) fail("manifest must be a JSON object");
if (manifest.authoritative !== false) fail("authoritative must be explicitly false");
if (manifest.disposable !== true) fail("disposable must be explicitly true");
if (manifest.initializesCairn !== false) fail("initializesCairn must be explicitly false");

const prohibitedTrueFlags = [
  "createsIdentity",
  "createsContinuityState",
  "createsMemory",
  "createsCommitments",
  "createsCheckpoints",
  "createsGenesisState",
  "createsProvenanceState",
  "createsCommitGateState",
];

for (const key of prohibitedTrueFlags) {
  if (manifest[key] !== false) fail(`${key} must be explicitly false`);
}

if (typeof manifest.experimentId !== "string" || !manifest.experimentId.trim()) fail("experimentId is required");
if (typeof manifest.question !== "string" || !/^Q[123]$/.test(manifest.question)) fail("question must be Q1, Q2, or Q3");
if (typeof manifest.dataset !== "object" || !manifest.dataset || Array.isArray(manifest.dataset)) fail("dataset metadata is required");
if (manifest.dataset.synthetic !== true) fail("dataset.synthetic must be true");
if (typeof manifest.dataset.version !== "string" || !manifest.dataset.version.trim()) fail("dataset.version is required");
if (typeof manifest.dataset.path !== "string" || !manifest.dataset.path.trim()) fail("dataset.path is required");
if (typeof manifest.dataset.hash !== "string" || !manifest.dataset.hash.trim()) fail("dataset.hash is required");

const datasetPath = path.resolve(repoRoot, manifest.dataset.path);
const experimentsRoot = path.resolve(repoRoot, "experiments");
if (datasetPath !== experimentsRoot && !datasetPath.startsWith(`${experimentsRoot}${path.sep}`)) {
  fail("dataset.path must remain inside the experiments directory");
}
if (!fs.existsSync(datasetPath) || !fs.statSync(datasetPath).isFile()) {
  fail(`dataset file not found: ${manifest.dataset.path}`);
}

const hashMatch = /^sha256:([a-f0-9]{64})$/i.exec(manifest.dataset.hash.trim());
if (!hashMatch) fail("dataset.hash must use sha256:<64-hex-digest>");

const datasetBytes = fs.readFileSync(datasetPath);
const actualDigest = crypto.createHash("sha256").update(datasetBytes).digest("hex");
const expectedDigest = hashMatch[1].toLowerCase();
if (actualDigest !== expectedDigest) {
  fail(`dataset hash mismatch for ${manifest.dataset.path}; expected sha256:${expectedDigest}, got sha256:${actualDigest}`);
}

let datasetDocument;
try {
  datasetDocument = JSON.parse(datasetBytes.toString("utf8"));
} catch (error) {
  fail(`dataset must be valid JSON (${error instanceof Error ? error.message : String(error)})`);
}
if (!datasetDocument || typeof datasetDocument !== "object" || Array.isArray(datasetDocument)) fail("dataset must be a JSON object");
if (datasetDocument.synthetic !== true) fail("dataset file must explicitly declare synthetic=true");

if (!Array.isArray(manifest.metrics) || manifest.metrics.length === 0) fail("metrics must contain at least one measurement");
if (!manifest.metrics.every((metric) => typeof metric === "string" && metric.trim())) fail("every metric must be a non-empty string");

if (manifest.outputs && !Array.isArray(manifest.outputs)) fail("outputs must be an array when present");
if (manifest.outputs?.some((entry) => typeof entry !== "string" || !entry.trim())) fail("every output path must be a non-empty string");

console.log(`Experiment manifest accepted: ${manifest.experimentId}`);
console.log(`Question: ${manifest.question}`);
console.log(`Dataset hash verified: sha256:${actualDigest}`);
console.log("Boundary: synthetic, disposable, non-authoritative, pre-genesis");
