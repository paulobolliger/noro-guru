import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const activeRoots = ['apps', 'packages', 'scripts'];
const blockedPatterns = [
  /\bnode-appwrite\b/i,
  /\bappwrite\b/i,
  /\bAPPWRITE_/,
  /@\/types\/appwrite/i,
  /@noro\/lib\/services\/appwriteCrud/i,
];

const ignoredDirs = new Set([
  '.git',
  '.next',
  'dist',
  'build',
  'node_modules',
  'coverage',
]);

const ignoredFiles = new Set([
  path.normalize('scripts/guard-no-appwrite.mjs'),
  path.normalize('scripts/README.md'),
]);

const packageFiles = ['package.json', 'package-lock.json'];

function toRelative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

function shouldSkip(filePath) {
  const relative = toRelative(filePath);
  if (ignoredFiles.has(path.normalize(relative))) {
    return true;
  }

  return relative.startsWith('docs/archive/');
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function scanTextFiles() {
  const findings = [];

  for (const activeRoot of activeRoots) {
    const fullRoot = path.join(root, activeRoot);
    const files = walk(fullRoot);

    for (const file of files) {
      if (shouldSkip(file)) {
        continue;
      }

      const relative = toRelative(file);
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split(/\r?\n/);

      lines.forEach((line, index) => {
        for (const pattern of blockedPatterns) {
          if (pattern.test(line)) {
            findings.push(`${relative}:${index + 1}: ${line.trim()}`);
            break;
          }
        }
      });
    }
  }

  return findings;
}

function scanPackageDependencies() {
  const findings = [];

  for (const packageFile of packageFiles) {
    const fullPath = path.join(root, packageFile);
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const rootPackage = packageFile === 'package-lock.json'
      ? json.packages?.['']
      : json;

    const dependencyGroups = [
      ['dependencies', rootPackage?.dependencies],
      ['devDependencies', rootPackage?.devDependencies],
      ['optionalDependencies', rootPackage?.optionalDependencies],
      ['peerDependencies', rootPackage?.peerDependencies],
    ];

    for (const [groupName, dependencies] of dependencyGroups) {
      for (const dependencyName of Object.keys(dependencies ?? {})) {
        if (/appwrite/i.test(dependencyName)) {
          findings.push(`${packageFile}:${groupName}: ${dependencyName}`);
        }
      }
    }

    if (packageFile === 'package-lock.json') {
      for (const lockedPackage of Object.keys(json.packages ?? {})) {
        if (/node_modules\/.*appwrite/i.test(lockedPackage)) {
          findings.push(`${packageFile}:packages: ${lockedPackage}`);
        }
      }
    }
  }

  return findings;
}

const findings = [
  ...scanTextFiles(),
  ...scanPackageDependencies(),
];

if (findings.length > 0) {
  console.error('Appwrite is not allowed in active code, scripts, or dependencies.');
  console.error('Allowed historical references belong under docs/archive/ only.');
  console.error('');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log('No active Appwrite references found.');
