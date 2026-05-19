'use server';

import {
	getClientes as getClientesProtected,
	getClienteById as getClienteByIdProtected,
	createClienteAction as createClienteActionProtected,
	updateClienteAction as updateClienteActionProtected,
	deleteClienteAction as deleteClienteActionProtected,
	getClientesStats as getClientesStatsProtected,
} from '../(protected)/clientes/actions';

export async function getClientes() {
	return getClientesProtected();
}

export async function getClienteById(clienteId: string) {
	return getClienteByIdProtected(clienteId);
}

export async function createClienteAction(formData: FormData) {
	return createClienteActionProtected(formData);
}

export async function updateClienteAction(clienteId: string, formData: FormData) {
	return updateClienteActionProtected(clienteId, formData);
}

export async function deleteClienteAction(clienteId: string) {
	return deleteClienteActionProtected(clienteId);
}

export async function getClientesStats() {
	return getClientesStatsProtected();
}
