'use client'

import Image from 'next/image'

interface ToastProps {
  mensagem: string
  tipo: 'sucesso' | 'erro'
  onClose?: () => void
}

export default function Toast({ mensagem, tipo, onClose }: ToastProps) {
  const bgColor = tipo === 'sucesso' ? '#008768' : '#E65562'

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 shadow-lg"
      style={{
        backgroundColor: bgColor,
        borderRadius: '4px',
        height: '48px',
        width: '418px',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <Image
        src={tipo === 'sucesso' ? '/outline-check_circle-24px.svg' : '/close-24px.svg'}
        alt=""
        width={24}
        height={24}
        aria-hidden
      />
      <span className="flex-1 text-white text-sm font-semibold">{mensagem}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100" aria-label="Fechar">
          <Image src="/close-24px.svg" alt="" width={24} height={24} aria-hidden />
        </button>
      )}
    </div>
  )
}

