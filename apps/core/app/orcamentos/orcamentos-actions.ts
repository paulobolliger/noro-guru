'use server';

import {
	createOrcamento as createOrcamentoProtected,
	updateOrcamento as updateOrcamentoProtected,
} from '../(protected)/orcamentos/orcamentos-actions';

export async function createOrcamento(formData: FormData) {
	return createOrcamentoProtected(formData);
}

export async function updateOrcamento(orcamentoId: string, formData: FormData) {
	return updateOrcamentoProtected(orcamentoId, formData);
}
