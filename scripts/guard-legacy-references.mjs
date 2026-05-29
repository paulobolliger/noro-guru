import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const ignoredDirs = new Set([
  '.git',
  '.next',
  'dist',
  'build',
  'node_modules',
  'coverage',
  '.turbo',
  '.stitch',
]);

const activeRoots = ['apps', 'packages', 'scripts', 'supabase'];
const ignoredFiles = new Set([
  'scripts/guard-legacy-references.mjs',
]);

const supabasePatterns = [
  /@supabase\//i,
  /\bsupabase\.auth\b/i,
  /\bsupabase\.storage\b/i,
  /@noro\/lib\/supabase/i,
  /@\/lib\/supabase/i,
  /createServerSupabaseClient/i,
  /createAdminSupabaseClient/i,
  /getSupabase(Server|Admin)/i,
];

const billingPatterns = [
  /\bstripe\b/i,
  /\bcielo\b/i,
  /\bbtg\b/i,
  /\berede\b/i,
  /\be\.Rede\b/i,
  /\bpaypal\b/i,
  /\bSTRIPE_/,
  /\bCIELO_/,
  /\bBTG_/,
  /\bEREDE_/,
];

const allowedSupabasePrefixes = [
  'supabase/',
  'packages/lib/supabase/',
  'apps/control/lib/supabase',
  'apps/control/package.json',
  'apps/control/hooks/',
  'apps/control/scripts/',
  'apps/control/components/',
  'apps/control/app/',
  'apps/sites/lib/get-site.ts',
  'apps/sites/package.json',
  'apps/web/package.json',
  'apps/web/app/api/sites/generate/route.ts',
  'apps/web/app/dashboard/sites/[id]/preview/page.tsx',
];

const allowedBillingPrefixes = [
  'apps/billing/',
  'apps/control/app/api/webhooks/stripe/',
  'apps/control/app/api/webhooks/btg/',
  'apps/control/app/(protected)/pedidos/',
  'apps/control/app/(protected)/configuracoes/env-actions.ts',
  'apps/control/app/settings/stripe/',
  'apps/control/app/globals.css',
  'apps/control/components/pagamentos/',
  'apps/control/components/pedidos/',
  'apps/control/components/IntegracoesTab.tsx',
  'apps/control/lib/modules/',
  'apps/control/package.json',
  'apps/core/app/(protected)/pedidos/providers/erede-provider.ts',
  'apps/core/app/(protected)/pedidos/',
  'apps/core/app/(protected)/custos/all/page.tsx',
  'apps/core/app/pedidos/',
  'apps/core/app/api/webhooks/erede-3ds/route.ts',
  'apps/core/app/api/webhooks/erede-pix/route.ts',
  'apps/core/components/admin/pagamentos/',
  'apps/core/components/admin/pedidos/',
  'apps/web/app/api/create-checkout-session/route.ts',
  'apps/web/app/features/page.tsx',
  'apps/web/app/security/page.tsx',
  'apps/web/components/PricingCards.tsx',
  'packages/lib/services/billingService.ts',
  'packages/lib/services/tenantService.ts',
  'packages/types/financeiro.ts',
  'supabase/',
];

function toRelative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
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

function isAllowed(relativePath, prefixes) {
  return prefixes.some((prefix) => relativePath.startsWith(prefix));
}

function scan(patterns, allowedPrefixes, label) {
  const findings = [];

  for (const activeRoot of activeRoots) {
    for (const file of walk(path.join(root, activeRoot))) {
      const relative = toRelative(file);
      if (relative.endsWith('.tsbuildinfo')) {
        continue;
      }
      if (ignoredFiles.has(relative) || path.basename(relative).startsWith('.env')) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split(/\r?\n/);

      lines.forEach((line, index) => {
        if (!patterns.some((pattern) => pattern.test(line))) {
          return;
        }

        if (!isAllowed(relative, allowedPrefixes)) {
          findings.push(`${relative}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }

  if (findings.length > 0) {
    console.error(`${label} references are frozen outside the mapped transitional files.`);
    console.error('');
    findings.forEach((finding) => console.error(`- ${finding}`));
    console.error('');
  }

  return findings;
}

const findings = [
  ...scan(supabasePatterns, allowedSupabasePrefixes, 'Supabase'),
  ...scan(billingPatterns, allowedBillingPrefixes, 'Legacy billing provider'),
];

if (findings.length > 0) {
  process.exit(1);
}

console.log('No unmapped Supabase or legacy billing references found.');
