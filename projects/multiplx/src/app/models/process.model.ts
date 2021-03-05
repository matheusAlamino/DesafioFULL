export interface Process {
    id: number,
    client_id: number,
    user_id: number,
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
    status: number
}
