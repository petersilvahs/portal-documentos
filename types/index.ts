export type TipoPessoa = 'fisica' | 'juridica'

export type StatusPedido = 'em_andamento' | 'finalizado'

export interface Pedido {
  id: string
  tipo: string
  titulo: string
  status: StatusPedido
  observacao: string
  criadoPor: string
  createdAt: string
}

export interface Documento {
  id: string
  nomeDocumento: string
  tipoPessoa: TipoPessoa
  nomePessoa: string
  documento: string
  cep: string
  rua: string
  numero: string
  cidade: string
  estado: string
  createdAt: string
}

export type DocumentoFormData = Omit<Documento, 'id' | 'createdAt'>

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
