/**
 * ============================================================
 * AVISO DE SEGURANÇA — LEIA ANTES DE EXECUTAR
 * ============================================================
 *
 * Este script cria o primeiro usuário platform_owner no schema
 * canônico `noro` (tabelas users, identity_links,
 * platform_role_assignments).
 *
 * NUNCA executar contra o banco de produção sem:
 *   1. Aprovação explícita de Paulo Bolliger.
 *   2. Backup/dump confirmado do banco alvo.
 *   3. DATABASE_URL apontando para banco dev/staging isolado.
 *   4. ALLOW_NORO_SEED=true definido explicitamente.
 *
 * O script recusa execução se:
 *   - NODE_ENV=production
 *   - DATABASE_URL contém o IP do banco de produção (45.32.169.173)
 *   - ALLOW_NORO_SEED não for exatamente "true"
 *
 * O script é IDEMPOTENTE:
 *   - se o usuário já existe (por email), reutiliza;
 *   - se identity_link já existe (provider+subject), não duplica;
 *   - se platform_role já existe, não duplica;
 *   - nunca apaga registros.
 *
 * Modo dry-run (--dry-run): exibe o que seria feito sem escrever.
 *
 * Uso:
 *   npx tsx scripts/seed-platform-owner.ts \
 *     --email paulobolliger@gmail.com \
 *     --logto-sub <sub_do_logto> \
 *     --display-name "Paulo Bolliger" \
 *     [--dry-run]
 *
 * Como obter o --logto-sub:
 *   Faça login em https://auth.norotec.cloud com paulobolliger@gmail.com
 *   e capture o campo `sub` do JWT de identidade (via painel Logto Admin
 *   ou via log controlado em ambiente dev). Ver Sprint 1M, seção 4.
 *
 * ============================================================
 */

import { parseArgs } from 'node:util';
import { createDatabaseClient } from '../packages/db/index';
import {
  usersRepository,
  authIdentityRepository,
  platformRolesRepository,
} from '../packages/db/repositories/index';

// ---------------------------------------------------------------------------
// Argumentos de linha de comando
// ---------------------------------------------------------------------------

const { values: args } = parseArgs({
  options: {
    email: { type: 'string' },
    'logto-sub': { type: 'string' },
    'display-name': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
  strict: true,
});

// ---------------------------------------------------------------------------
// Validações de segurança — executadas ANTES de qualquer conexão ao banco
// ---------------------------------------------------------------------------

function guardProductionSafety(): void {
  const errors: string[] = [];

  if (process.env.NODE_ENV === 'production') {
    errors.push('NODE_ENV=production detectado. Recusando execução.');
  }

  if (process.env.ALLOW_NORO_SEED !== 'true') {
    errors.push(
      'ALLOW_NORO_SEED não está definido como "true". ' +
        'Defina ALLOW_NORO_SEED=true explicitamente para prosseguir.',
    );
  }

  const databaseUrl = process.env.DATABASE_URL ?? '';
  const PROD_HOST = '45.32.169.173';
  if (databaseUrl.includes(PROD_HOST)) {
    errors.push(
      `DATABASE_URL contém o host de produção (${PROD_HOST}). ` +
        'Use apenas um banco dev/staging isolado.',
    );
  }

  if (errors.length > 0) {
    console.error('\n🛑 SEED BLOQUEADO — Erros de segurança:\n');
    for (const e of errors) {
      console.error(`  ✗ ${e}`);
    }
    console.error('\nNenhuma alteração foi feita no banco.\n');
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Validações de argumento
// ---------------------------------------------------------------------------

function validateArgs(): { email: string; logtoSub: string; displayName: string; dryRun: boolean } {
  const missing: string[] = [];

  if (!args['email']) missing.push('--email');
  if (!args['logto-sub']) missing.push('--logto-sub');
  if (!args['display-name']) missing.push('--display-name');

  if (missing.length > 0) {
    console.error(`\nArgumentos obrigatórios ausentes: ${missing.join(', ')}\n`);
    console.error(
      'Uso:\n' +
        '  npx tsx scripts/seed-platform-owner.ts \\\n' +
        '    --email paulobolliger@gmail.com \\\n' +
        '    --logto-sub <sub_do_logto> \\\n' +
        '    --display-name "Paulo Bolliger" \\\n' +
        '    [--dry-run]\n',
    );
    process.exit(1);
  }

  return {
    email: args['email'] as string,
    logtoSub: args['logto-sub'] as string,
    displayName: args['display-name'] as string,
    dryRun: args['dry-run'] === true,
  };
}

// ---------------------------------------------------------------------------
// Seed principal
// ---------------------------------------------------------------------------

async function seedPlatformOwner() {
  guardProductionSafety();
  const { email, logtoSub, displayName, dryRun } = validateArgs();

  const mode = dryRun ? '[DRY-RUN]' : '[SEED]';
  console.log(`\n${mode} Iniciando bootstrap do platform_owner...`);
  console.log(`  email:       ${email}`);
  console.log(`  logto-sub:   ${logtoSub}`);
  console.log(`  displayName: ${displayName}`);
  console.log(`  dryRun:      ${dryRun}`);
  console.log(`  DATABASE_URL: ${(process.env.DATABASE_URL ?? '').replace(/:\/\/[^@]+@/, '://***@')}`);
  console.log();

  const { db, close } = createDatabaseClient();

  try {
    // ------------------------------------------------------------------
    // 1. Criar ou reutilizar noro.users
    // ------------------------------------------------------------------
    let user = await usersRepository.getUserByEmail(db, email);

    if (user) {
      console.log(`${mode} ✓ Usuário já existe (id=${user.id}). Reutilizando.`);
    } else {
      console.log(`${mode} → Criando usuário: ${email}`);
      if (!dryRun) {
        user = await usersRepository.createUserProfile(db, {
          email,
          displayName,
          status: 'active',
        });
        console.log(`${mode} ✓ Usuário criado (id=${user?.id}).`);
      } else {
        console.log(`${mode} (dry-run) Criaria: INSERT INTO noro.users (email, display_name, status)`);
        // Simula user para os passos seguintes no dry-run
        user = { id: '<novo-uuid>', email, displayName, status: 'active', createdAt: new Date(), updatedAt: new Date(), phone: null, avatarUrl: null, metadata: null };
      }
    }

    if (!user) {
      throw new Error('Falha ao criar ou recuperar o usuário.');
    }

    const userId = user.id;

    // ------------------------------------------------------------------
    // 2. Criar ou reutilizar noro.identity_links (provider=logto)
    // ------------------------------------------------------------------
    const existingLink = await authIdentityRepository.findUserByProviderSubject(
      db,
      'logto',
      logtoSub,
    );

    if (existingLink) {
      console.log(
        `${mode} ✓ identity_link já existe para (logto, ${logtoSub}). Pulando.`,
      );
    } else {
      console.log(`${mode} → Criando identity_link: provider=logto, subject=${logtoSub}`);
      if (!dryRun) {
        await authIdentityRepository.linkLogtoIdentity(db, {
          userId,
          providerSubject: logtoSub,
          providerEmail: email,
        });
        console.log(`${mode} ✓ identity_link criado.`);
      } else {
        console.log(
          `${mode} (dry-run) Criaria: INSERT INTO noro.identity_links ` +
            `(user_id=${userId}, provider=logto, provider_subject=${logtoSub})`,
        );
      }
    }

    // ------------------------------------------------------------------
    // 3. Criar ou reutilizar noro.platform_role_assignments (platform_owner)
    // ------------------------------------------------------------------
    // Em dry-run com usuário simulado, userId não é UUID real — pular query.
    const isSimulatedUser = dryRun && userId === '<novo-uuid>';
    const hasRole = isSimulatedUser
      ? false
      : await platformRolesRepository.hasPlatformRole(db, userId, 'platform_owner');

    if (hasRole) {
      console.log(`${mode} ✓ platform_role_assignment já existe para platform_owner. Pulando.`);
    } else {
      console.log(`${mode} → Criando platform_role_assignment: role=platform_owner`);
      if (!dryRun) {
        await platformRolesRepository.grantPlatformRole(db, {
          userId,
          role: 'platform_owner',
          status: 'active',
          grantedByUserId: null,
        });
        console.log(`${mode} ✓ platform_role_assignment criado.`);
      } else {
        console.log(
          `${mode} (dry-run) Criaria: INSERT INTO noro.platform_role_assignments ` +
            `(user_id=${userId}, role=platform_owner, status=active)`,
        );
      }
    }

    console.log(`\n${mode} Bootstrap concluído com sucesso.`);
    if (dryRun) {
      console.log('(dry-run) Nenhuma alteração foi escrita no banco.');
    }
  } finally {
    await close();
  }
}

seedPlatformOwner().catch((err) => {
  console.error('\n❌ Erro durante o seed:', err);
  process.exit(1);
});
