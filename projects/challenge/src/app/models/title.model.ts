export interface Title {
    id: number,
    number_title: number,
    name: string,
    cpf: string,
    percent_fees: string,
    percent_fine: string,
    qtd_plots: number,
    total_value: string,
    current_value: number,
    max_delayed_days: number
    value_corrected: string,
    plots?: Plot[]
}

export interface Plot {
    id: number,
    title_id: number,
    number: number,
    date_due: string,
    date?: Date,
    value: string,
    paid: boolean,
    delayed_days: number
}

