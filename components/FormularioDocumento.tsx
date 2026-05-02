'use client'

import { useEffect, useState } from 'react'
import { useDocumentos } from '@/context/DocumentoContext'
import { consultarCep } from '@/services/viacep'
import {
  mascararCPF,
  mascararCNPJ,
  mascararCEP,
  validarCPF,
  validarCNPJ,
  validarCEP,
} from '@/lib/utils'
import { TipoPessoa } from '@/types'

interface FormularioDocumentoProps {
  onSucesso?: () => void
}

interface Erros {
  nomeDocumento?: string
  nomePessoa?: string
  documento?: string
  cep?: string
  rua?: string
  numero?: string
  cidade?: string
  estado?: string
}

const inputBase =
  'w-full px-3 py-2 rounded text-sm outline-none transition-colors placeholder-[#ABABAB]'

const inputStyle = (erro?: string) =>
  `${inputBase} ${
    erro
      ? 'border border-[#E65562] bg-red-50 focus:border-[#E65562]'
      : 'border border-[#D5D5D5] bg-white focus:border-[#3570B2]'
  }`

function CampoLabel({
  htmlFor,
  label,
  obrigatorio = true,
}: {
  htmlFor: string
  label: string
  obrigatorio?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm mb-1 font-normal"
      style={{ color: '#2E2D2C' }}
    >
      {label}
      {obrigatorio && (
        <span className="ml-0.5" style={{ color: '#E65562' }}>
          {' '}*
        </span>
      )}
    </label>
  )
}

function MensagemErro({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null
  return (
    <p className="mt-1 text-xs" style={{ color: '#E65562' }}>
      {mensagem}
    </p>
  )
}

function estadoInicial() {
  return {
    nomeDocumento: '',
    nomePessoa: '',
    documento: '',
    cep: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
  }
}

export default function FormularioDocumento({ onSucesso }: FormularioDocumentoProps) {
  const { adicionar, criando } = useDocumentos()

  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('fisica')
  const [campos, setCampos] = useState(estadoInicial())
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erroCep, setErroCep] = useState('')
  const [erros, setErros] = useState<Erros>({})

  function setCampo(key: keyof ReturnType<typeof estadoInicial>, valor: string) {
    setCampos((prev) => ({ ...prev, [key]: valor }))
  }

  function handleDocumentoChange(valor: string) {
    const mascarado =
      tipoPessoa === 'fisica' ? mascararCPF(valor) : mascararCNPJ(valor)
    setCampo('documento', mascarado)
  }

  function handleCepChange(valor: string) {
    const mascarado = mascararCEP(valor)
    setCampo('cep', mascarado)
    setErroCep('')
  }

  useEffect(() => {
    setCampo('documento', '')
  }, [tipoPessoa])

  useEffect(() => {
    const cepLimpo = campos.cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    const timeout = setTimeout(async () => {
      setBuscandoCep(true)
      setErroCep('')
      try {
        const dados = await consultarCep(cepLimpo)
        setCampos((prev) => ({
          ...prev,
          rua: dados.logradouro,
          cidade: dados.localidade,
          estado: dados.uf,
        }))
      } catch {
        setErroCep('CEP não encontrado.')
        setCampos((prev) => ({ ...prev, rua: '', cidade: '', estado: '' }))
      } finally {
        setBuscandoCep(false)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [campos.cep])

  function validar(): boolean {
    const novosErros: Erros = {}

    if (!campos.nomeDocumento.trim())
      novosErros.nomeDocumento = 'Campo obrigatório'
    if (!campos.nomePessoa.trim())
      novosErros.nomePessoa = 'Campo obrigatório'
    if (!campos.documento.trim()) {
      novosErros.documento = 'Campo obrigatório'
    } else if (tipoPessoa === 'fisica' && !validarCPF(campos.documento)) {
      novosErros.documento = 'CPF inválido'
    } else if (tipoPessoa === 'juridica' && !validarCNPJ(campos.documento)) {
      novosErros.documento = 'CNPJ inválido'
    }
    if (!campos.cep.trim()) {
      novosErros.cep = 'Campo obrigatório'
    } else if (!validarCEP(campos.cep)) {
      novosErros.cep = 'CEP inválido'
    }
    if (!campos.rua.trim()) novosErros.rua = 'Campo obrigatório'
    if (!campos.numero.trim()) novosErros.numero = 'Campo obrigatório'
    if (!campos.cidade.trim()) novosErros.cidade = 'Campo obrigatório'
    if (!campos.estado.trim()) novosErros.estado = 'Campo obrigatório'

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    try {
      await adicionar({
        nomeDocumento: campos.nomeDocumento.trim(),
        tipoPessoa,
        nomePessoa: campos.nomePessoa.trim(),
        documento: campos.documento,
        cep: campos.cep,
        rua: campos.rua,
        numero: campos.numero.trim(),
        cidade: campos.cidade,
        estado: campos.estado,
      })
      setCampos(estadoInicial())
      setErros({})
      setTipoPessoa('fisica')
      onSucesso?.()
    } catch {
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div>
        <CampoLabel htmlFor="nomeDocumento" label="Nome do documento:" />
        <input
          id="nomeDocumento"
          type="text"
          value={campos.nomeDocumento}
          onChange={(e) => setCampo('nomeDocumento', e.target.value)}
          placeholder="Digite aqui"
          className={inputStyle(erros.nomeDocumento)}
        />
        <MensagemErro mensagem={erros.nomeDocumento} />
      </div>

      <div>
        <CampoLabel htmlFor="tipoPessoa" label="Tipo de pessoa:" />
        <div className="relative">
          <select
            id="tipoPessoa"
            value={tipoPessoa}
            onChange={(e) => setTipoPessoa(e.target.value as TipoPessoa)}
            className="w-full px-3 py-2 rounded text-sm outline-none appearance-none cursor-pointer border border-[#D5D5D5] focus:border-[#3570B2]"
            style={{
              backgroundColor: '#fff',
              color: '#2E2D2C',
            }}
          >
            <option value="fisica" style={{ backgroundColor: '#fff', color: '#2E2D2C' }}>
              Pessoa física
            </option>
            <option value="juridica" style={{ backgroundColor: '#fff', color: '#2E2D2C' }}>
              Pessoa jurídica
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#2E2D2C"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <CampoLabel
          htmlFor="documento"
          label={tipoPessoa === 'fisica' ? 'CPF:' : 'CNPJ:'}
        />
        <input
          id="documento"
          type="text"
          value={campos.documento}
          onChange={(e) => handleDocumentoChange(e.target.value)}
          placeholder="Digite aqui"
          className={inputStyle(erros.documento)}
        />
        <MensagemErro mensagem={erros.documento} />
      </div>

      <div>
        <CampoLabel
          htmlFor="nomePessoa"
          label={tipoPessoa === 'fisica' ? 'Nome Completo:' : 'Razão social:'}
        />
        <input
          id="nomePessoa"
          type="text"
          value={campos.nomePessoa}
          onChange={(e) => setCampo('nomePessoa', e.target.value)}
          placeholder="Digite aqui"
          className={inputStyle(erros.nomePessoa)}
        />
        <MensagemErro mensagem={erros.nomePessoa} />
      </div>

      <p className="text-sm font-bold mt-1" style={{ color: '#2E2D2C' }}>
        Dados do cartório
      </p>

      <div>
        <CampoLabel htmlFor="cep" label="CEP:" />
        <div className="relative w-32">
          <input
            id="cep"
            type="text"
            value={campos.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="Digite aqui"
            maxLength={9}
            className={inputStyle(erros.cep || erroCep ? 'erro' : undefined)}
          />
          {buscandoCep && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-3.5 h-3.5 border-2 border-[#D5D5D5] border-t-[#3570B2] rounded-full animate-spin" />
            </div>
          )}
        </div>
        <MensagemErro mensagem={erros.cep || erroCep} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <CampoLabel htmlFor="rua" label="Rua:" />
          <input
            id="rua"
            type="text"
            value={campos.rua}
            onChange={(e) => setCampo('rua', e.target.value)}
            placeholder="Digite aqui"
            className={inputStyle(erros.rua)}
          />
          <MensagemErro mensagem={erros.rua} />
        </div>
        <div>
          <CampoLabel htmlFor="numero" label="Número:" />
          <input
            id="numero"
            type="text"
            value={campos.numero}
            onChange={(e) => setCampo('numero', e.target.value)}
            placeholder="Digite aqui"
            className={inputStyle(erros.numero)}
          />
          <MensagemErro mensagem={erros.numero} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <CampoLabel htmlFor="cidade" label="Cidade:" />
          <input
            id="cidade"
            type="text"
            value={campos.cidade}
            onChange={(e) => setCampo('cidade', e.target.value)}
            placeholder="Digite aqui"
            className={inputStyle(erros.cidade)}
          />
          <MensagemErro mensagem={erros.cidade} />
        </div>
        <div>
          <CampoLabel htmlFor="estado" label="UF:" />
          <input
            id="estado"
            type="text"
            value={campos.estado}
            onChange={(e) => setCampo('estado', e.target.value)}
            placeholder="Digite aqui"
            maxLength={2}
            className={inputStyle(erros.estado)}
          />
          <MensagemErro mensagem={erros.estado} />
        </div>
      </div>

      <div className="mt-2">
        <button
          type="submit"
          disabled={criando}
          className="flex items-center justify-center gap-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#3570B2',
            borderRadius: '16px',
            width: '146px',
            height: '32px',
          }}
        >
          {criando && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {criando ? 'Criando...' : 'Criar documento'}
        </button>
      </div>
    </form>
  )
}

