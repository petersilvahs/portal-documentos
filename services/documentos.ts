import { Documento, Pedido } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function buscarPedido(): Promise<Pedido> {
  const res = await fetch(`${BASE_URL}/pedido`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Falha ao buscar pedido')
  return res.json()
}

export async function listarDocumentos(): Promise<Documento[]> {
  const res = await fetch(`${BASE_URL}/documentos`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Falha ao buscar documentos')
  return res.json()
}

export async function buscarDocumento(id: string): Promise<Documento> {
  const res = await fetch(`${BASE_URL}/documentos/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Documento não encontrado')
  return res.json()
}

export async function criarDocumento(
  data: Omit<Documento, 'id' | 'createdAt'>
): Promise<Documento> {
  const payload: Omit<Documento, 'id'> = {
    ...data,
    createdAt: new Date().toISOString(),
  }
  const res = await fetch(`${BASE_URL}/documentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Falha ao criar documento')
  return res.json()
}

export async function removerDocumento(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/documentos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Falha ao remover documento')
}

