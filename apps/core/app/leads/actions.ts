'use server';

import {
	createLeadAction as createLeadActionProtected,
} from '../(protected)/leads/actions';

export async function createLeadAction(formData: FormData) {
	return createLeadActionProtected(formData);
}
