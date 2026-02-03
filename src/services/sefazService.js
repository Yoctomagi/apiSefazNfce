const axios = require('axios');
const https = require('https');
const fs = require('fs');

class SefazService {
    async enviarNfce(signedXml, urlSefaz) {
        // Remove declaração XML se existir
        const xmlContent = signedXml.replace(/<\?xml.*?\?>/g, '').trim();
        
        // Envolve a NFe em um Lote (enviNFe) conforme Manual de Orientação - Padrão Síncrono (indSinc=1)
        // O idLote gera um número aleatório simples para teste
        const idLote = Math.floor(Math.random() * 100000);
        const batchXml = `
<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <idLote>${idLote}</idLote>
    <indSinc>1</indSinc>
    ${xmlContent}
</enviNFe>`.trim();

        // TENTATIVA SOAP 1.2 (Padrão Sefaz 4.0)
        // Corrigido Namespace para "NFeAutorizacao4" (Maiúsculas F e E) conforme WSDL SP
        const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">
      ${batchXml}
    </nfeDadosMsg>
  </soap12:Body>
</soap12:Envelope>`;

        // Configuração do Agente HTTPS com Certificado (Mutual TLS)
        let httpsAgent;
        try {
            const path = require('path');
            const pfxPath = path.resolve(process.env.CERTIFICATE_PATH || 'certs/certificado.pfx');
            
            if (fs.existsSync(pfxPath)) {
                const pfx = fs.readFileSync(pfxPath);
                httpsAgent = new https.Agent({
                    pfx: pfx,
                    passphrase: process.env.CERTIFICATE_PASSWORD,
                    rejectUnauthorized: false
                });
            } else {
                console.log('Certificado não encontrado, usando agente padrão.');
                httpsAgent = new https.Agent({ rejectUnauthorized: false });
            }
        } catch (e) {
            console.error('Erro ao carregar certificado:', e);
            httpsAgent = new https.Agent({ rejectUnauthorized: false });
        }

        try {
            console.log('Enviando para SEFAZ (SOAP 1.2):', urlSefaz);
            
            // Action Correcta: "http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4/nfeAutorizacaoLote"
            // Note o "NFe" Maiúsculo.
            const actionUri = 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4/nfeAutorizacaoLote';
            
            console.log('Action URI:', actionUri);

            const headers = {
                'Content-Type': `application/soap+xml; charset=utf-8; action="${actionUri}"`
            };

            const response = await axios.post(urlSefaz, soapEnvelope, {
                headers: headers,
                httpsAgent: httpsAgent
            });
            
            return response.data;
            
        } catch (error) {
            console.error('Erro na comunicação com SEFAZ:', error);
             if (error.response) {
                 console.error('Dados do erro:', error.response.data);
                 console.error('Status:', error.response.status);
            }
            throw error;
        }
    }
}

module.exports = new SefazService();
