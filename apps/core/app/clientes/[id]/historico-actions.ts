'use server';

import {
	getClienteHistorico as getClienteHistoricoProtected,
	getClienteTimeline as getClienteTimelineProtected,
} from '../../(protected)/clientes/[id]/historico-actions';

export async function getClienteHistorico(clienteId: string) {
	return getClienteHistoricoProtected(clienteId);
}

export async function getClienteTimeline(clienteId: string) {
	return getClienteTimelineProtected(clienteId);
}
