'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Documento } from '@/types'
import ModalConfirmacao from './ModalConfirmacao'

interface CardDocumentoProps {
  documento: Documento
  onRemover: (id: string) => Promise<void>
}

export default function CardDocumento({ documento, onRemover }: CardDocumentoProps) {
  const [modalAberto, setModalAberto] = useState(false)
  const [removendo, setRemoendo] = useState(false)

  async function handleConfirmarRemocao() {
    setRemoendo(true)
    try {
      await onRemover(documento.id)
    } finally {
      setRemoendo(false)
      setModalAberto(false)
    }
  }

  const labelPessoa = documento.tipoPessoa === 'fisica' ? 'Pessoa física' : 'Pessoa jurídica'
  const labelDoc = documento.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'

  return (
    <>
      <div
        className="bg-white flex flex-col h-full"
        style={{ border: '1px solid #D5D5D5', borderRadius: '8px', overflow: 'hidden' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #D5D5D5' }}
        >
          <h4
            style={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '32px',
              color: '#2E2D2C',
            }}
          >
            {documento.nomeDocumento}
          </h4>
          <button
            onClick={() => setModalAberto(true)}
            disabled={removendo}
            className="shrink-0 disabled:opacity-50 transition-opacity"
            aria-label="Remover documento"
            title="Remover documento"
          >
            {removendo ? (
              <div className="w-6 h-6 border-2 border-[#D5D5D5] border-t-[#3570B2] rounded-full animate-spin" />
            ) : (
              <Image src="/delete_black_24dp.svg" alt="Remover" width={24} height={24} />
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-1" style={{ color: '#2E2D2C' }}>
          <div className="flex flex-col gap-2 px-5 py-4 text-sm border-b border-[#D5D5D5] sm:border-b-0 sm:flex-[0_0_50%]">
            <p className="font-bold mb-1">{labelPessoa}</p>
            <p>{documento.tipoPessoa === 'fisica' ? 'Nome' : 'Razão Social'}: {documento.nomePessoa}</p>
            <p>{labelDoc}: {documento.documento}</p>
          </div>

          <div className="flex flex-col gap-2 px-5 py-4 text-sm flex-1">
            <p className="font-bold mb-1">Dados do cartório</p>
            <p>CEP: {documento.cep}</p>
            <p className="flex items-center gap-8">
              <span>Rua: {documento.rua}</span>
              <span>Nº: {documento.numero}</span>
            </p>
            <p className="flex items-center gap-8">
              <span>Cidade: {documento.cidade}</span>
              <span>UF: {documento.estado}</span>
            </p>
          </div>
        </div>

        <div
          className="mx-5 py-4 text-sm"
          style={{ borderTop: '1px solid #D5D5D5', color: '#2E2D2C' }}
        >
          <strong>Data de criação:</strong>{' '}
          {new Date(documento.createdAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      <ModalConfirmacao
        aberto={modalAberto}
        titulo="Remover documento"
        mensagem="Tem certeza que deseja excluir este documento?"
        onConfirmar={handleConfirmarRemocao}
        onCancelar={() => setModalAberto(false)}
      />
    </>
  )
}
