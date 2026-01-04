const axios = require('axios');
const https = require('https');
const fs = require('fs');

class SefazService {
    async enviarNfce(signedXml, urlSefaz) {
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeAutorizacao4">
      ${signedXml}
    </nfeDadosMsg>
  </soap12:Body>
</soap12:Envelope>`;

        // Configuração do Agente HTTPS com Certificado (Mutual TLS)
        // Necessário para comunicação com a SEFAZ
        let httpsAgent;
        try {
            // const pfx = fs.readFileSync(process.env.CERTIFICATE_PATH);
            // httpsAgent = new https.Agent({
            //     pfx: pfx,
            //     passphrase: process.env.CERTIFICATE_PASSWORD,
            //     rejectUnauthorized: false // Em produção deve ser true
            // });
            
            // Mock agent
            httpsAgent = new https.Agent({ rejectUnauthorized: false });
        } catch (e) {
            console.log('Certificado não encontrado, usando agente padrão.');
            httpsAgent = new https.Agent({ rejectUnauthorized: false });
        }

        try {
            console.log('Enviando para SEFAZ:', urlSefaz);
            // Em um cenário real, descomentar a linha abaixo
            // const response = await axios.post(urlSefaz, soapEnvelope, {
            //     headers: {
            //         'Content-Type': 'application/soap+xml; charset=utf-8'
            //     },
            //     httpsAgent: httpsAgent
            // });
            
            // return response.data;

            // Mock de resposta da SEFAZ
            return {
                status: 200,
                data: `<?xml version="1.0" encoding="utf-8"?><soap:Envelope><soap:Body><nfeResultMsg><retEnviNFe><cStat>100</cStat><xMotivo>Autorizado o uso da NF-e</xMotivo></retEnviNFe></nfeResultMsg></soap:Body></soap:Envelope>`
            };

        } catch (error) {
            console.error('Erro na comunicação com SEFAZ:', error);
            throw error;
        }
    }
}

module.exports = new SefazService();
