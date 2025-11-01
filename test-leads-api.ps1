# Script de Teste - Sistema de Leads NORO
# Execute com: .\test-leads-api.ps1

Write-Host "🧪 Testando Sistema de Leads NORO" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Configuração
$controlPlaneUrl = "http://localhost:3001" # Ajuste se necessário
$apiKey = "noro_api_key_production_2025"
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# Teste 1: Criar Lead
Write-Host "📝 Teste 1: Criar Lead via API" -ForegroundColor Yellow
$leadData = @{
    name = "João Teste"
    email = "joao.teste@email.com"
    phone = "(11) 98765-4321"
    company = "Empresa Teste LTDA"
    interest = "plano-professional"
    message = "Gostaria de conhecer mais sobre os planos"
    source = "test-script"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$controlPlaneUrl/api/leads" `
        -Method POST `
        -Headers $headers `
        -Body $leadData `
        -ErrorAction Stop
    
    Write-Host "✅ Lead criado com sucesso!" -ForegroundColor Green
    Write-Host "   Lead ID: $($response.leadId)" -ForegroundColor Gray
    $leadId = $response.leadId
} catch {
    Write-Host "❌ Erro ao criar lead:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verifique se o Control Plane está rodando em $controlPlaneUrl" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Teste 2: Enviar Email
Write-Host "📧 Teste 2: Enviar Email de Teste" -ForegroundColor Yellow
$emailData = @{
    to = "joao.teste@email.com"
    subject = "Teste - Sistema de Leads NORO"
    html = @"
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #342CA4;">Olá João!</h1>
    <p>Este é um email de teste do sistema de captação de leads da NORO.</p>
    <p>Recebemos seu interesse no <strong>Plano Professional</strong>.</p>
    <hr style="border: 1px solid #1DD3C0;">
    <p style="color: #666; font-size: 14px;">
        Este é um teste automatizado do sistema.<br>
        NORO - Transformando gestão em resultados
    </p>
</div>
"@
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$controlPlaneUrl/api/email/send" `
        -Method POST `
        -Headers $headers `
        -Body $emailData `
        -ErrorAction Stop
    
    Write-Host "✅ Email enviado com sucesso!" -ForegroundColor Green
    Write-Host "   Message ID: $($response.messageId)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Erro ao enviar email:" -ForegroundColor Yellow
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verifique a configuração do Resend" -ForegroundColor Yellow
}

Write-Host ""

# Teste 3: Criar Notificação
Write-Host "🔔 Teste 3: Criar Notificação" -ForegroundColor Yellow
$notificationData = @{
    title = "Novo Lead Capturado!"
    message = "João Teste da Empresa Teste LTDA demonstrou interesse no Plano Professional"
    type = "info"
    metadata = @{
        leadId = $leadId
        source = "test-script"
        interest = "plano-professional"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$controlPlaneUrl/api/notifications" `
        -Method POST `
        -Headers $headers `
        -Body $notificationData `
        -ErrorAction Stop
    
    Write-Host "✅ Notificação criada com sucesso!" -ForegroundColor Green
    Write-Host "   Notificações criadas: $($response.notificationsCreated)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Erro ao criar notificação:" -ForegroundColor Yellow
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verifique se há usuários admin/owner no banco" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🎉 Testes Concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Verificar no Supabase se o lead foi salvo:" -ForegroundColor White
Write-Host "   SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Verificar se a notificação foi criada:" -ForegroundColor White
Write-Host "   SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Testar integração completa do site:" -ForegroundColor White
Write-Host "   http://localhost:3000 → Clicar em 'Fale Conosco'" -ForegroundColor Gray
Write-Host ""
