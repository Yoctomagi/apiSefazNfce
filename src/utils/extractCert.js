const fs = require('fs');
const forge = require('node-forge');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

function getCnpjFromCert() {
    try {
        const pfxPath = path.resolve(process.env.CERTIFICATE_PATH || 'certs/certificado.pfx');
        const password = process.env.CERTIFICATE_PASSWORD;
        
        const pfxBuffer = fs.readFileSync(pfxPath);
        const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
        const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, false, password);
        
        // Find the certificate
        const bags = pfx.getBags({ bagType: forge.pki.oids.certBag });
        const certBag = bags[forge.pki.oids.certBag][0];
        const cert = certBag.cert;
        
        // Parse Subject to find CNPJ
        // Common format in OID 2.5.4.3 (Common Name) often contains: "Name:CNPJ"
        // Or sometimes it's in OID 2.16.76.1.3.3 (OID for CNPJ in ICP-Brasil)
        
        let cnpj = null;
        
        // Method 1: Check CN (Common Name) for pattern :00000000000000
        const cn = cert.subject.getField('CN').value;
        // console.log('Certificate CN:', cn);
        const matchCN = cn.match(/:(\d{14})/);
        if (matchCN) {
            cnpj = matchCN[1];
        }
        
        // Method 2: If not in CN, iterate attributes (ICP-Brasil OID)
        if (!cnpj) {
            // This is complex in pure forge without specific OID knowledge for OID names, 
            // but we can look for specific OIDs if needed.
            // For now, most e-CNPJ certs have it in the CN.
        }

        return cnpj;
    } catch (e) {
        console.error('Error extracting CNPJ:', e.message);
        return null;
    }
}

if (require.main === module) {
    const cnpj = getCnpjFromCert();
    console.log(cnpj || 'CNPJ not found in certificate');
}

module.exports = getCnpjFromCert;
