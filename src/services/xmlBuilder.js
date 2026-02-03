
class XmlBuilder {
    constructor() {
        this.xml = '';
    }

    buildNfce(data) {
        // Geração do ID da Nota (Chave de Acesso)
        // Composição: cUF(2) + AAMM(4) + CNPJ(14) + mod(2) + serie(3) + nNF(9) + tpEmis(1) + cNF(8) + cDV(1)
        const chave = this.gerarChaveAcesso(data);
        
        this.xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
    <infNFe Id="NFe${chave}" version="4.00">
        <ide>
            <cUF>${data.ide.cUF}</cUF>
            <cNF>${data.ide.cNF}</cNF>
            <natOp>${data.ide.natOp}</natOp>
            <mod>65</mod>
            <serie>${data.ide.serie}</serie>
            <nNF>${data.ide.nNF}</nNF>
            <dhEmi>${data.ide.dhEmi}</dhEmi>
            <tpNF>1</tpNF>
            <idDest>1</idDest>
            <cMunFG>${data.ide.cMunFG}</cMunFG>
            <tpImp>4</tpImp>
            <tpEmis>${data.ide.tpEmis}</tpEmis>
            <cDV>${data.ide.cDV}</cDV>
            <tpAmb>${data.ide.tpAmb}</tpAmb>
            <finNFe>1</finNFe>
            <indFinal>1</indFinal>
            <indPres>1</indPres>
            <procEmi>0</procEmi>
            <verProc>1.0</verProc>
        </ide>
        <emit>
            <CNPJ>${data.emit.CNPJ}</CNPJ>
            <xNome>${data.emit.xNome}</xNome>
            <enderEmit>
                <xLgr>${data.emit.enderEmit.xLgr}</xLgr>
                <nro>${data.emit.enderEmit.nro}</nro>
                <xBairro>${data.emit.enderEmit.xBairro}</xBairro>
                <cMun>${data.emit.enderEmit.cMun}</cMun>
                <xMun>${data.emit.enderEmit.xMun}</xMun>
                <UF>${data.emit.enderEmit.UF}</UF>
                <CEP>${data.emit.enderEmit.CEP}</CEP>
            </enderEmit>
            <IE>${data.emit.IE}</IE>
            <CRT>${data.emit.CRT}</CRT>
        </emit>
        ${this.buildDest(data.dest)}
        ${this.buildDet(data.det)}
        <total>
            <ICMSTot>
                <vBC>0.00</vBC>
                <vICMS>0.00</vICMS>
                <vICMSDeson>0.00</vICMSDeson>
                <vFCP>0.00</vFCP>
                <vBCST>0.00</vBCST>
                <vST>0.00</vST>
                <vFCPST>0.00</vFCPST>
                <vFCPSTRet>0.00</vFCPSTRet>
                <vProd>${data.total.vProd}</vProd>
                <vFrete>0.00</vFrete>
                <vSeg>0.00</vSeg>
                <vDesc>0.00</vDesc>
                <vII>0.00</vII>
                <vIPI>0.00</vIPI>
                <vIPIDevol>0.00</vIPIDevol>
                <vPIS>0.00</vPIS>
                <vCOFINS>0.00</vCOFINS>
                <vOutro>0.00</vOutro>
                <vNF>${data.total.vNF}</vNF>
            </ICMSTot>
        </total>
        <transp>
            <modFrete>9</modFrete>
        </transp>
        <pag>
            <detPag>
                <tPag>01</tPag>
                <vPag>${data.pag.vPag}</vPag>
            </detPag>
        </pag>
    </infNFe>
</NFe>`;
        return { xml: this.xml, chave };
    }

    buildDest(dest) {
        if (!dest) return '';
        // Implementar lógica para destinatário se houver (CPF na nota)
        return ''; 
    }

    buildDet(itens) {
        return itens.map((item, index) => {
            // Se o item já vier com impostos definidos, usa eles. Se não, usa o padrão Simples Nacional (CSOSN 102)
            const imposto = item.imposto || `
            <imposto>
                <ICMS>
                    <ICMSSN102>
                        <orig>0</orig>
                        <CSOSN>102</CSOSN>
                    </ICMSSN102>
                </ICMS>
                <PIS>
                    <PISOutr>
                        <CST>99</CST>
                        <vBC>0.00</vBC>
                        <pPIS>0.00</pPIS>
                        <vPIS>0.00</vPIS>
                    </PISOutr>
                </PIS>
                <COFINS>
                    <COFINSOutr>
                        <CST>99</CST>
                        <vBC>0.00</vBC>
                        <pCOFINS>0.00</pCOFINS>
                        <vCOFINS>0.00</vCOFINS>
                    </COFINSOutr>
                </COFINS>
            </imposto>`;

            return `
        <det nItem="${index + 1}">
            <prod>
                <cProd>${item.prod.cProd}</cProd>
                <cEAN>SEM GTIN</cEAN>
                <xProd>${item.prod.xProd}</xProd>
                <NCM>${item.prod.NCM}</NCM>
                <CFOP>${item.prod.CFOP}</CFOP>
                <uCom>${item.prod.uCom}</uCom>
                <qCom>${item.prod.qCom}</qCom>
                <vUnCom>${item.prod.vUnCom}</vUnCom>
                <vProd>${item.prod.vProd}</vProd>
                <cEANTrib>SEM GTIN</cEANTrib>
                <uTrib>${item.prod.uTrib}</uTrib>
                <qTrib>${item.prod.qTrib}</qTrib>
                <vUnTrib>${item.prod.vUnTrib}</vUnTrib>
                <indTot>1</indTot>
            </prod>
            ${imposto}
        </det>`;
        }).join('');
    }

    gerarChaveAcesso(data) {
        const cUF = data.ide.cUF.padStart(2, '0');
        const dhEmi = data.ide.dhEmi; // Format: YYYY-MM-DD...
        const AAMM = dhEmi.substring(2, 4) + dhEmi.substring(5, 7);
        const CNPJ = data.emit.CNPJ.padStart(14, '0');
        const mod = '65';
        const serie = data.ide.serie.padStart(3, '0');
        const nNF = data.ide.nNF.padStart(9, '0');
        const tpEmis = data.ide.tpEmis;
        const cNF = data.ide.cNF.padStart(8, '0'); // Random number
        
        const chaveSemDV = `${cUF}${AAMM}${CNPJ}${mod}${serie}${nNF}${tpEmis}${cNF}`;
        
        // Calculate DV (Modulo 11)
        let soma = 0;
        let peso = 2;
        for (let i = chaveSemDV.length - 1; i >= 0; i--) {
            soma += parseInt(chaveSemDV[i]) * peso;
            peso++;
            if (peso > 9) peso = 2;
        }
        
        const resto = soma % 11;
        let cDV = 11 - resto;
        if (cDV >= 10) cDV = 0;
        
        // Update cDV in data object as well to match
        data.ide.cDV = cDV.toString();
        
        return `${chaveSemDV}${cDV}`;
    }
}

module.exports = new XmlBuilder();
