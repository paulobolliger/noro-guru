# Script para inserir dados de teste no sistema de chat
# Execute este script após as migrations principais estarem aplicadas

Write-Host "🔄 Inserindo dados de teste no sistema de chat..." -ForegroundColor Cyan

# Ler o conteúdo da migration
$sql = Get-Content "supabase\migrations\20251101000002_chat_test_data.sql" -Raw

# Executar via supabase CLI
$sql | npx supabase db execute

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dados de teste inseridos com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Dados criados:" -ForegroundColor Yellow
    Write-Host "  • 3 conversas por tenant (ativa, aguardando, resolvida)" -ForegroundColor White
    Write-Host "  • João Silva - 3 mensagens não lidas (ativa)" -ForegroundColor White
    Write-Host "  • Maria Santos - 2 mensagens não lidas (aguardando)" -ForegroundColor White
    Write-Host "  • Pedro Costa - 8 mensagens (resolvida)" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Agora você pode:" -ForegroundColor Yellow
    Write-Host "  1. Ver o badge no TopBar mostrando '5' mensagens não lidas" -ForegroundColor White
    Write-Host "  2. Clicar no ícone de chat para ir para /comunicacao" -ForegroundColor White
    Write-Host "  3. Ver a lista de conversas no dashboard" -ForegroundColor White
    Write-Host "  4. Abrir uma conversa individual e enviar mensagens" -ForegroundColor White
} else {
    Write-Host "❌ Erro ao inserir dados de teste" -ForegroundColor Red
    Write-Host "Verifique se as migrations principais já foram executadas" -ForegroundColor Yellow
}
