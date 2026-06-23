import postgres from 'postgres';

process.stdout.write('Iniciando seed...\n');

const DB = 'postgresql://noro_master:5oAq0H0RSxSYmN73naix6kKSUzVkv1LNzuuddltGTMBFZafrwaV2QEbGdagAwYrs@localhost:5433/noro_guru_db';

async function run() {
  process.stdout.write('Conectando ao banco...\n');
  const sql = postgres(DB, { max: 1 });

  try {
    process.stdout.write('Verificando usuário...\n');

    const existing = await sql`
      SELECT id FROM noro.users WHERE email = 'paulobolliger@gmail.com' LIMIT 1
    `;

    let userId;

    if (existing.length > 0) {
      userId = existing[0].id;
      process.stdout.write('Usuário já existe: ' + userId + '\n');
    } else {
      const created = await sql`
        INSERT INTO noro.users (id, display_name, email, status, created_at, updated_at)
        VALUES (gen_random_uuid(), 'Paulo Bolliger', 'paulobolliger@gmail.com', 'active', NOW(), NOW())
        RETURNING id
      `;
      userId = created[0].id;
      process.stdout.write('Usuário criado: ' + userId + '\n');
    }

    await sql`
      INSERT INTO noro.identity_links (id, user_id, provider, provider_subject, provider_email, created_at, updated_at)
      VALUES (gen_random_uuid(), ${userId}, 'logto', 'uk8peexae8rc', 'paulobolliger@gmail.com', NOW(), NOW())
      ON CONFLICT (provider, provider_subject) DO NOTHING
    `;
    process.stdout.write('identity_link OK\n');

    await sql`
      INSERT INTO noro.platform_role_assignments (id, user_id, role, status, created_at, updated_at)
      VALUES (gen_random_uuid(), ${userId}, 'platform_owner', 'active', NOW(), NOW())
      ON CONFLICT (user_id, role) DO NOTHING
    `;
    process.stdout.write('platform_role OK\n');

    process.stdout.write('SEED CONCLUIDO. user_id=' + userId + '\n');
  } catch (err) {
    process.stderr.write('ERRO: ' + (err.message ?? String(err)) + '\n');
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
