let url: string = 'localhost:4200'
let protocolo: string = 'http://'

export const environment = {
    production: false,
    api: {
        local: `${protocolo}${url}/`,
        client: `${protocolo}localhost:4202/`,
        login: `${protocolo}localhost:4001`,
        mpx: `${protocolo}api-multiplx.localhost/api/v1/`
    }
};
