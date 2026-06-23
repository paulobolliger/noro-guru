'use server';

import { getClientes as getClientesPublic } from '../../../clientes/actions';

export async function getClientes() {
	return getClientesPublic();
}
