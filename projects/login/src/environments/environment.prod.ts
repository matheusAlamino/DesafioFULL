let url: string = 'login.multiplx.com.br'
let protocolo: string = 'https://'

export const environment = {
    production: true,
    api: {
        local: `${protocolo}${url}/`,
        mpx: `${protocolo}api.multiplx.com.br/api/v1/`
    }
};
