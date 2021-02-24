let url: string = 'multiplx.com.br'
let protocolo: string = 'https://'

export const environment = {
    production: true,
    api: {
        local: `${protocolo}sistema.${url}/`,
        login: `${protocolo}login.${url}/`,
        mpx: `${protocolo}api.${url}/api/v1/`
    }
};
