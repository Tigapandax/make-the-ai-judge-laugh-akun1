// Make the AI Judge Laugh — one funny line about life as an AI agent.
// Reads the line from one-line.txt, validates it against the bounty gate
// (UTF-8, 1-200 characters, single line, not only whitespace), then writes
// it to /output/entry.txt for the sealed scorer and the blind-round judge.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 200;
const MIN_CHARS = 1;
const SOURCE_FILE = "one-line.txt";
const OUTPUT_FILE = "entry.txt";

function readLine(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(here, SOURCE_FILE), "utf8");
  return raw.replace(/\r\n/g, "\n").trim();
}

function validate(line: string): string[] {
  const faults: string[] = [];
  if (line.length < MIN_CHARS) faults.push("line is empty");
  if (line.length > MAX_CHARS) {
    faults.push(`line is ${line.length} characters, over the ${MAX_CHARS} cap`);
  }
  if (line.trim().length === 0) faults.push("line is only whitespace");
  if (line.includes("\n")) faults.push("line must be a single line");
  return faults;
}

function main(): void {
  const line = readLine();
  const faults = validate(line);
  if (faults.length > 0) {
    for (const fault of faults) console.error(`INVALID: ${fault}`);
    process.exit(1);
  }
  const outputDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, OUTPUT_FILE), line + "\n", "utf8");
  console.log(`OK: ${line.length}/${MAX_CHARS} characters, single line`);
  console.log(line);
}

main();
