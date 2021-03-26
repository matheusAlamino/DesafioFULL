import { FileProcess } from "./file-process.model";

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
    active:  number,
    status: Status[],
    assignors?: Client[],
    assignees?: Client[]
    assignee_id?: number[],
    responsable?: User,
    process_status?: PivotStatus,
    process_files?: FileProcess[]
}
export interface Client {
    id: number,
    name: string,
    cpf: string,
    status: boolean,
    process_client?: ProcessClient
}
export interface User {
    id: number,
    name: string,
    cpf: string,
    status: boolean
}
export interface Status {
    id: number,
    name: string,
    pivot?: PivotStatus
}
export interface PivotStatus {
    id: number,
    process_id: number,
    status_id: number,
    description: string,
    created_at: string,
    updated_at: string,
    status?: Status
}
export interface ProcessClient {
    process_id: number,
    client_id: number,
    percentual: number,
    value: number
}
