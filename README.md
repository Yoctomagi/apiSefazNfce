# API NFC-e Própria

Este projeto é um esqueleto de uma API para emissão de NFC-e (Nota Fiscal de Consumidor Eletrônica) integrando diretamente com a SEFAZ, sem intermediários.

## Estrutura

- `src/controllers`: Controladores da API.
- `src/services`: Lógica de negócios (Gerador XML, Assinatura, Comunicação SEFAZ).
- `src/routes`: Rotas da API.
- `certs`: Local para armazenar o certificado digital (.pfx).

## Pré-requisitos

- Node.js instalado.
- Certificado Digital A1 (arquivo .pfx) válido.

## Configuração

1. Renomeie o arquivo `.env.example` para `.env` (se houver) ou configure o `.env` criado.
2. Coloque seu certificado `.pfx` na pasta `certs`.
3. Atualize o caminho e senha no `.env`.

## Instalação

```bash
npm install
```

## Execução

```bash
node index.js
```

## Uso

Faça uma requisição POST para `http://localhost:3000/api/nfce/emitir` com o corpo JSON (exemplo em `test_payload.json`).

## Observações Importantes

- **Certificado**: O código atual possui "mocks" (simulações) para a assinatura e envio, pois requer um certificado real para funcionar. Você deve descomentar as linhas nos arquivos `src/services/signer.js` e `src/services/sefazService.js` e fornecer seu certificado.
- **Validação**: A geração do XML é simplificada. Em produção, você deve validar todos os campos rigorosamente conforme o Manual de Orientação do Contribuinte (MOC).
- **SEFAZ URL**: A URL no `.env` é de homologação do RS (SVRS). Verifique a URL correta para o seu estado.
