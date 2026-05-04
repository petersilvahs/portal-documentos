'use client'

import { useState } from 'react'
import { useDocumentos } from '@/context/DocumentoContext'
import FormularioDocumento from '@/components/FormularioDocumento'
import CardDocumento from '@/components/CardDocumento'
import EmptyState from '@/components/EmptyState'
import LoadingSpinner from '@/components/LoadingSpinner'
import Paginacao from '@/components/Paginacao'
import Toast from '@/components/Toast'

const ITENS_POR_PAGINA = 10

function BadgeStatus({ temDocumentos }: { temDocumentos: boolean }) {
  const dotColor = temDocumentos ? '#FFAF3E' : '#008768'
  return (
    <span
      className="inline-flex items-center gap-1.5 shrink-0"
      style={{
        backgroundColor: '#EBF0F5',
        borderRadius: '2px',
        height: '24px',
        padding: '0 8px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#2E2D2C',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        className="inline-block rounded-full shrink-0"
        style={{ width: '8px', height: '8px', backgroundColor: dotColor }}
      />
      {temDocumentos ? 'Em andamento' : 'Finalizado'}
    </span>
  )
}

export default function PaginaPrincipal() {
  const { pedido, documentos, carregando, erro, remover } = useDocumentos()
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' } | null>(null)

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro') {
    setToast({ mensagem, tipo })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleRemover(id: string) {
    try {
      await remover(id)
      mostrarToast('Documento removido com sucesso.', 'sucesso')
      const novoTotal = documentos.length - 1
      const novoTotalPaginas = Math.ceil(novoTotal / ITENS_POR_PAGINA) || 1
      if (paginaAtual > novoTotalPaginas) setPaginaAtual(novoTotalPaginas)
    } catch {
      mostrarToast('Erro ao remover o documento.', 'erro')
    }
  }

  function handleSucesso() {
    mostrarToast('Documento criado com sucesso', 'sucesso')
    setPaginaAtual(1)
  }

  const totalPaginas = Math.ceil(documentos.length / ITENS_POR_PAGINA)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const documentosPagina = documentos.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="mx-auto px-4 sm:px-8 py-8" style={{ maxWidth: '1366px' }}>
      <h1 className="text-2xl font-bold mb-5" style={{ color: '#2E2D2C' }}>
        Pedido #1
      </h1>

      {erro && (
        <div
          className="rounded mb-5 px-5 py-3 text-sm font-medium"
          style={{ backgroundColor: '#FDECEA', color: '#E65562', border: '1px solid #E65562' }}
        >
          {erro}
        </div>
      )}

      {pedido && (
        <div
          className="bg-white rounded mb-5 p-5 w-full"
          style={{ border: '1px solid #D5D5D5' }}
        >
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-base font-bold" style={{ color: '#2E2D2C' }}>
              {pedido.tipo}: {pedido.titulo}
            </h2>
            <BadgeStatus temDocumentos={documentos.length > 0} />
          </div>
          <p className="text-sm leading-5 mb-3" style={{ color: '#2E2D2C' }}>
            <strong>Observação:</strong> {pedido.observacao}
          </p>
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: '#2E2D2C' }}>
            <span>
              <strong>Criado por:</strong> {pedido.criadoPor}
            </span>
            <span>
              <strong>Data de criação:</strong>{' '}
              {new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
        <div
          className="w-full lg:w-[530px] lg:shrink-0 bg-white rounded p-5"
          style={{ border: '1px solid #D5D5D5' }}
        >
          <h3
            className="mb-4"
            style={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '32px',
              color: '#2E2D2C',
            }}
          >
            Adicionar documentos ao pedido
          </h3>
          <FormularioDocumento onSucesso={handleSucesso} />
        </div>

        <div className="w-full lg:flex-1">
          {carregando ? (
            <LoadingSpinner texto="Carregando..." />
          ) : documentos.length === 0 ? (
            <div
              className="bg-white rounded flex items-center justify-center w-full"
              style={{ minHeight: '349px', border: '1px solid #D5D5D5' }}
            >
              <EmptyState />
            </div>
          ) : (
            <>
              <p
                className="mb-4"
                style={{
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '32px',
                  color: '#2E2D2C',
                }}
              >
                {documentos.length} {documentos.length === 1 ? 'documento solicitado' : 'documentos solicitados'}
              </p>
              <div className="flex flex-col gap-4">
                {documentosPagina.map((doc) => (
                  <div key={doc.id} className="w-full" style={{ minHeight: '248px' }}>
                    <CardDocumento documento={doc} onRemover={handleRemover} />
                  </div>
                ))}
              </div>
              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                onChange={setPaginaAtual}
              />
            </>
          )}
        </div>
      </div>

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  )
}


