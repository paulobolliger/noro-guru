// app/api/env-config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

interface EnvVariable {
  key: string;
  value: string;
  category: string;
  description?: string;
  isSecret?: boolean;
  isEnabled?: boolean;
}

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

export async function POST(request: NextRequest) {
  try {
    const { variables } = await request.json() as { variables: EnvVariable[] };

    // Em produção (Vercel), usar API do Vercel
    if (isVercel) {
      return await updateVercelEnvVariables(variables);
    }

    // Em desenvolvimento, salvar no .env.local
    return await updateLocalEnvFile(variables);

  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao salvar configurações', isProduction },
      { status: 500 }
    );
  }
}

async function updateLocalEnvFile(variables: EnvVariable[]) {
  // Construir o conteúdo do .env
  let envContent = '# Arquivo .env gerado pelo Control Plane\n';
  envContent += `# Última atualização: ${new Date().toISOString()}\n\n`;

  // Agrupar por categoria
  const grouped = variables.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {} as Record<string, EnvVariable[]>);

  // Gerar conteúdo com comentários
  const categoryNames = {
    database: 'DATABASE CONFIGURATION',
    auth: 'AUTHENTICATION',
    email: 'EMAIL / AWS SES',
    api: 'API INTEGRATIONS',
    other: 'OTHER SETTINGS',
  };

  for (const [category, vars] of Object.entries(grouped)) {
    envContent += `# ${categoryNames[category as keyof typeof categoryNames] || category.toUpperCase()}\n`;
    
    for (const variable of vars) {
      if (variable.description) {
        envContent += `# ${variable.description}\n`;
      }
      
      // Se a variável está desabilitada, comentar a linha
      if (variable.isEnabled === false) {
        envContent += `# ${variable.key}=${variable.value}\n`;
      } else {
        envContent += `${variable.key}=${variable.value}\n`;
      }
    }
    
    envContent += '\n';
  }

  // Salvar no arquivo .env.local
  const envPath = join(process.cwd(), '.env.local');
  await writeFile(envPath, envContent, 'utf-8');

  return NextResponse.json({ 
    success: true, 
    message: '✅ Configurações salvas em .env.local. Reinicie o servidor para aplicar as mudanças.',
    isProduction: false,
    location: '.env.local'
  });
}

async function updateVercelEnvVariables(variables: EnvVariable[]) {
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;
  const vercelTeamId = process.env.VERCEL_TEAM_ID;

  if (!vercelToken || !vercelProjectId) {
    return NextResponse.json({
      success: false,
      message: '❌ Configuração incompleta. Defina VERCEL_TOKEN e VERCEL_PROJECT_ID.',
      isProduction: true,
    }, { status: 400 });
  }

  try {
    // Vercel API endpoint
    const baseUrl = vercelTeamId 
      ? `https://api.vercel.com/v10/projects/${vercelProjectId}/env?teamId=${vercelTeamId}`
      : `https://api.vercel.com/v10/projects/${vercelProjectId}/env`;

    let successCount = 0;
    let errorCount = 0;

    for (const variable of variables) {
      try {
        // Verificar se a variável já existe
        const listResponse = await fetch(
          `${baseUrl}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${vercelToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!listResponse.ok) {
          console.error(`Erro ao listar variáveis: ${listResponse.statusText}`);
          errorCount++;
          continue;
        }

        const existingVars = await listResponse.json();
        const existingVar = existingVars.envs?.find((env: any) => env.key === variable.key);

        if (existingVar) {
          // Atualizar variável existente
          const updateResponse = await fetch(
            `${baseUrl}/${existingVar.id}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                value: variable.value,
              }),
            }
          );

          if (updateResponse.ok) {
            successCount++;
          } else {
            console.error(`Erro ao atualizar ${variable.key}: ${updateResponse.statusText}`);
            errorCount++;
          }
        } else {
          // Criar nova variável
          const createResponse = await fetch(
            baseUrl,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                key: variable.key,
                value: variable.value,
                type: variable.isSecret ? 'encrypted' : 'plain',
                target: ['production', 'preview', 'development'],
              }),
            }
          );

          if (createResponse.ok) {
            successCount++;
          } else {
            console.error(`Erro ao criar ${variable.key}: ${createResponse.statusText}`);
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`Erro ao processar ${variable.key}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: errorCount === 0,
      message: `✅ ${successCount} variáveis atualizadas no Vercel. ${errorCount > 0 ? `❌ ${errorCount} erros.` : ''} Faça redeploy para aplicar.`,
      isProduction: true,
      location: 'Vercel Environment Variables',
      stats: { success: successCount, errors: errorCount }
    });

  } catch (error) {
    console.error('Erro ao atualizar Vercel:', error);
    return NextResponse.json({
      success: false,
      message: '❌ Erro ao atualizar variáveis no Vercel',
      isProduction: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

