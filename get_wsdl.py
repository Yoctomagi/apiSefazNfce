import requests
import xml.dom.minidom

url = "https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx?wsdl"
try:
    response = requests.get(url, timeout=10, verify=False)
    if response.status_code == 200:
        print("Successfully fetched WSDL")
        print(response.text[:2000]) # Print first 2000 chars to check
        
        # Simple parsing to find soapAction
        content = response.text
        if 'soapAction' in content:
            print("\n--- SOAP Actions found ---")
            parts = content.split('soapAction="')
            for p in parts[1:]:
                print(p.split('"')[0])
                
        if 'targetNamespace' in content:
             print("\n--- Target Namespace found ---")
             tns = content.split('targetNamespace="')[1].split('"')[0]
             print(tns)

    else:
        print(f"Failed to fetch WSDL. Status code: {response.status_code}")
except Exception as e:
    print(f"Error fetching WSDL: {e}")
