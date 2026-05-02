import Image from 'next/image'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <Image
        src="/Grupo 17554.svg"
        alt=""
        width={56}
        height={56}
        className="mb-3"
        aria-hidden
      />
      <p className="text-sm" style={{ color: '#828180' }}>Nenhum documento criado</p>
    </div>
  )
}
