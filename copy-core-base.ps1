# Script para copiar base do admin do nomade-guru-final para /core do noro-guru
# E ajustar todos os imports automaticamente

Write-Host "🚀 Iniciando cópia e ajuste do módulo core..." -ForegroundColor Cyan

$sourceDir = "C:\1-Projetos-Sites\GitHub\nomade-guru-final\app\admin"
$targetDir = "C:\1-Projetos-Sites\GitHub\noro-guru\apps\core"

# 1. Verificar se origem existe
if (-not (Test-Path $sourceDir)) {
    Write-Host "❌ Diretório de origem não encontrado: $sourceDir" -ForegroundColor Red
    exit 1
}

# 2. Criar diretório de destino se não existir
if (-not (Test-Path $targetDir)) {
    Write-Host "📁 Criando diretório: $targetDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# 3. Copiar todos os arquivos recursivamente
Write-Host "📋 Copiando arquivos de $sourceDir para $targetDir..." -ForegroundColor Yellow
Copy-Item -Path "$sourceDir\*" -Destination $targetDir -Recurse -Force

Write-Host "✅ Arquivos copiados com sucesso!" -ForegroundColor Green

# 4. Ajustar imports em todos os arquivos TypeScript/JavaScript
Write-Host "🔧 Ajustando imports nos arquivos..." -ForegroundColor Yellow

$filesToUpdate = Get-ChildItem -Path $targetDir -Recurse -Include *.ts,*.tsx,*.js,*.jsx

$replacements = @(
    @{ Pattern = '@/admin'; Replacement = '@' },
    @{ Pattern = 'app/admin'; Replacement = 'apps/core' },
    @{ Pattern = '"admin/'; Replacement = '"@/' },
    @{ Pattern = "'admin/"; Replacement = "'@/" },
    @{ Pattern = 'from "admin'; Replacement = 'from "@' },
    @{ Pattern = "from 'admin"; Replacement = "from '@" }
)

$totalFiles = $filesToUpdate.Count
$currentFile = 0

foreach ($file in $filesToUpdate) {
    $currentFile++
    Write-Progress -Activity "Ajustando imports" -Status "Processando $($file.Name)" -PercentComplete (($currentFile / $totalFiles) * 100)
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($rep in $replacements) {
        if ($content -match [regex]::Escape($rep.Pattern)) {
            $content = $content -replace [regex]::Escape($rep.Pattern), $rep.Replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✓ Atualizado: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "✅ Imports ajustados em $totalFiles arquivos!" -ForegroundColor Green

# 5. Criar/Atualizar package.json se necessário
$packageJsonPath = "$targetDir\package.json"

if (-not (Test-Path $packageJsonPath)) {
    Write-Host "📦 Criando package.json..." -ForegroundColor Yellow
    
    $packageJson = @{
        name = "core"
        version = "0.1.0"
        private = $true
        scripts = @{
            dev = "next dev -p 3004"
            build = "next build"
            start = "next start -p 3004"
            lint = "next lint"
        }
        dependencies = @{
            "next" = "^14.2.4"
            "react" = "^18.3.1"
            "react-dom" = "^18.3.1"
            "@supabase/supabase-js" = "^2.45.4"
            "@supabase/ssr" = "^0.5.2"
            "lucide-react" = "^0.446.0"
            "recharts" = "^2.12.7"
            "date-fns" = "^3.6.0"
            "zod" = "^3.23.8"
        }
        devDependencies = @{
            "@types/node" = "^20"
            "@types/react" = "^18"
            "@types/react-dom" = "^18"
            "typescript" = "^5"
            "eslint" = "^8"
            "eslint-config-next" = "14.2.4"
            "tailwindcss" = "^3.4.1"
            "postcss" = "^8"
            "autoprefixer" = "^10.0.1"
        }
    } | ConvertTo-Json -Depth 10
    
    Set-Content -Path $packageJsonPath -Value $packageJson -Encoding UTF8
    Write-Host "✅ package.json criado!" -ForegroundColor Green
}

# 6. Criar arquivos de configuração do Next.js
$nextConfigPath = "$targetDir\next.config.mjs"
if (-not (Test-Path $nextConfigPath)) {
    Write-Host "⚙️ Criando next.config.mjs..." -ForegroundColor Yellow
    
    $nextConfig = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@noro/ui', '@noro/lib'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
"@
    
    Set-Content -Path $nextConfigPath -Value $nextConfig -Encoding UTF8
    Write-Host "✅ next.config.mjs criado!" -ForegroundColor Green
}

# 7. Criar tsconfig.json
$tsconfigPath = "$targetDir\tsconfig.json"
if (-not (Test-Path $tsconfigPath)) {
    Write-Host "⚙️ Criando tsconfig.json..." -ForegroundColor Yellow
    
    $tsconfig = @"
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@noro/ui": ["../../packages/ui"],
      "@noro/lib": ["../../packages/lib"],
      "@noro/types": ["../../packages/types"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"@
    
    Set-Content -Path $tsconfigPath -Value $tsconfig -Encoding UTF8
    Write-Host "✅ tsconfig.json criado!" -ForegroundColor Green
}

# 8. Criar tailwind.config.js
$tailwindConfigPath = "$targetDir\tailwind.config.js"
if (-not (Test-Path $tailwindConfigPath)) {
    Write-Host "⚙️ Criando tailwind.config.js..." -ForegroundColor Yellow
    
    $tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@
    
    Set-Content -Path $tailwindConfigPath -Value $tailwindConfig -Encoding UTF8
    Write-Host "✅ tailwind.config.js criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Processo concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. cd apps\core" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. Ajustar lib/supabase para conectar ao banco do tenant" -ForegroundColor White
Write-Host "  4. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📊 Resumo:" -ForegroundColor Yellow
Write-Host "  • Arquivos copiados: ✓" -ForegroundColor Green
Write-Host "  • Imports ajustados: ✓" -ForegroundColor Green
Write-Host "  • Configurações criadas: ✓" -ForegroundColor Green
Write-Host "  • Porta configurada: 3004" -ForegroundColor Green
