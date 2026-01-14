'use client';

import { useState } from 'react';
import { updateTenantCompany } from '../../tenant-actions';

interface TenantCompanyFormProps {
    tenantId: string;
    initialData?: any;
}

export default function TenantCompanyForm({ tenantId, initialData }: TenantCompanyFormProps) {
    const [loading, setLoading] = useState(false);
    const [sameAddress, setSameAddress] = useState(true);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            await updateTenantCompany(tenantId, formData);
            alert('Dados da empresa atualizados com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            {/* 1. Dados Cadastrais */}
            <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">1. Dados Cadastrais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Razão Social</label>
                        <input
                            name="razao_social"
                            defaultValue={initialData?.razao_social}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Razão Social Ltda"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome Fantasia</label>
                        <input
                            name="nome_empresa"
                            defaultValue={initialData?.nome_empresa}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Nome Comercial"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">CNPJ</label>
                        <input
                            name="documento"
                            defaultValue={initialData?.documento}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="00.000.000/0000-00"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Inscrição Estadual</label>
                            <input
                                name="inscricao_estadual"
                                defaultValue={initialData?.inscricao_estadual}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Isento se não houver"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Inscrição Municipal</label>
                            <input
                                name="inscricao_municipal"
                                defaultValue={initialData?.inscricao_municipal}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Numeração"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Principal</label>
                        <input
                            type="email"
                            name="email_principal"
                            defaultValue={initialData?.email_principal}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Telefone Comercial</label>
                        <input
                            name="telefone_comercial"
                            defaultValue={initialData?.telefone_comercial}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <input
                            name="website"
                            defaultValue={initialData?.website}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Endereço Sede */}
            <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">2. Endereço da Sede</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">CEP</label>
                        <input
                            name="sede_cep"
                            defaultValue={initialData?.endereco_sede?.cep}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Logradouro</label>
                        <input
                            name="sede_logradouro"
                            defaultValue={initialData?.endereco_sede?.logradouro}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Número</label>
                        <input
                            name="sede_numero"
                            defaultValue={initialData?.endereco_sede?.numero}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Complemento</label>
                        <input
                            name="sede_complemento"
                            defaultValue={initialData?.endereco_sede?.complemento}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bairro</label>
                        <input
                            name="sede_bairro"
                            defaultValue={initialData?.endereco_sede?.bairro}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Cidade</label>
                        <input
                            name="sede_cidade"
                            defaultValue={initialData?.endereco_sede?.cidade}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Estado (UF)</label>
                        <input
                            name="sede_estado"
                            defaultValue={initialData?.endereco_sede?.estado}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            maxLength={2}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Endereço de Cobrança */}
            <div className="p-6 space-y-6 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">3. Endereço de Cobrança</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="same_address"
                            checked={sameAddress}
                            onChange={(e) => setSameAddress(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Mesmo endereço da sede</span>
                    </label>
                </div>

                {!sameAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">CEP</label>
                            <input
                                name="cobranca_cep"
                                defaultValue={initialData?.endereco_cobranca?.cep}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Logradouro</label>
                            <input
                                name="cobranca_logradouro"
                                defaultValue={initialData?.endereco_cobranca?.logradouro}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Número</label>
                            <input
                                name="cobranca_numero"
                                defaultValue={initialData?.endereco_cobranca?.numero}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Complemento</label>
                            <input
                                name="cobranca_complemento"
                                defaultValue={initialData?.endereco_cobranca?.complemento}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Bairro</label>
                            <input
                                name="cobranca_bairro"
                                defaultValue={initialData?.endereco_cobranca?.bairro}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cidade</label>
                            <input
                                name="cobranca_cidade"
                                defaultValue={initialData?.endereco_cobranca?.cidade}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Estado (UF)</label>
                            <input
                                name="cobranca_estado"
                                defaultValue={initialData?.endereco_cobranca?.estado}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                maxLength={2}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Representante Legal */}
            <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">4. Representante Legal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                        <input name="rep_nome" defaultValue={initialData?.representante_legal?.nome} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nacionalidade</label>
                        <input name="rep_nacionalidade" defaultValue={initialData?.representante_legal?.nacionalidade} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Estado Civil</label>
                        <input name="rep_estado_civil" defaultValue={initialData?.representante_legal?.estado_civil} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Profissão</label>
                        <input name="rep_profissao" defaultValue={initialData?.representante_legal?.profissao} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email do Assinante</label>
                        <input type="email" name="rep_email" defaultValue={initialData?.representante_legal?.email} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">RG</label>
                        <input name="rep_rg" defaultValue={initialData?.representante_legal?.rg} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">CPF</label>
                        <input name="rep_cpf" defaultValue={initialData?.representante_legal?.cpf} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>

                    {/* Endereço Residencial do Representante */}
                    <div className="md:col-span-2 border-t border-gray-100 mt-4 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Endereço Residencial</h4>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <input name="rep_res_cep" placeholder="CEP" defaultValue={initialData?.representante_legal?.endereco_residencial?.cep} className="md:col-span-2 bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="rep_res_logradouro" placeholder="Logradouro" defaultValue={initialData?.representante_legal?.endereco_residencial?.logradouro} className="md:col-span-4 bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="rep_res_numero" placeholder="Número" defaultValue={initialData?.representante_legal?.endereco_residencial?.numero} className="bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="rep_res_complemento" placeholder="Complemento" defaultValue={initialData?.representante_legal?.endereco_residencial?.complemento} className="md:col-span-2 bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="rep_res_bairro" placeholder="Bairro" defaultValue={initialData?.representante_legal?.endereco_residencial?.bairro} className="md:col-span-3 bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="rep_res_cidade" placeholder="Cidade" defaultValue={initialData?.representante_legal?.endereco_residencial?.cidade} className="md:col-span-4 bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="rep_res_estado" placeholder="UF" defaultValue={initialData?.representante_legal?.endereco_residencial?.estado} className="md:col-span-2 bg-white border border-gray-300 rounded-lg px-3 py-2" maxLength={2} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Dados Operacionais */}
            <div className="p-6 space-y-6 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">5. Dados Operacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contato Financeiro */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">F</span>
                            Contato Financeiro
                        </h4>
                        <div className="space-y-2">
                            <input name="fin_nome" placeholder="Nome" defaultValue={initialData?.contatos?.financeiro?.nome} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="fin_email" placeholder="Email" defaultValue={initialData?.contatos?.financeiro?.email} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="fin_telefone" placeholder="Telefone" defaultValue={initialData?.contatos?.financeiro?.telefone} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                    </div>

                    {/* Contato Técnico */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">T</span>
                            Contato Técnico/Admin
                        </h4>
                        <div className="space-y-2">
                            <input name="tec_nome" placeholder="Nome" defaultValue={initialData?.contatos?.tecnico?.nome} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                            <input name="tec_email" placeholder="Email" defaultValue={initialData?.contatos?.tecnico?.email} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Documentos Obrigatórios */}
            <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">6. Documentos Obrigatórios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contrato Social */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Contrato Social</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="contrato_social"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.contrato_social?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.contrato_social.nome}</p>}
                        </div>
                    </div>
                    {/* Cartão CNPJ */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Cartão CNPJ</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="cartao_cnpj"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.cartao_cnpj?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.cartao_cnpj.nome}</p>}
                        </div>
                    </div>
                    {/* Documento Identidade */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Documento de Identidade</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="documento_identidade"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.documento_identidade?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.documento_identidade.nome}</p>}
                        </div>
                    </div>
                    {/* Comprovante Endereço Empresa */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Comp. Endereço Empresa</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="comprovante_endereco_empresa"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.comprovante_endereco_empresa?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.comprovante_endereco_empresa.nome}</p>}
                        </div>
                    </div>
                    {/* Comprovante Endereço Sócio */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Comp. Endereço Sócio</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="comprovante_endereco_socio"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.comprovante_endereco_socio?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.comprovante_endereco_socio.nome}</p>}
                        </div>
                    </div>
                    {/* Comprovante Inscrição Municipal */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Comp. Inscrição Municipal</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="comprovante_inscricao_municipal"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.comprovante_inscricao_municipal?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.comprovante_inscricao_municipal.nome}</p>}
                        </div>
                    </div>
                    {/* Procuração */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Procuração (Opcional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                name="procuracao"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-xs text-gray-500"
                            />
                            {initialData?.documentos?.procuracao?.nome && <p className="text-xs text-green-600 mt-2">Atual: {initialData.documentos.procuracao.nome}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. Dados Bancários */}
            <div className="p-6 space-y-6 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">7. Dados Bancários</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Banco</label>
                        <input name="banco_nome" placeholder="Ex: Banco do Brasil" defaultValue={initialData?.dados_bancarios?.banco} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Agência</label>
                        <input name="banco_agencia" placeholder="0000-0" defaultValue={initialData?.dados_bancarios?.agencia} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Conta</label>
                        <input name="banco_conta" placeholder="00000-0" defaultValue={initialData?.dados_bancarios?.conta} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tipo da Conta</label>
                        <select name="banco_tipo" defaultValue={initialData?.dados_bancarios?.tipo_conta} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2">
                            <option value="corrente">Corrente</option>
                            <option value="poupanca">Poupança</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Chave PIX</label>
                        <input name="banco_pix" placeholder="Chave PIX" defaultValue={initialData?.dados_bancarios?.chave_pix} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Comp. Bancário</label>
                        <input type="file" name="comprovante_bancario" className="w-full text-xs text-gray-500" />
                        {initialData?.documentos?.comprovante_bancario?.nome && <p className="text-xs text-green-600 mt-1">Atual: {initialData.documentos.comprovante_bancario.nome}</p>}
                    </div>
                </div>
            </div>

            {/* 8. Branding */}
            <div className="p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3">8. Branding & Logo</h3>
                <div className="flex items-start gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                        {initialData?.logo_url ? (
                            <img src={initialData.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-xs text-center p-2">Sem Logo</span>
                        )}
                        <input type="file" name="logo_file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" title="Clique para alterar" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Logomarca da Empresa</h4>
                        <p className="text-xs text-gray-500">Clique na área ao lado para fazer upload. Recomendado: PNG/JPG quadrado, min. 400x400px.</p>
                        <p className="text-xs text-amber-600">Nota: O upload real requer configuração de bucket.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    * Dados obrigatórios para geração de contrato.
                </p>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        'Salvar Todas as Alterações'
                    )}
                </button>
            </div>
        </form>
    );
}
