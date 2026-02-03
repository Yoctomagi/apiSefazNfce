const dotenv = require('dotenv');
dotenv.config();

const nfceController = require('./src/controllers/nfceController');

const getCnpjFromCert = require('./src/utils/extractCert');
const extractCnpj = getCnpjFromCert();

console.log('Iniciando teste de emissão NFC-e em Homologação...');
console.log('CNPJ extraído do certificado:', extractCnpj);

// Mock Request
const testPayload = require('./test_payload.json');
// Override CNPJ with real certificate CNPJ
if (extractCnpj) {
    testPayload.emit.CNPJ = extractCnpj;
}

const req = {
    body: testPayload // Pass the payload in the body (controller usually reads req.body)
};

// IMPORTANT: Modify controller to prefer req.body if available, or force our payload
// Temporarily we will modify the controller logic in memory or via argument? 
// The current controller implementation strictly uses `const dadosVenda = testPayload;` (hardcoded import)
// We need to fix the controller first to accept dynamic payload or we can't test properly.


// Mock Response
const res = {
    status: function(code) {
        console.log(`[RES] Status Code: ${code}`);
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        console.log('[RES] JSON Response:');
        console.log(JSON.stringify(data, null, 2));
        return this;
    },
    send: function(data) {
        console.log('[RES] Send Response:', data);
        return this;
    }
};

(async () => {
    try {
        await nfceController.emitirNfce(req, res);
    } catch (error) {
        console.error('Erro fatal no teste:', error);
    }
})();
