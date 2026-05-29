import psycopg2
import os

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

MAPEAMENTO_TIPOS = {
    'integer': 'integer', 'bigint': 'integer', 'smallint': 'integer',
    'boolean': 'boolean', 'text': 'string', 'character varying': 'string',
    'varchar': 'string', 'timestamp': 'string', 'timestamp with time zone': 'string',
    'timestamp without time zone': 'string', 'date': 'string',
    'numeric': 'float', 'double precision': 'float', 'real': 'float',
    'uuid': 'string', 'json': 'string', 'jsonb': 'string'
}

def obter_estrutura_supabase():
    print("🔄 Conectando ao Supabase para mapear a estrutura...")
    conn = psycopg2.connect(
        host=SUPABASE_DB_HOST, database=SUPABASE_DB_NAME,
        user=SUPABASE_DB_USER, password=SUPABASE_DB_PASS, port=SUPABASE_DB_PORT
    )
    cursor = conn.cursor()
    
    query = """
        SELECT c.table_name, c.column_name, c.data_type, c.is_nullable
        FROM information_schema.columns c
        JOIN information_schema.tables t ON c.table_name = t.table_name AND c.table_schema = t.table_schema
        WHERE c.table_schema = 'public' 
          AND t.table_type = 'BASE TABLE'
          AND c.table_name NOT LIKE 'v_%'
          AND c.table_name NOT LIKE 'vw_%'
        ORDER BY c.table_name, c.ordinal_position;
    """
    cursor.execute(query)
    linhas = cursor.fetchall()
    
    estrutura = {}
    for tabela, coluna, tipo, is_nullable in linhas:
        if tabela not in estrutura:
            estrutura[tabela] = []
        estrutura[tabela].append({
            'coluna': coluna, 'tipo': tipo,
            'obrigatorio': True if is_nullable == 'NO' else False
        })
        
    cursor.close()
    conn.close()
    return estrutura

def calcular_tamanho_otimizado(nome_coluna, tipo_original):
    nome = nome_coluna.lower()
    tipo = tipo_original.lower()
    
    # 1. Identificadores estritos e UUIDs
    if tipo == 'uuid' or nome == 'id' or nome.endswith('_id'):
        return 36
        
    # 2. Status, Tipos e Flags de controle curto
    if nome in ['status', 'tipo', 'priority', 'prioridade', 'cor', 'moeda', 'enabled', 'ativo']:
        return 30
        
    # 3. Dados formatados padronizados curtos
    if nome in ['cnpj_cpf', 'cpf', 'cnpj', 'telefone', 'phone', 'telephone', 'cep', 'zip_code', 'endereco_cep', 'endereco_numero', 'endereco_estado']:
        return 30
        
    # 4. Tags, Categorias e Strings curtas de classificação
    if nome in ['tags', 'category', 'categoria', 'tipo_rateio', 'marca', 'bot_name', 'last_message_sender', 'endereco_pais']:
        return 50
        
    # 5. Dados textuais comuns (Nomes, Emails, Cidades, Bairros)
    if 'email' in nome or 'nome' in nome or 'name' in nome or 'cidade' in nome or 'bairro' in nome or 'logradouro' in nome or 'complemento' in nome:
        return 150
        
    # 6. Textos longos, JSONs e logs (Ajustados para 1000 para não estourar a linha)
    if tipo in ['text', 'json', 'jsonb'] or nome in ['response', 'trigger', 'welcome_message', 'transfer_message', 'offline_message', 'observacoes', 'descricao', 'metadata', 'client_metadata', 'feedback', 'last_message']:
        return 1000
        
    # Padrão seguro para qualquer outra string varchar não mapeada
    return 100 

def criar_estrutura_no_appwrite(estrutura):
    print(f"🚀 Verificando/Criando banco de dados '{NOME_NOVO_BANCO}'...")
    try:
        appwrite_db.create(database_id=DATABASE_ID, name=NOME_NOVO_BANCO)
    except Exception:
        print(f"ℹ️ Banco de dados '{DATABASE_ID}' pronto.")

    for tabela, colunas in estrutura.items():
        collection_id = tabela.lower().replace("-", "_")
        print(f"\n📦 Coleção: {collection_id}")
        
        try:
            appwrite_db.create_collection(
                database_id=DATABASE_ID, collection_id=collection_id, name=tabela
            )
        except Exception as e:
            if "already exists" in str(e).lower():
                print(f"  ℹ️ Coleção já existente. Verificando atributos...")
            else:
                print(f"  ❌ Erro ao criar coleção: {e}")
                continue

        # Criar os atributos
        for col in colunas:
            nome_attr = col['coluna']
            tipo_pg = col['tipo']
            obrigatorio = col['obrigatorio']
            tipo_appwrite = MAPEAMENTO_TIPOS.get(tipo_pg, 'string')
            
            try:
                if tipo_appwrite == 'string':
                    # Chama a função de encolhimento inteligente por coluna
                    tamanho = calcular_tamanho_otimizado(nome_attr, tipo_pg)
                    
                    appwrite_db.create_string_attribute(
                        database_id=DATABASE_ID, collection_id=collection_id,
                        key=nome_attr, size=tamanho, required=obrigatorio
                    )
                elif tipo_appwrite == 'integer':
                    appwrite_db.create_integer_attribute(
                        database_id=DATABASE_ID, collection_id=collection_id,
                        key=nome_attr, required=obrigatorio
                    )
                elif tipo_appwrite == 'boolean':
                    appwrite_db.create_boolean_attribute(
                        database_id=DATABASE_ID, collection_id=collection_id,
                        key=nome_attr, required=obrigatorio
                    )
                elif tipo_appwrite == 'float':
                    appwrite_db.create_float_attribute(
                        database_id=DATABASE_ID, collection_id=collection_id,
                        key=nome_attr, required=obrigatorio
                    )
                print(f"  ➡️ Atributo criado: {nome_attr} (Tamanho: {tamanho if tipo_appwrite == 'string' else 'N/A'})")
            except Exception as ae:
                if "already exists" in str(ae).lower():
                    pass
                else:
                    print(f"  ❌ Erro no atributo {nome_attr} ({tipo_pg}): {ae}")

if __name__ == "__main__":
    try:
        estrutura = obter_estrutura_supabase()
        if not estrutura:
            print("❌ Nenhuma tabela física encontrada no Supabase.")
        else:
            criar_estrutura_no_appwrite(estrutura)
            print("\n✅ Estrutura do Noro sincronizada com sucesso no Appwrite!")
    except Exception as e:
        print(f"❌ Erro crítico: {e}")
