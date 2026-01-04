# Tabela de Autorizadores e URLs por Estado (NFC-e)

Este documento lista qual servidor autorizador (Web Service) cada estado utiliza para a emissão de NFC-e, bem como os códigos IBGE correspondentes.

O sistema utiliza essa tabela para decidir automaticamente para qual URL enviar o XML da nota.

## Como funciona o Roteamento
1. O sistema lê o código da UF (`cUF`) no JSON da venda.
2. Converte o código numérico para a sigla do estado (ex: 43 -> RS).
3. Consulta a tabela abaixo para saber qual Autorizador aquele estado usa.
4. Seleciona a URL correta baseada no ambiente (Homologação ou Produção).

## Tabela Completa

| Código IBGE | Estado (UF) | Sigla | Autorizador | URL Base (Homologação / Produção) |
| :---: | :--- | :---: | :---: | :--- |
| **12** | Acre | **AC** | SVRS | `svrs.rs.gov.br` |
| **27** | Alagoas | **AL** | SVRS | `svrs.rs.gov.br` |
| **16** | Amapá | **AP** | SVRS | `svrs.rs.gov.br` |
| **13** | Amazonas | **AM** | AM (Próprio) | `sefaz.am.gov.br` |
| **29** | Bahia | **BA** | BA (Próprio) | `sefaz.ba.gov.br` |
| **23** | Ceará | **CE** | SVRS | `svrs.rs.gov.br` |
| **53** | Distrito Federal | **DF** | SVRS | `svrs.rs.gov.br` |
| **32** | Espírito Santo | **ES** | SVRS | `svrs.rs.gov.br` |
| **52** | Goiás | **GO** | GO (Próprio) | `sefaz.go.gov.br` |
| **21** | Maranhão | **MA** | SVRS* | `svrs.rs.gov.br` |
| **51** | Mato Grosso | **MT** | MT (Próprio) | `sefaz.mt.gov.br` |
| **50** | Mato Grosso do Sul | **MS** | MS (Próprio) | `sefaz.ms.gov.br` |
| **31** | Minas Gerais | **MG** | MG (Próprio) | `fazenda.mg.gov.br` |
| **15** | Pará | **PA** | SVRS | `svrs.rs.gov.br` |
| **25** | Paraíba | **PB** | SVRS | `svrs.rs.gov.br` |
| **41** | Paraná | **PR** | PR (Próprio) | `sefa.pr.gov.br` |
| **26** | Pernambuco | **PE** | PE (Próprio) | `sefaz.pe.gov.br` |
| **22** | Piauí | **PI** | SVRS | `svrs.rs.gov.br` |
| **33** | Rio de Janeiro | **RJ** | SVRS | `svrs.rs.gov.br` |
| **24** | Rio Grande do Norte | **RN** | SVRS | `svrs.rs.gov.br` |
| **43** | Rio Grande do Sul | **RS** | RS (Próprio) | `sefazrs.rs.gov.br` |
| **11** | Rondônia | **RO** | SVRS | `svrs.rs.gov.br` |
| **14** | Roraima | **RR** | SVRS | `svrs.rs.gov.br` |
| **42** | Santa Catarina | **SC** | SVRS | `svrs.rs.gov.br` |
| **35** | São Paulo | **SP** | SP (Próprio) | `fazenda.sp.gov.br` |
| **28** | Sergipe | **SE** | SVRS | `svrs.rs.gov.br` |
| **17** | Tocantins | **TO** | SVRS | `svrs.rs.gov.br` |

*\*Nota: O Maranhão (MA) pode utilizar a SVAN em alguns serviços, mas frequentemente utiliza a SVRS para autorização de NFC-e. O sistema está configurado para SVRS por padrão.*

## Detalhe das URLs (Web Services)

### SVRS (Sefaz Virtual do RS)
Utilizada pela maioria dos estados que não possuem infraestrutura própria.
*   **Homologação:** `https://nfce-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx`
*   **Produção:** `https://nfce.svrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx`

### São Paulo (SP)
*   **Homologação:** `https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx`
*   **Produção:** `https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx`

### Minas Gerais (MG)
*   **Homologação:** `https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4`
*   **Produção:** `https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4`

### Paraná (PR)
*   **Homologação:** `https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl`
*   **Produção:** `https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl`

*(Consulte o arquivo `src/utils/sefazUrls.js` para a lista completa e atualizada das URLs de todos os estados próprios)*
