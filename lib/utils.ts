export function mascararCPF(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11)
  return nums
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function mascararCNPJ(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 14)
  return nums
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function mascararCEP(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 8)
  return nums.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

export function validarCPF(cpf: string): boolean {
  const nums = cpf.replace(/\D/g, '')
  if (nums.length !== 11 || /^(\d)\1{10}$/.test(nums)) return false
  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(nums[9])) return false
  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(nums[10])
}

export function validarCNPJ(cnpj: string): boolean {
  const nums = cnpj.replace(/\D/g, '')
  if (nums.length !== 14 || /^(\d)\1{13}$/.test(nums)) return false
  const calc = (n: string, tam: number) => {
    let soma = 0
    let pos = tam - 7
    for (let i = tam; i >= 1; i--) {
      soma += parseInt(n[tam - i]) * pos--
      if (pos < 2) pos = 9
    }
    const res = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    return res === parseInt(n[tam])
  }
  return calc(nums, 12) && calc(nums, 13)
}

export function validarCEP(cep: string): boolean {
  return /^\d{5}-?\d{3}$/.test(cep)
}

export function formatarData(isoString: string): string {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
