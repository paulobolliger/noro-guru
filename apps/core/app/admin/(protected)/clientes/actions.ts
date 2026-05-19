'use server';

import { getClientes as getClientesProtected } from '../../../(protected)/clientes/actions';

export async function getClientes() {
	return getClientesProtected();
}
