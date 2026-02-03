const SignedXml = require('xml-crypto').SignedXml;
const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

class Signer {
    constructor() {
        this.transforms = [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
        ];
    }

    getPrivateKeyFromPfx(pfxPath, password) {
        const pfxBuffer = fs.readFileSync(pfxPath);
        const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
        const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, false, password);

        // Get the private key
        // Note: Assuming the first safe bag with a key is the one we want
        const bags = pfx.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
        const keyBag = bags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
        
        if (!keyBag) {
             // Fallback to keyBag if shrouded is not found (sometimes they are different)
             const bags2 = pfx.getBags({ bagType: forge.pki.oids.keyBag });
             const keyBag2 = bags2[forge.pki.oids.keyBag][0];
             if(!keyBag2) throw new Error("Chave privada não encontrada no PFX");
             return forge.pki.privateKeyToPem(keyBag2.key);
        }

        return forge.pki.privateKeyToPem(keyBag.key);
    }

    signXml(xml, tagId) {
        try {
            const pfxPath = path.resolve(process.env.CERTIFICATE_PATH || 'certs/certificado.pfx');
            const password = process.env.CERTIFICATE_PASSWORD;

            if (!fs.existsSync(pfxPath)) {
                throw new Error(`Certificado não encontrado em: ${pfxPath}`);
            }

            const privateKey = this.getPrivateKeyFromPfx(pfxPath, password);
            console.log('Chave privada extraída:', privateKey ? 'Sim (' + privateKey.substring(0, 30) + '...)' : 'Não');

            const sig = new SignedXml();
            sig.addReference({
                xpath: `//*[@Id='${tagId}']`,
                transforms: this.transforms,
                digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1'
            });
            sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
            sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
            
            // xml-crypto v6 property: privateKey (older versions used signingKey)
            sig.privateKey = privateKey;
            
            sig.computeSignature(xml);
            
            return sig.getSignedXml();

        } catch (error) {
            console.error('Erro ao assinar XML:', error);
            throw error;
        }
    }
}

module.exports = new Signer();
