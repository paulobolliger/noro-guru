'use server';

import {
	createClientUpdateToken as createClientUpdateTokenProtected,
	getClientByUpdateToken as getClientByUpdateTokenProtected,
	updateClientFromPublicForm as updateClientFromPublicFormProtected,
	getClienteDetalhes as getClienteDetalhesProtected,
	updateCliente as updateClienteProtected,
	getClienteDocumentos as getClienteDocumentosProtected,
	createDocumento as createDocumentoProtected,
	updateDocumento as updateDocumentoProtected,
	deleteDocumento as deleteDocumentoProtected,
	getClientePreferencias as getClientePreferenciasProtected,
	upsertPreferencias as upsertPreferenciasProtected,
	getClienteEnderecos as getClienteEnderecosProtected,
	createEndereco as createEnderecoProtected,
	updateEndereco as updateEnderecoProtected,
	deleteEndereco as deleteEnderecoProtected,
	getClienteContatosEmergencia as getClienteContatosEmergenciaProtected,
	createContatoEmergencia as createContatoEmergenciaProtected,
	deleteContatoEmergencia as deleteContatoEmergenciaProtected,
	getClienteMilhas as getClienteMilhasProtected,
	createMilhas as createMilhasProtected,
	updateMilhas as updateMilhasProtected,
	deleteMilhas as deleteMilhasProtected,
} from '../../(protected)/clientes/[id]/actions';

export async function createClientUpdateToken(clienteId: string) {
	return createClientUpdateTokenProtected(clienteId);
}

export async function getClientByUpdateToken(token: string) {
	return getClientByUpdateTokenProtected(token);
}

export async function updateClientFromPublicForm(token: string, formData: FormData) {
	return updateClientFromPublicFormProtected(token, formData);
}

export async function getClienteDetalhes(clienteId: string) {
	return getClienteDetalhesProtected(clienteId);
}

export async function updateCliente(clienteId: string, formData: FormData) {
	return updateClienteProtected(clienteId, formData);
}

export async function getClienteDocumentos(clienteId: string) {
	return getClienteDocumentosProtected(clienteId);
}

export async function createDocumento(clienteId: string, formData: FormData) {
	return createDocumentoProtected(clienteId, formData);
}

export async function updateDocumento(documentoId: string, formData: FormData) {
	return updateDocumentoProtected(documentoId, formData);
}

export async function deleteDocumento(documentoId: string, clienteId: string) {
	return deleteDocumentoProtected(documentoId, clienteId);
}

export async function getClientePreferencias(clienteId: string) {
	return getClientePreferenciasProtected(clienteId);
}

export async function upsertPreferencias(clienteId: string, formData: FormData) {
	return upsertPreferenciasProtected(clienteId, formData);
}

export async function getClienteEnderecos(clienteId: string) {
	return getClienteEnderecosProtected(clienteId);
}

export async function createEndereco(clienteId: string, formData: FormData) {
	return createEnderecoProtected(clienteId, formData);
}

export async function updateEndereco(enderecoId: string, formData: FormData, clienteId: string) {
	return updateEnderecoProtected(enderecoId, formData, clienteId);
}

export async function deleteEndereco(enderecoId: string, clienteId: string) {
	return deleteEnderecoProtected(enderecoId, clienteId);
}

export async function getClienteContatosEmergencia(clienteId: string) {
	return getClienteContatosEmergenciaProtected(clienteId);
}

export async function createContatoEmergencia(clienteId: string, formData: FormData) {
	return createContatoEmergenciaProtected(clienteId, formData);
}

export async function deleteContatoEmergencia(contatoId: string, clienteId: string) {
	return deleteContatoEmergenciaProtected(contatoId, clienteId);
}

export async function getClienteMilhas(clienteId: string) {
	return getClienteMilhasProtected(clienteId);
}

export async function createMilhas(clienteId: string, formData: FormData) {
	return createMilhasProtected(clienteId, formData);
}

export async function updateMilhas(milhasId: string, formData: FormData, clienteId: string) {
	return updateMilhasProtected(milhasId, formData, clienteId);
}

export async function deleteMilhas(milhasId: string, clienteId: string) {
	return deleteMilhasProtected(milhasId, clienteId);
}
