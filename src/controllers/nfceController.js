const xmlBuilder = require('../services/xmlBuilder');
const signer = require('../services/signer');
const sefazService = require('../services/sefazService');
const sefazUrls = require('../utils/sefazUrls');
const ibge = require('../utils/ibge');
const qrCodeGenerator = require('../services/qrCodeGenerator');
const testPayload = require('../../test_payload.json');

exports.emitirNfce = async (req, res) => {
    try {
        const dadosVenda = req.body && req.body.ide ? req.body : testPayload;
        
        console.log('1. Gerando XML para UF:', dadosVenda.ide.cUF);
        const { xml, chave } = xmlBuilder.buildNfce(dadosVenda);
        
        console.log('2. Assinando XML...');
        // O ID da tag a ser assinada é "NFe" + chave de acesso
        const signedXml = signer.signXml(xml, `NFe${chave}`);
        
        console.log('2.1. Gerando QR Code e Suplemento...');
        // Dados fictícios de CSC para exemplo (devem vir de config/env)
        const cscId = '000001'; 
        const csc = '0123456789'; // Exemplo de CSC
        
        // Extrai DigestValue (mock se nulo para teste, pois o signer mock não gera assinatura real)
        let digestValue = qrCodeGenerator.extractDigestValue(signedXml);
        if (!digestValue) {
            digestValue = '0000000000000000000000000000000000000000'; // Mock Hex SHA1
        } else {
            digestValue = qrCodeGenerator.base64ToHex(digestValue);
        }

        const qrCodeData = qrCodeGenerator.generateQrCode(chave, dadosVenda.ide.tpAmb, cscId, csc, digestValue);
        
        console.log('3. Obtendo URL da SEFAZ...');
        // Descobre a sigla do estado (ex: "RS") a partir do código (ex: "43")
        const siglaUF = ibge.getSiglaUF(dadosVenda.ide.cUF);
        if (!siglaUF) throw new Error('Código de UF inválido: ' + dadosVenda.ide.cUF);

        // Pega a URL correta para o estado e ambiente (1=Prod, 2=Homolog)
        const urlSefaz = sefazUrls.getUrlSefaz(siglaUF, dadosVenda.ide.tpAmb);
        const urlQrCodeBase = sefazUrls.getUrlQrCode(siglaUF, dadosVenda.ide.tpAmb);
        const qrCodeFullUrl = `${urlQrCodeBase}?p=${qrCodeData.p}`;

        // Injeta QR Code no XML (Append antes de fechar NFe)
        // Nota: Em produção, usar XML Parser/Builder para evitar erros de estrutura.
        const xmlComQrCode = signedXml.replace('</NFe>', `<infNFeSupl><qrCode><![CDATA[${qrCodeFullUrl}]]></qrCode><urlChave>${urlQrCodeBase}</urlChave></infNFeSupl></NFe>`);

        console.log('3. Enviando para SEFAZ...', urlSefaz);
        const responseSefaz = await sefazService.enviarNfce(xmlComQrCode, urlSefaz);

        console.log('Resposta SEFAZ:', responseSefaz);

        res.status(200).json({
            message: 'Processo finalizado',
            chave: chave,
            qrCode: qrCodeFullUrl,
            xmlAssinado: xmlComQrCode,
            respostaSefaz: responseSefaz
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao emitir NFC-e: ' + error.message });
    }
};
