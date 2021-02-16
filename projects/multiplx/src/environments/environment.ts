let url: string = 'localhost:4200'
let protocolo: string = 'http://'

export const environment = {
    production: false,
    api: {
        local: `${protocolo}${url}/`,
        login: `${protocolo}${url}/login`,
        mpx: `${protocolo}api-multiplx.localhost/api/v1/`
    }
};
