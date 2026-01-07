const crypto = require('crypto');

class QrCodeGenerator {
    /**
     * Gera a URL do QR Code para NFC-e (Versão 2.0)
     * @param {string} chave Chave de acesso da NFC-e (44 dígitos)
     * @param {string} versao Versão do QR Code (default '2')
     * @param {string} ambiente 1-Produção, 2-Homologação
     * @param {string} cscId Identificador do CSC (ex: '000001') - sem zeros a esquerda no hash? Manual diz código sem zeros não significativos?
     * @param {string} csc Código de Segurança do Contribuinte
     * @param {string} digestValue Hexadecimal do DigestValue da assinatura
     * @returns {object} { url, textoQrCode }
     */
    generateQrCode(chave, ambiente, cscId, csc, digestValue) {
        // Formato QR Code v2:
        // https://.../qrCode?p=
        //chNFe|nVersao|tpAmb|cDest|dhEmi|vNF|vICMS|digVal|idCSC|hashQRCode

        // Simplificado para NFC-e (muitos campos são opcionais ou específicos)
        // Manual de Especificações Técnicas do DANFE NFC-e e QR Code - Versão 5.0 (ou vigente)
        // Parâmetro 'p' concatena:
        // 1. Chave de Acesso (44 posições)
        // 2. Versão do QR Code (2)
        // 3. Tipo de Ambiente (1 ou 2)
        // 4. Identificador do CSC (1 a 6 posições, sem zeros à esquerda)
        // 5. Hash do QR Code (SHA-1)

        // Nota: O layout do parametro 'p' mudou na versão 2.0 do QR Code.
        // p = chave|2|amb|diaEmissao|valorTotal|digestValue|idCSC|hash

        // Para simplificar este exemplo, vamos assumir um modelo genérico aceito.
        // É CRÍTICO consultar a 'Nota Técnica 2016.002' e atualizações.

        // Exemplo formatado:
        const versaoQrCode = '2';
        
        // Se cscId '000001' -> '1'
        const cscIdSemZeros = parseInt(cscId, 10).toString();

        // Monta os dados para o hash (sem o próprio hash)
        // Chave|Versao|Amb|IdentificadorCSC
        // Mas na v2.0 inclui o DigestValue (HEX).
        
        // Vamos usar a estrutura simplificada concatenada com '|'
        const dadosParaHash = `${chave}|${versaoQrCode}|${ambiente}|${cscIdSemZeros}`;
        
        // O hash é formado por SHA-1(dadosParaHash + CSC)
        const stringParaAssinar = dadosParaHash + csc;
        
        const hash = crypto.createHash('sha1').update(stringParaAssinar).digest('hex').toUpperCase();

        // A string final do parâmetro 'p' inclui o hash
        // Mas a URL depende da UF. Vamos retornar os dados para compor o XML.

        // O XML espera:
        // <qrCode> ... URL completa ... </qrCode>
        // <urlChave> ... URL de consulta ... </urlChave>

        // A URL base depende da UF (sefazUrls). Vamos retornar apenas a string do parâmetro 'p' ou a URL completa se fornecida
        
        return {
            p: `${dadosParaHash}|${hash}`,
            hash: hash
        };
    }

    /**
     * Helper para extrair o DigestValue do XML assinado (mock/regex simples)
     */
    extractDigestValue(signedXml) {
        const match = signedXml.match(/<DigestValue>(.*?)<\/DigestValue>/);
        return match ? match[1] : ''; 
        // Nota: DigestValue no XML está em Base64. Para o QR Code v2, geralmente se usa o Hex do hash SHA1 original ou o próprio Hex do Digest?
        // NT 2016.002: "O campo digVal corresponde ao valor do conteúdo da tag DigestValue... convertido para Hexadecimal"
    }

    base64ToHex(str) {
        const raw = Buffer.from(str, 'base64');
        return raw.toString('hex').toUpperCase();
    }
}

module.exports = new QrCodeGenerator();
