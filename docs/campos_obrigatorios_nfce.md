# Campos Obrigatórios da NFC-e (Nota Fiscal de Consumidor Eletrônica)

Este documento detalha os campos obrigatórios para a emissão de uma NFC-e (Modelo 65), explicando o significado e a regra de negócio de cada um. A estrutura segue o padrão do XML exigido pela SEFAZ.

## 1. Grupo `ide` - Identificação da Nota Fiscal
Este grupo contém os dados principais que identificam a transação.

| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **cUF** | Código da UF | Código numérico do estado conforme tabela IBGE (ex: RS=43, SP=35). Define para qual SEFAZ a nota será enviada. (Veja tabela abaixo) |

### Tabela de Códigos de UF (IBGE)

| Código | Estado | Sigla |
| :---: | :--- | :---: |
| 11 | Rondônia | RO |
| 12 | Acre | AC |
| 13 | Amazonas | AM |
| 14 | Roraima | RR |
| 15 | Pará | PA |
| 16 | Amapá | AP |
| 17 | Tocantins | TO |
| 21 | Maranhão | MA |
| 22 | Piauí | PI |
| 23 | Ceará | CE |
| 24 | Rio Grande do Norte | RN |
| 25 | Paraíba | PB |
| 26 | Pernambuco | PE |
| 27 | Alagoas | AL |
| 28 | Sergipe | SE |
| 29 | Bahia | BA |
| 31 | Minas Gerais | MG |
| 32 | Espírito Santo | ES |
| 33 | Rio de Janeiro | RJ |
| 35 | São Paulo | SP |
| 41 | Paraná | PR |
| 42 | Santa Catarina | SC |
| 43 | Rio Grande do Sul | RS |
| 50 | Mato Grosso do Sul | MS |
| 51 | Mato Grosso | MT |
| 52 | Goiás | GO |
| 53 | Distrito Federal | DF |

| **cNF** | Código Numérico | Número aleatório de 8 dígitos gerado pelo seu sistema. Serve para compor a Chave de Acesso e garantir unicidade. |
| **natOp** | Natureza da Operação | Descrição da operação. Para NFC-e, geralmente é "VENDA DE MERCADORIA". |
| **mod** | Modelo | Fixo "65" para NFC-e. (Se fosse NF-e grande, seria "55"). |
| **serie** | Série | Número de série do ponto de venda (caixa). Ex: 1, 2, 3. |
| **nNF** | Número da Nota | Número sequencial da nota para aquela série. **Não pode pular nem repetir**. |
| **dhEmi** | Data de Emissão | Data e hora no formato UTC (ISO 8601). Ex: `2023-10-27T10:00:00-03:00`. |
| **tpEmis** | Tipo de Emissão | `1` = Normal (Online); `9` = Contingência Offline (Quando sem internet). |
| **cMunFG** | Município Fato Gerador | Código IBGE do município onde a venda ocorreu. |
| **tpImp** | Tipo de Impressão | Fixo `4` para NFC-e (DANFE NFC-e). |
| **tpAmb** | Ambiente | `1` = Produção (Validade Jurídica); `2` = Homologação (Testes). |
| **finNFe** | Finalidade | Fixo `1` (NFe normal). |
| **indFinal** | Consumidor Final | Fixo `1` (Sim). NFC-e é sempre para consumidor final. |
| **indPres** | Presença do Comprador | Fixo `1` (Operação presencial). |
| **procEmi** | Processo de Emissão | Fixo `0` (Emissão de aplicativo do contribuinte). |
| **verProc** | Versão do Processo | Versão do seu software emissor (ex: "1.0"). |

## 2. Grupo `emit` - Identificação do Emitente (Sua Empresa)
Dados da empresa que está vendendo. Devem bater com o cadastro na SEFAZ.

| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **CNPJ** | CNPJ | Apenas números, 14 dígitos. Usado para empresas (MEI, ME, Ltda). **Obrigatório para comércio varejista padrão.** |
| **CPF** | CPF | Apenas números, 11 dígitos. **Exclusivo para Produtor Rural Pessoa Física**. (Substitui o campo CNPJ). |
| **xNome** | Razão Social | Nome jurídico da empresa ou nome do produtor rural. |
| **enderEmit** | Endereço | Grupo contendo Logradouro (`xLgr`), Número (`nro`), Bairro (`xBairro`), Município (`cMun` - IBGE), Nome Município (`xMun`), UF e CEP. |
| **IE** | Inscrição Estadual | Obrigatório para contribuintes do ICMS. Apenas números. |
| **CRT** | Regime Tributário | `1` = Simples Nacional; `3` = Regime Normal. Define como os impostos serão calculados. |

## 3. Grupo `dest` - Identificação do Destinatário (Cliente)
Na NFC-e, identificar o cliente é **opcional** para valores abaixo de R$ 10.000,00, a menos que o cliente solicite (CPF na Nota).

| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **CPF** / **CNPJ** | Documento | CPF ou CNPJ do cliente. |
| **xNome** | Nome | Nome do cliente (Opcional se informar apenas CPF). |
| **indIEDest** | Indicador de IE | Fixo `9` (Não Contribuinte), pois NFC-e é para consumidor final. |

## 4. Grupo `det` - Detalhamento de Produtos e Serviços
Lista de itens da venda. Cada item possui um número sequencial (`nItem="1"`, `nItem="2"`...).

### 4.1 Subgrupo `prod` - Dados do Produto
| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **cProd** | Código do Produto | Seu código interno (SKU, ID). |
| **cEAN** | GTIN / EAN | Código de barras (GTIN-8, GTIN-12, GTIN-13). Se não tiver, usar "SEM GTIN". |
| **xProd** | Descrição | Nome do produto. |
| **NCM** | NCM | Código da Nomenclatura Comum do Mercosul (8 dígitos). **Crucial para tributação**. |
| **CFOP** | CFOP | Código Fiscal de Operações. Geralmente `5102` (Revenda) ou `5405` (Substituição Tributária). |
| **uCom** | Unidade Comercial | Ex: UN, KG, LT. |
| **qCom** | Quantidade Comercial | Quantidade vendida. |
| **vUnCom** | Valor Unitário | Preço unitário do produto. |
| **vProd** | Valor Total | `qCom` * `vUnCom`. |
| **indTot** | Indica Total | Fixo `1` (Valor compõe o valor total da nota). |

### 4.2 Subgrupo `imposto` - Tributação
Obrigatório informar a situação tributária, mesmo que seja isento ou Simples Nacional.

*   **ICMS**: Deve-se escolher o grupo correto conforme o CRT (Simples Nacional usa `ICMSSN...`, Regime Normal usa `ICMS...`).
    *   Exemplo Simples Nacional: `CSOSN` (Código de Situação da Operação) e `orig` (Origem da mercadoria).
*   **PIS/COFINS**: Obrigatório informar. Para Simples Nacional, geralmente usa-se CST `99` (Outras Operações) ou `49`.

## 5. Grupo `total` - Totais da Nota
Somatório de todos os itens. A SEFAZ valida a matemática rigorosamente.

| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **vProd** | Valor dos Produtos | Soma dos campos `vProd` de todos os itens. |
| **vNF** | Valor da Nota | `vProd` - `vDesc` (Desconto) + `vOutro` + `vFrete` + `vSeg` + `vIPI`. |

## 6. Grupo `transp` - Transporte
| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **modFrete** | Modalidade Frete | Para NFC-e, geralmente é `9` (Sem frete). |

## 7. Grupo `pag` - Pagamento
Forma como o cliente pagou. Obrigatório para NFC-e.

| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **tPag** | Tipo de Pagamento | `01`=Dinheiro, `03`=Crédito, `04`=Débito, `17`=PIX, etc. |
| **vPag** | Valor do Pagamento | Valor pago nesta forma. |
| **vTroco** | Troco | Se `vPag` (em dinheiro) for maior que `vNF`, deve-se informar o troco. |

## 8. Grupo `infAdic` - Informações Adicionais
| Campo | Nome | Descrição e Regra |
|-------|------|-------------------|
| **urlChave** | URL de Consulta | Endereço para consulta via QR Code (varia por estado). |
