let url: string = 'localhost:4200'
let protocolo: string = 'http://'

export const environment = {
    production: false,
    api: {
        local: `${protocolo}${url}/`,
        login: `${protocolo}localhost:4201`,
        mpx: `${protocolo}api-multiplx.localhost/api/v1/`
        // mpx: `${protocolo}localhost:8000/api/v1/`
    }
};
