'use server';

import {
	convertToPedido as convertToPedidoProtected,
	updatePedido as updatePedidoProtected,
	addPedidoItem as addPedidoItemProtected,
	updatePedidoItem as updatePedidoItemProtected,
	deletePedidoItem as deletePedidoItemProtected,
	emitirCobranca as emitirCobrancaProtected,
	registerPayment as registerPaymentProtected,
} from '../(protected)/pedidos/pedidos-actions';

export async function convertToPedido(orcamentoId: string) {
	return convertToPedidoProtected(orcamentoId);
}

export async function updatePedido(pedidoId: string, payload: { status?: string; valor_total?: number }) {
	return updatePedidoProtected(pedidoId, payload);
}

export async function addPedidoItem(payload: {
	pedido_id: string;
	servico_nome: string;
	quantidade: number;
	valor_unitario: number;
}) {
	return addPedidoItemProtected(payload);
}

export async function updatePedidoItem(
	itemId: string,
	payload: { servico_nome?: string; quantidade?: number; valor_unitario?: number }
) {
	return updatePedidoItemProtected(itemId, payload);
}

export async function deletePedidoItem(itemId: string) {
	return deletePedidoItemProtected(itemId);
}

export async function emitirCobranca(payload: {
	pedido_id: string;
	provider: 'EREDE_CREDITO' | 'EREDE_DEBITO' | 'EREDE_PIX';
	data_vencimento: string;
	// e.Rede — cartão (crédito / débito)
	cardholderName?: string;
	cardNumber?: string;
	expirationMonth?: number;
	expirationYear?: number;
	securityCode?: string;
	parcelas?: number;
	// e.Rede — PIX
	pixExpirationSeconds?: number;
}) {
	return emitirCobrancaProtected(payload);
}

export async function registerPayment(
	pedidoId: string,
	payload: {
		valor_pago: number;
		forma_pagamento: string;
		data_pagamento: string;
	}
) {
	return registerPaymentProtected(pedidoId, payload);
}
