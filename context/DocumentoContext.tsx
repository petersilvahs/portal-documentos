'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Documento, Pedido } from '@/types'
import {
  buscarPedido,
  listarDocumentos,
  criarDocumento,
  removerDocumento,
} from '@/services/documentos'

interface DocumentoContextData {
  pedido: Pedido | null
  documentos: Documento[]
  carregando: boolean
  criando: boolean
  erro: string | null
  buscarTodos: () => Promise<void>
  adicionar: (data: Omit<Documento, 'id' | 'createdAt'>) => Promise<void>
  remover: (id: string) => Promise<void>
}

const DocumentoContext = createContext<DocumentoContextData>(
  {} as DocumentoContextData
)

export function DocumentoProvider({ children }: { children: React.ReactNode }) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [criando, setCriando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const buscarTodos = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const [pedidoData, docsData] = await Promise.all([
        buscarPedido(),
        listarDocumentos(),
      ])
      setPedido(pedidoData)
      setDocumentos(docsData)
    } catch {
      setErro('Não foi possível carregar os dados.')
    } finally {
      setCarregando(false)
    }
  }, [])

  const adicionar = useCallback(
    async (data: Omit<Documento, 'id' | 'createdAt'>) => {
      setCriando(true)
      setErro(null)
      try {
        const novo = await criarDocumento(data)
        setDocumentos((prev) => [...prev, novo])
      } catch {
        setErro('Não foi possível cadastrar o documento.')
        throw new Error('Não foi possível cadastrar o documento.')
      } finally {
        setCriando(false)
      }
    },
    []
  )

  const remover = useCallback(async (id: string) => {
    setErro(null)
    try {
      await removerDocumento(id)
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id))
    } catch {
      setErro('Não foi possível remover o documento.')
      throw new Error('Não foi possível remover o documento.')
    }
  }, [])

  useEffect(() => {
    buscarTodos()
  }, [buscarTodos])

  return (
    <DocumentoContext.Provider
      value={{ pedido, documentos, carregando, criando, erro, buscarTodos, adicionar, remover }}
    >
      {children}
    </DocumentoContext.Provider>
  )
}

export function useDocumentos() {
  const context = useContext(DocumentoContext)
  if (!context) {
    throw new Error('useDocumentos deve ser usado dentro de DocumentoProvider')
  }
  return context
}

