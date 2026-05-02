'use client'

interface PaginacaoProps {
  paginaAtual: number
  totalPaginas: number
  onChange: (pagina: number) => void
}

export default function Paginacao({ paginaAtual, totalPaginas, onChange }: PaginacaoProps) {
  if (totalPaginas <= 1) return null

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onChange(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {paginas.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === paginaAtual ? 'page' : undefined}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === paginaAtual
              ? 'text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={p === paginaAtual ? { backgroundColor: '#3570B2' } : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}
