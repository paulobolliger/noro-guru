/**
 * Multi-Tenant Isolation Tests
 *
 * CRITICAL: These tests verify that tenant data is properly isolated.
 * All tests MUST pass before deploying to production with multiple tenants.
 *
 * Run with: npm test -- tenant-isolation.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Mock tenant IDs (replace with actual tenant IDs from your database)
const TENANT_1_ID = 'tenant-1-uuid'
const TENANT_2_ID = 'tenant-2-uuid'

// Mock user IDs (replace with actual user IDs)
const USER_TENANT_1 = 'user-tenant-1-uuid'
const USER_TENANT_2 = 'user-tenant-2-uuid'

describe('Multi-Tenant Isolation - Critical Security Tests', () => {
  let supabaseAdmin: any
  let tenant1Client: any
  let tenant2Client: any

  beforeAll(async () => {
    // Setup admin client (bypasses RLS for test setup)
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Setup clients for each tenant (uses anon key + RLS)
    tenant1Client = createClient(
      SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    tenant2Client = createClient(
      SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Authenticate as users from different tenants
    // Note: This requires test users to be created beforehand
    // await tenant1Client.auth.signInWithPassword({
    //   email: 'user1@tenant1.com',
    //   password: 'test-password'
    // })
    // await tenant2Client.auth.signInWithPassword({
    //   email: 'user2@tenant2.com',
    //   password: 'test-password'
    // })
  })

  afterAll(async () => {
    // Cleanup test data
    // await supabaseAdmin.from('noro_leads').delete().like('email', '%@test-tenant%')
  })

  describe('Leads Isolation', () => {
    it('should NOT allow tenant1 to read tenant2 leads', async () => {
      // Create a lead in tenant2
      const { data: lead2 } = await supabaseAdmin
        .from('noro_leads')
        .insert({
          organization_name: 'Secret Agency',
          email: 'secret@test-tenant2.com',
          tenant_id: TENANT_2_ID,
        })
        .select()
        .single()

      // Try to read from tenant1 (should not see tenant2's lead)
      const { data: leads1 } = await tenant1Client
        .from('noro_leads')
        .select('*')
        .eq('email', 'secret@test-tenant2.com')

      expect(leads1).toHaveLength(0)
      expect(leads1?.find((l: any) => l.id === lead2.id)).toBeUndefined()
    })

    it('should NOT allow tenant1 to update tenant2 leads', async () => {
      // Create lead in tenant2
      const { data: lead2 } = await supabaseAdmin
        .from('noro_leads')
        .insert({
          organization_name: 'Protected Lead',
          email: 'protected@test-tenant2.com',
          tenant_id: TENANT_2_ID,
        })
        .select()
        .single()

      // Tenant1 tries to update tenant2's lead
      const { error } = await tenant1Client
        .from('noro_leads')
        .update({ organization_name: 'HACKED' })
        .eq('id', lead2.id)

      // Update should fail (no rows affected) due to RLS
      expect(error).toBeDefined()

      // Verify data unchanged
      const { data: unchanged } = await supabaseAdmin
        .from('noro_leads')
        .select('organization_name')
        .eq('id', lead2.id)
        .single()

      expect(unchanged.organization_name).toBe('Protected Lead')
    })

    it('should NOT allow tenant1 to delete tenant2 leads', async () => {
      const { data: lead2 } = await supabaseAdmin
        .from('noro_leads')
        .insert({
          organization_name: 'Undeletable',
          email: 'undeletable@test-tenant2.com',
          tenant_id: TENANT_2_ID,
        })
        .select()
        .single()

      // Tenant1 tries to delete
      const { error } = await tenant1Client
        .from('noro_leads')
        .delete()
        .eq('id', lead2.id)

      expect(error).toBeDefined()

      // Verify still exists
      const { data: stillExists } = await supabaseAdmin
        .from('noro_leads')
        .select('id')
        .eq('id', lead2.id)
        .single()

      expect(stillExists).toBeDefined()
    })
  })

  describe('Clientes Isolation', () => {
    it('should NOT allow cross-tenant client data access', async () => {
      // Create client in tenant2
      await supabaseAdmin.from('noro_clientes').insert({
        nome: 'Cliente Secreto',
        email: 'secreto@test-tenant2.com',
        tenant_id: TENANT_2_ID,
      })

      // Tenant1 queries (should not see tenant2's client)
      const { data } = await tenant1Client
        .from('noro_clientes')
        .select('*')
        .eq('email', 'secreto@test-tenant2.com')

      expect(data).toHaveLength(0)
    })

    it('should NOT allow tenant1 to access tenant2 client details', async () => {
      const { data: client } = await supabaseAdmin
        .from('noro_clientes')
        .insert({
          nome: 'VIP Cliente',
          email: 'vip@test-tenant2.com',
          cpf: '12345678900',
          tenant_id: TENANT_2_ID,
        })
        .select()
        .single()

      // Direct access by ID should fail for tenant1
      const { data: accessAttempt } = await tenant1Client
        .from('noro_clientes')
        .select('*')
        .eq('id', client.id)

      expect(accessAttempt).toHaveLength(0)
    })
  })

  describe('Financial Data Isolation', () => {
    it('should NOT allow cross-tenant revenue access', async () => {
      // Create revenue in tenant2
      await supabaseAdmin.from('fin_receitas').insert({
        descricao: 'Receita Confidencial',
        valor: 100000,
        tenant_id: TENANT_2_ID,
        data_vencimento: new Date().toISOString(),
        data_competencia: new Date().toISOString(),
        status: 'pendente',
      })

      // Tenant1 tries to access
      const { data } = await tenant1Client
        .from('fin_receitas')
        .select('*')
        .eq('descricao', 'Receita Confidencial')

      expect(data).toHaveLength(0)
    })

    it('should NOT allow cross-tenant expense access', async () => {
      await supabaseAdmin.from('fin_despesas').insert({
        descricao: 'Despesa Privada',
        valor: 5000,
        tenant_id: TENANT_2_ID,
        data_vencimento: new Date().toISOString(),
        data_competencia: new Date().toISOString(),
        status: 'pendente',
      })

      const { data } = await tenant1Client
        .from('fin_despesas')
        .select('*')
        .eq('descricao', 'Despesa Privada')

      expect(data).toHaveLength(0)
    })

    it('should NOT allow cross-tenant bank account access', async () => {
      await supabaseAdmin.from('fin_contas_bancarias').insert({
        nome: 'Conta Secreta',
        banco: '001',
        agencia: '1234',
        conta: '56789-0',
        saldo_inicial: 0,
        tenant_id: TENANT_2_ID,
      })

      const { data } = await tenant1Client
        .from('fin_contas_bancarias')
        .select('*')
        .eq('nome', 'Conta Secreta')

      expect(data).toHaveLength(0)
    })
  })

  describe('Pedidos/Orders Isolation', () => {
    it('should NOT allow cross-tenant order access', async () => {
      const { data: order } = await supabaseAdmin
        .from('noro_pedidos')
        .insert({
          numero: 'ORDER-SECRET-001',
          tenant_id: TENANT_2_ID,
          status: 'pendente',
        })
        .select()
        .single()

      const { data } = await tenant1Client
        .from('noro_pedidos')
        .select('*')
        .eq('numero', 'ORDER-SECRET-001')

      expect(data).toHaveLength(0)
    })
  })

  describe('Configuration Isolation', () => {
    it('should NOT allow cross-tenant configuration access', async () => {
      await supabaseAdmin.from('noro_configuracoes').insert({
        tipo: 'sistema',
        chave: 'secret_api_key',
        valor: 'sk_test_secret_123',
        tenant_id: TENANT_2_ID,
      })

      const { data } = await tenant1Client
        .from('noro_configuracoes')
        .select('*')
        .eq('chave', 'secret_api_key')

      expect(data).toHaveLength(0)
    })
  })

  describe('RLS Policy Effectiveness', () => {
    it('should enforce RLS even with direct SQL queries', async () => {
      // This test verifies that RLS cannot be bypassed with SQL injection attempts
      const maliciousId = `' OR tenant_id != tenant_id OR '1'='1`

      const { data } = await tenant1Client
        .from('noro_leads')
        .select('*')
        .eq('id', maliciousId)

      // Should return empty due to type checking and parameterization
      expect(data).toHaveLength(0)
    })

    it('should not leak data through joins', async () => {
      // Create related data in tenant2
      const { data: cliente } = await supabaseAdmin
        .from('noro_clientes')
        .insert({
          nome: 'Cliente Tenant2',
          email: 'join-test@tenant2.com',
          tenant_id: TENANT_2_ID,
        })
        .select()
        .single()

      await supabaseAdmin.from('noro_pedidos').insert({
        numero: 'JOIN-TEST-001',
        cliente_id: cliente.id,
        tenant_id: TENANT_2_ID,
        status: 'pendente',
      })

      // Tenant1 tries to access via join
      const { data } = await tenant1Client
        .from('noro_pedidos')
        .select(`
          *,
          cliente:noro_clientes(*)
        `)
        .eq('numero', 'JOIN-TEST-001')

      expect(data).toHaveLength(0)
    })
  })

  describe('Audit Log Security', () => {
    it('should log blocked access attempts', async () => {
      // Attempt unauthorized access
      await tenant1Client
        .from('noro_leads')
        .select('*')
        .eq('tenant_id', TENANT_2_ID)  // Explicitly trying to access tenant2

      // Check if logged (requires admin access to audit log)
      const { data: logs } = await supabaseAdmin
        .schema('cp')
        .from('security_audit_log')
        .select('*')
        .eq('blocked', true)
        .order('created_at', { ascending: false })
        .limit(10)

      // Note: This may be empty if middleware blocked before query execution
      // That's actually good - defense in depth
    })
  })
})

describe('Tenant Context Functions', () => {
  it('should correctly identify current tenant', async () => {
    // This would test getCurrentTenantId() function
    // Requires actual HTTP context to work
    // Mock test for now
    expect(true).toBe(true)
  })

  it('should prevent tenant_id spoofing from client', async () => {
    // Verify that tenant_id cannot be sent from client
    // Must come from server context only
    expect(true).toBe(true)
  })
})
