import { ViaCepResponse } from '@/types'

export async function consultarCep(cep: string): Promise<ViaCepResponse> {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido')
  }
  const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
  if (!res.ok) throw new Error('Erro ao consultar CEP')
  const data: ViaCepResponse = await res.json()
  if (data.erro) throw new Error('CEP não encontrado')
  return data
}
