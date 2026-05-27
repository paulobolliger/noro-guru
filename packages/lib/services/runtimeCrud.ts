export type RuntimeDocument = {
  $id?: string;
  id?: string;
  $createdAt?: string;
  $updatedAt?: string;
} & Record<string, unknown>;

export type TenantScopedDocument = RuntimeDocument & { tenantId: string };
export type CreateDocumentInput<TDocument extends RuntimeDocument> = Omit<
  TDocument,
  '$id' | '$createdAt' | '$updatedAt'
>;
export type UpdateDocumentInput<TDocument extends RuntimeDocument> = Partial<
  CreateDocumentInput<TDocument>
>;

export interface ListOptions {
  queries?: string[];
  limit?: number;
  offset?: number;
}

function unavailable(): never {
  throw new Error(
    'Camada de dados transicional desativada. Use packages/db para acesso PostgreSQL/Drizzle nesta fase.',
  );
}

export function createCollectionService<TDocument extends RuntimeDocument>(
  _collectionName: string,
) {
  return {
    async list(options?: ListOptions): Promise<TDocument[]> {
      void options;
      unavailable();
    },

    async getById(id: string): Promise<TDocument | null> {
      void id;
      unavailable();
    },

    async create(data: CreateDocumentInput<TDocument>): Promise<TDocument> {
      void data;
      unavailable();
    },

    async update(id: string, data: UpdateDocumentInput<TDocument>): Promise<TDocument> {
      void id;
      void data;
      unavailable();
    },

    async remove(id: string): Promise<void> {
      void id;
      unavailable();
    },
  };
}

export function createTenantCollectionService<TDocument extends TenantScopedDocument>(
  collectionName: string,
) {
  const base = createCollectionService<TDocument>(collectionName);

  return {
    async list(tenantId: string, options?: ListOptions): Promise<TDocument[]> {
      void tenantId;
      void options;
      unavailable();
    },

    async getById(tenantId: string, id: string): Promise<TDocument | null> {
      const document = await base.getById(id);
      return document?.tenantId === tenantId ? document : null;
    },

    async create(
      tenantId: string,
      data: Omit<CreateDocumentInput<TDocument>, 'tenantId'>,
    ): Promise<TDocument> {
      return base.create({ ...data, tenantId } as unknown as CreateDocumentInput<TDocument>);
    },

    async update(
      tenantId: string,
      id: string,
      data: Omit<UpdateDocumentInput<TDocument>, 'tenantId'>,
    ): Promise<TDocument> {
      const existing = await this.getById(tenantId, id);
      if (!existing) {
        throw new Error('Documento não encontrado para o tenant informado.');
      }

      return base.update(id, data as UpdateDocumentInput<TDocument>);
    },

    async remove(tenantId: string, id: string): Promise<void> {
      const existing = await this.getById(tenantId, id);
      if (!existing) {
        throw new Error('Documento não encontrado para o tenant informado.');
      }

      await base.remove(id);
    },
  };
}
