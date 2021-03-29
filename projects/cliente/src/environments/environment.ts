let url: string = 'localhost:4202'
let protocolo: string = 'http://'

export const environment = {
    production: false,
    api: {
        local: `${protocolo}${url}/`,
        login: `${protocolo}localhost:4201`,
        mpx: `${protocolo}api-multiplx.localhost/api/v1/`
    }
};
