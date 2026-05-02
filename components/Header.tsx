'use client'

import Image from 'next/image'

export default function Header() {
  return (
    <header className="relative h-14 overflow-hidden">
      <Image
        src="/Grupo 13.svg"
        alt="Docket"
        fill
        style={{ objectFit: 'cover', objectPosition: 'left center' }}
        priority
      />
    </header>
  )
}

