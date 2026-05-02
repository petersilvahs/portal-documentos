export default function LoadingSpinner({ texto = 'Carregando...' }: { texto?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3" aria-busy="true">
      <div
        className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-label={texto}
      />
      <span className="text-sm text-gray-500">{texto}</span>
    </div>
  )
}
