export enum StatusProcessEnum {
    analysis = 1,
    executing = 2,
    done = 3,
    reopened = 4,
}

export enum StatusNameEnum {
    analysis = 'Em análise',
    executing = 'Em andamento',
    done = 'Encerrado',
    reopened = 'Reaberto',
}

export enum StatusClassEnum {
    analysis = 'warning',
    executing = 'primary',
    done = 'success',
    reopened = 'dark',
}
