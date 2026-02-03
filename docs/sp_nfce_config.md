# Configuração SEFAZ SP - NFeAutorizacao4 (Homologação)

Referência técnica para configuração do serviço de autorização de NF-e/NFC-e para São Paulo (ambiente de homologação).

## Detalhes do Serviço SOAP 1.2

*   **URL do Serviço (Homologação):** `https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx`
*   **Content-Type:** `application/soap+xml; charset=utf-8`
*   **Action (SOAP Action):** `http://www.portalfiscal.inf.br/nfe/wsdl/NfeAutorizacao4/nfeAutorizacaoLote`
*   **Namespace URI:** `http://www.portalfiscal.inf.br/nfe/wsdl/NfeAutorizacao4`

### Respostas para suas dúvidas
1.  **Requer "nfeAutorizacaoLote" na string da action?**
    *   **Sim.** A action completa deve incluir o nome do método `nfeAutorizacaoLote`.
2.  **O namespace usa http ou https?**
    *   **http.** O namespace é um identificador e segue o padrão definido no Portal da Nota Fiscal Eletrônica, que utiliza `http`. Apenas a URL de transporte (endpoint) usa `https`.
3.  **Problemas conhecidos com "Action not recognized" para SP?**
    *   Este erro geralmente ocorre quando o parâmetro `action` não está sendo passado corretamente no header `Content-Type` (obrigatório no SOAP 1.2).
    *   Certifique-se de que não há espaços extras ou aspas incorretas na string da action.
    *   São Paulo é estrito quanto ao padrão SOAP 1.2. Não utilize o header `SOAPAction` (padrão SOAP 1.1) separadamente; a action deve estar dentro do `Content-Type`.

## Exemplo de Header HTTP Correto

```http
POST /ws/nfeautorizacao4.asmx HTTP/1.1
Host: homologacao.nfe.fazenda.sp.gov.br
Content-Type: application/soap+xml; charset=utf-8; action="http://www.portalfiscal.inf.br/nfe/wsdl/NfeAutorizacao4/nfeAutorizacaoLote"
Content-Length: ...
```

## Exemplo do Envelope XML

```xml
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NfeAutorizacao4">
      <!-- Conteúdo do XML da Nota aqui -->
    </nfeDadosMsg>
  </soap12:Body>
</soap12:Envelope>
```
