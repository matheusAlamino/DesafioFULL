export interface Process {
    id: number,
    user_id: number,
    responsable_id: number,
    year: number,
    month: number,
    date: string,
    payment_year: string,
    value_rough: number,
    value_author: number,
    outgoing_operationals: number,
    outgoing_judicials: number,
    total_value: number,
    date_receive: string,
    percentual_gain: number,
    status: number,
    assignors?: Client[],
    assignor_id?: number[],
    assignees?: Client[]
    assignee_id?: number[],
    responsable?: User
}
export interface Client {
    id: number,
    name: string,
    cpf: string,
    status: boolean
}
export interface User {
    id: number,
    name: string,
    cpf: string,
    status: boolean
}
