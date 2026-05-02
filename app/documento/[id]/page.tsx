'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Documento } from '@/types'
import { buscarDocumento } from '@/services/documentos'
import { useDocumentos } from '@/context/DocumentoContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import ModalConfirmacao from '@/components/ModalConfirmacao'
import Toast from '@/components/Toast'
import Link from 'next/link'
import Image from 'next/image'

export default function PaginaDetalhesDocumento() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { remover } = useDocumentos()

  const [documento, setDocumento] = useState<Documento | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro') {
    setToast({ mensagem, tipo })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarDocumento(id)
        setDocumento(data)
      } catch {
        setNaoEncontrado(true)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function handleRemover() {
    if (!documento) return
    try {
      await remover(documento.id)
      mostrarToast('Documento removido com sucesso.', 'sucesso')
      setTimeout(() => router.push('/'), 1200)
    } catch {
      mostrarToast('Erro ao remover o documento.', 'erro')
      setModalAberto(false)
    }
  }

  if (carregando) return <LoadingSpinner texto="Carregando documento..." />

  if (naoEncontrado || !documento) {
    return (
      <div className="mx-auto px-4 py-8 text-center" style={{ maxWidth: '1366px' }}>
        <p className="text-sm mb-4" style={{ color: '#828180' }}>Documento não encontrado.</p>
        <Link href="/" className="text-sm font-semibold" style={{ color: '#3570B2' }}>
          Voltar para listagem
        </Link>
      </div>
    )
  }

  const labelPessoa = documento.tipoPessoa === 'fisica' ? 'Pessoa física' : 'Pessoa jurídica'
  const labelDoc = documento.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'

  return (
    <>
      <div className="mx-auto px-4 sm:px-8 py-8" style={{ maxWidth: '1366px' }}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-5"
          style={{ color: '#3570B2' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para listagem
        </Link>

        <div
          className="bg-white rounded flex flex-col"
          style={{ border: '1px solid #D5D5D5' }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid #D5D5D5' }}
          >
            <h1
              style={{
                fontFamily: 'Open Sans, sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '32px',
                color: '#2E2D2C',
              }}
            >
              {documento.nomeDocumento}
            </h1>
            <button
              onClick={() => setModalAberto(true)}
              className="shrink-0 disabled:opacity-50"
              aria-label="Remover documento"
            >
              <Image src="/delete_black_24dp.svg" alt="Remover" width={24} height={24} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row flex-1" style={{ color: '#2E2D2C' }}>
            <div
              className="flex flex-col gap-2 px-5 py-4 text-sm border-b border-[#D5D5D5] sm:border-b-0 sm:border-r sm:border-r-[#D5D5D5] sm:flex-[0_0_50%]"
            >
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
      </div>

      <ModalConfirmacao
        aberto={modalAberto}
        titulo="Confirmar exclusão"
        mensagem={`Tem certeza que deseja remover "${documento.nomeDocumento}"? Esta ação não pode ser desfeita.`}
        onConfirmar={handleRemover}
        onCancelar={() => setModalAberto(false)}
      />

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </>
  )
}

