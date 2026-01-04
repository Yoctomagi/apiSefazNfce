const xmlBuilder = require('../services/xmlBuilder');
const signer = require('../services/signer');
const sefazService = require('../services/sefazService');
const sefazUrls = require('../utils/sefazUrls');
const ibge = require('../utils/ibge');
const testPayload = require('../../test_payload.json');

exports.emitirNfce = async (req, res) => {
    try {
       /*  const dadosVenda = req.body; */
        const dadosVenda = testPayload;
        
        console.log('1. Gerando XML...');
        const { xml, chave } = xmlBuilder.buildNfce(dadosVenda);
        
        console.log('2. Assinando XML...');
        // O ID da tag a ser assinada é "NFe" + chave de acesso
        const signedXml = signer.signXml(xml, `NFe${chave}`);
        
        console.log('3. Obtendo URL da SEFAZ...');
        // Descobre a sigla do estado (ex: "RS") a partir do código (ex: "43")
        const siglaUF = ibge.getSiglaUF(dadosVenda.ide.cUF);
        if (!siglaUF) throw new Error('Código de UF inválido: ' + dadosVenda.ide.cUF);

        // Pega a URL correta para o estado e ambiente (1=Prod, 2=Homolog)
        const urlSefaz = sefazUrls.getUrlSefaz(siglaUF, dadosVenda.ide.tpAmb);

        console.log('3. Enviando para SEFAZ...', urlSefaz);
        const responseSefaz = await sefazService.enviarNfce(signedXml, urlSefaz);

        console.log('Resposta SEFAZ:', responseSefaz);

        res.status(200).json({
            message: 'Processo finalizado',
            chave: chave,
            xmlAssinado: signedXml,
            respostaSefaz: responseSefaz
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao emitir NFC-e: ' + error.message });
    }
};
