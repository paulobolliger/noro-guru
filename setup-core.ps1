# Script para copiar base do admin do nomade-guru-final para /core do noro-guru
# E ajustar todos os imports automaticamente

Write-Host "Iniciando copia e ajuste do modulo core..." -ForegroundColor Cyan

$sourceDir = "C:\1-Projetos-Sites\GitHub\nomade-guru-final\app\admin"
$targetDir = "C:\1-Projetos-Sites\GitHub\noro-guru\apps\core"

# 1. Verificar se origem existe
if (-not (Test-Path $sourceDir)) {
    Write-Host "Diretorio de origem nao encontrado: $sourceDir" -ForegroundColor Red
    exit 1
}

# 2. Criar diretorio de destino se nao existir
if (-not (Test-Path $targetDir)) {
    Write-Host "Criando diretorio: $targetDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# 3. Copiar todos os arquivos recursivamente
Write-Host "Copiando arquivos de $sourceDir para $targetDir..." -ForegroundColor Yellow
Copy-Item -Path "$sourceDir\*" -Destination $targetDir -Recurse -Force

Write-Host "Arquivos copiados com sucesso!" -ForegroundColor Green

# 4. Ajustar imports em todos os arquivos TypeScript/JavaScript
Write-Host "Ajustando imports nos arquivos..." -ForegroundColor Yellow

$filesToUpdate = Get-ChildItem -Path $targetDir -Recurse -Include *.ts,*.tsx,*.js,*.jsx

$totalFiles = $filesToUpdate.Count
$currentFile = 0

foreach ($file in $filesToUpdate) {
    $currentFile++
    Write-Progress -Activity "Ajustando imports" -Status "Processando $($file.Name)" -PercentComplete (($currentFile / $totalFiles) * 100)
    
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Substituir patterns
    if ($content -match '@/admin') {
        $content = $content -replace '@/admin', '@'
        $modified = $true
    }
    if ($content -match 'app/admin') {
        $content = $content -replace 'app/admin', 'apps/core'
        $modified = $true
    }
    if ($content -match '"admin/') {
        $content = $content -replace '"admin/', '"@/'
        $modified = $true
    }
    
    if ($modified) {
        $content | Set-Content -Path $file.FullName -NoNewline
        Write-Host "  Atualizado: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "Imports ajustados em $totalFiles arquivos!" -ForegroundColor Green

Write-Host ""
Write-Host "Processo concluido com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. cd apps\core" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White  
Write-Host "  3. Ajustar lib/supabase para conectar ao banco do tenant" -ForegroundColor White
Write-Host "  4. npm run dev" -ForegroundColor White
