'use client'

import { useEffect, useRef } from 'react'

interface ModalConfirmacaoProps {
  aberto: boolean
  titulo: string
  mensagem: string
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  const cancelarRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (aberto) cancelarRef.current?.focus()
  }, [aberto])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancelar()
    }
    if (aberto) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [aberto, onCancelar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div
        className="bg-white flex flex-col w-full mx-4"
        style={{
          maxWidth: '600px',
          height: '198px',
          boxShadow: '0px 4px 8px #2E2D2C66',
          borderRadius: '4px',
        }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2
            id="modal-titulo"
            style={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '32px',
              color: '#2E2D2C',
            }}
          >
            Confirmar exclusão
          </h2>
          <button
            onClick={onCancelar}
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#2E2D2C"/>
            </svg>
          </button>
        </div>

        <p
          className="px-6"
          style={{
            fontSize: '14px',
            lineHeight: '20px',
            color: '#2E2D2C',
          }}
        >
          {mensagem}
        </p>

        <div
          className="mt-auto flex items-center justify-end gap-3 px-6"
          style={{
            height: '64px',
            backgroundColor: '#F3F3F3',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <button
            ref={cancelarRef}
            onClick={onCancelar}
            style={{
              height: '32px',
              padding: '0 20px',
              borderRadius: '16px',
              border: '1px solid #3570B2',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 600,
              color: '#3570B2',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            style={{
              height: '32px',
              padding: '0 20px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: '#E65562',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
