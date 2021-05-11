import { FileProcess } from "./file-process.model";

export interface Process {
    id: number,
    user_id: number,
    responsable_id: number,
    type_id: number,
    ente_devedor_id: number,
    process_number: string,
    vara: string,
    precatory_number: string,
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
    value_rough_precatory: number,
    main_value: number,
    value_fees: number,
    value_arrears: number,
    value_assignment: number,
    active:  number,
    status: Status[],
    assignors?: Client[],
    assignees?: Client[]
    assignee_id?: number[],
    responsable?: User,
    process_status?: PivotStatus,
    process_files?: FileProcess[],
    type?: Type,
    ente_devedor?: EnteDevedor
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
    value: number,
    valueString?: string
}

export interface Type {
    id: number,
    title: string
}

export interface EnteDevedor {
    id: number,
    name: string
}
