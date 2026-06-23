DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Criar ou reutilizar noro.users
  SELECT id INTO v_user_id FROM noro.users WHERE email = 'paulobolliger@gmail.com' LIMIT 1;

  IF v_user_id IS NULL THEN
    INSERT INTO noro.users (id, display_name, email, status, created_at, updated_at)
    VALUES (gen_random_uuid(), 'Paulo Bolliger', 'paulobolliger@gmail.com', 'active', NOW(), NOW())
    RETURNING id INTO v_user_id;
    RAISE NOTICE 'Usuário criado: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário já existe: %', v_user_id;
  END IF;

  -- 2. identity_link logto → noro.users
  INSERT INTO noro.identity_links (id, user_id, provider, provider_subject, provider_email, created_at, updated_at)
  VALUES (gen_random_uuid(), v_user_id, 'logto', 'uk8peexae8rc', 'paulobolliger@gmail.com', NOW(), NOW())
  ON CONFLICT (provider, provider_subject) DO NOTHING;

  -- 3. platform_role_assignment
  INSERT INTO noro.platform_role_assignments (id, user_id, role, status, created_at, updated_at)
  VALUES (gen_random_uuid(), v_user_id, 'platform_owner', 'active', NOW(), NOW())
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Seed concluído. user_id = %', v_user_id;
END $$;
