export interface Client {
    id: number,
    name: string,
    cpf: string,
    rg: string,
    birth_date: string,
    phone: string,
    email: string,
    last_access: string,
    status: number,
    certificado_digital: number,
    address: ClientAddress
}

export interface ClientAddress {
    cep: string,
    numero: string,
    complemento: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    uf: string,
}
