import psycopg2
import json
import os
from decimal import Decimal

if os.environ.get("NORO_ALLOW_LEGACY_APPWRITE_MIGRATION") != "I_UNDERSTAND_THIS_IS_LEGACY":
    raise RuntimeError(
        "Legacy Supabase to Appwrite migration is frozen. "
        "Set NORO_ALLOW_LEGACY_APPWRITE_MIGRATION=I_UNDERSTAND_THIS_IS_LEGACY only for audited historical recovery."
    )

from appwrite.client import Client
from appwrite.services.databases import Databases

# ==========================================
# 1. CONFIGURAÇÕES DE CONEXÃO
# ==========================================

# Pegue na aba Project Settings -> Database do Supabase
SUPABASE_DB_HOST = "db.gjffoongddkorxnnzmzc.supabase.co"
SUPABASE_DB_NAME = "postgres"
SUPABASE_DB_USER = "postgres"
SUPABASE_DB_PASS = "Gr@bo5207418"
SUPABASE_DB_PORT = "5432"

# Dados do seu Appwrite Self-Hosted
APPWRITE_ENDPOINT = "http://appwrite-u1319eb25e9zxnj4kv1ud3cp.45.32.169.173.sslip.io/v1"
APPWRITE_PROJECT_ID = "noro"
APPWRITE_API_KEY = "standard_f06c920cfe859b74ebae27d3f503c1e57235c68d3d9ef872e44a17fb1757f01a2ad0f1847dc8504c7f2f87a21c0cf1099aec154f82d02fe5a112311e9dc01f68fa7289e339e6ad1db140b1ee5ec98bed53daa86d1518fcea4f8e656d626a5a145ad848f3d95f0dcde24b2d71460395dcd7a9d3ec1b5acc9f031b31286c074455"

# Nome do banco de dados que será criado no Appwrite
NOME_NOVO_BANCO = "Noro Database"
DATABASE_ID = "noro_db" # ID único para o banco

# ==========================================
# 2. INICIALIZAÇÃO DOS CLIENTES
# ==========================================

client = Client()
client.set_endpoint(APPWRITE_ENDPOINT)
client.set_project(APPWRITE_PROJECT_ID)
client.set_key(APPWRITE_API_KEY)
appwrite_db = Databases(client)

def puxar_dados_supabase(tabela):
    """Retorna todas as linhas de uma tabela formatadas em dicionário"""
    conn = psycopg2.connect(
        host=SUPABASE_DB_HOST, database=SUPABASE_DB_NAME,
        user=SUPABASE_DB_USER, password=SUPABASE_DB_PASS, port=SUPABASE_DB_PORT
    )
    cursor = conn.cursor()
    cursor.execute(f'SELECT * FROM "{tabela}";')
    colunas = [desc[0] for desc in cursor.description]
    linhas = cursor.fetchall()
    
    dados = []
    for linha in linhas:
        dados.append(dict(zip(colunas, linha)))
        
    cursor.close()
    conn.close()
    return dados

def tratar_valores_para_appwrite(registro):
    """Trata dados do Postgres para o padrão do Appwrite com trava de tamanho"""
    dados_limpos = {}
    for chave, valor in registro.items():
        if valor is None:
            continue
            
        if isinstance(valor, Decimal):
            dados_limpos[chave] = float(valor)
        elif isinstance(valor, (dict, list)):
            dados_limpos[chave] = json.dumps(valor)
        elif hasattr(valor, 'isoformat'):
            dados_limpos[chave] = valor.isoformat()
        elif isinstance(valor, str) and chave == 'requirement':
            # Garante que o texto não estoure o teto máximo de segurança do MariaDB
            dados_limpos[chave] = valor[:65500]
        else:
            dados_limpos[chave] = valor
            
    return dados_limpos

if __name__ == "__main__":
    print("▶️ Iniciando Carga de Segurança da tabela 'visa_requirements'...")
    try:
        registros = puxar_dados_supabase("visa_requirements")
        print(f"📦 Encontrados {len(registros)} itens no Supabase. Injetando no Appwrite...")
        
        sucessos = 0
        erros = 0
        
        for reg in registros:
            document_id = str(reg.get('id') or reg.get('id_visto') or '')
            payload = tratar_valores_para_appwrite(reg)
            
            if 'id' in payload:
                del payload['id']
            if 'id_visto' in payload:
                del payload['id_visto']
                
            try:
                appwrite_db.create_document(
                    database_id=DATABASE_ID,
                    collection_id="visa_requirements",
                    document_id=document_id,
                    data=payload
                )
                sucessos += 1
            except Exception as e:
                if "already exists" in str(e).lower():
                    sucessos += 1
                else:
                    print(f"  ❌ Erro no registro {document_id}: {e}")
                    erros += 1
                    
        print(f"\n🏁 Processo concluído! Sucessos: {sucessos} | Falhas: {erros}")
        
    except Exception as e:
        print(f"\n❌ Erro crítico no processo: {e}")
