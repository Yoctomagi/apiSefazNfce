const urls = {
    // SVRS - Sefaz Virtual do RS (Usada por AC, AL, AP, CE, DF, ES, PA, PB, PI, RJ, RN, RO, RR, SC, SE, TO)
    SVRS: {
        homologacao: 'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
        producao: 'https://nfce.svrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx'
    },
    // AM - Amazonas
    AM: {
        homologacao: 'https://homnfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
        producao: 'https://nfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4'
    },
    // BA - Bahia
    BA: {
        homologacao: 'https://hnfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx',
        producao: 'https://nfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx'
    },
    // GO - Goiás
    GO: {
        homologacao: 'https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4?wsdl',
        producao: 'https://nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4?wsdl'
    },
    // MG - Minas Gerais
    MG: {
        homologacao: 'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
        producao: 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4'
    },
    // MS - Mato Grosso do Sul
    MS: {
        homologacao: 'https://hom.nfe.sefaz.ms.gov.br/ws/NFeAutorizacao4',
        producao: 'https://nfe.sefaz.ms.gov.br/ws/NFeAutorizacao4'
    },
    // MT - Mato Grosso
    MT: {
        homologacao: 'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4?wsdl',
        producao: 'https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4?wsdl'
    },
    // PE - Pernambuco
    PE: {
        homologacao: 'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4',
        producao: 'https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4'
    },
    // PR - Paraná
    PR: {
        homologacao: 'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl',
        producao: 'https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl'
    },
    // RS - Rio Grande do Sul (Própria)
    RS: {
        homologacao: 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
        producao: 'https://nfce.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx'
    },
    // SP - São Paulo
    SP: {
        homologacao: 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
        producao: 'https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx'
    }
};

// Mapeamento de Estado -> Autorizador
const autorizadores = {
    'AC': 'SVRS', 'AL': 'SVRS', 'AP': 'SVRS', 'CE': 'SVRS', 'DF': 'SVRS',
    'ES': 'SVRS', 'PA': 'SVRS', 'PB': 'SVRS', 'PI': 'SVRS', 'RJ': 'SVRS',
    'RN': 'SVRS', 'RO': 'SVRS', 'RR': 'SVRS', 'SC': 'SVRS', 'SE': 'SVRS',
    'TO': 'SVRS', 'MA': 'SVRS', // MA usa SVRS para NFC-e em muitos casos, ou SVAN (verificar especificidade)
    
    'AM': 'AM', 'BA': 'BA', 'GO': 'GO', 'MG': 'MG', 'MS': 'MS',
    'MT': 'MT', 'PE': 'PE', 'PR': 'PR', 'RS': 'RS', 'SP': 'SP'
};

exports.getUrlSefaz = (uf, ambiente) => {
    // ambiente: 1 = Produção, 2 = Homologação
    const siglaUF = uf.toUpperCase();
    const autorizador = autorizadores[siglaUF];
    
    if (!autorizador) {
        throw new Error(`UF ${siglaUF} não suportada ou inválida.`);
    }

    const tipoAmbiente = ambiente == '1' ? 'producao' : 'homologacao';
    
    return urls[autorizador][tipoAmbiente];
};

const urlQrCode = {
    RS: {
        homologacao: 'https://nfce-homologacao.sefazrs.rs.gov.br/qrCode',
        producao: 'https://nfce.sefazrs.rs.gov.br/qrCode'
    },
    // SP - São Paulo
    SP: {
        homologacao: 'https://homologacao.nfce.fazenda.sp.gov.br/qrcode',
        producao: 'https://www.nfce.fazenda.sp.gov.br/qrcode'
    },
    // Default para SVRS (exemplo genérico)
    SVRS: {
        homologacao: 'https://nfce-homologacao.svrs.rs.gov.br/qrCode',
        producao: 'https://nfce.svrs.rs.gov.br/qrCode'
    }
};

exports.getUrlQrCode = (uf, ambiente) => {
    const tipoAmbiente = ambiente == '1' ? 'producao' : 'homologacao';
    const siglaUF = uf.toUpperCase();
    
    // Simplificado
    if (urlQrCode[siglaUF]) return urlQrCode[siglaUF][tipoAmbiente];
    return urlQrCode.SVRS[tipoAmbiente];
};
