import FederatedTokenBaseClass from './federatedtokenbaseclass';

var logger = require("../utils/loghelper").logger;
require('isomorphic-fetch');

class gcpCredential extends FederatedTokenBaseClass {
    
    super(clientID:string, tenantID:string, aadAuthority:string) {
        this.super.constructor(clientID, tenantID, aadAuthority);    
    }

    async getFederatedToken() {
        const headers = new Headers();

        headers.append("Metadata-Flavor", "Google ");

        let aadAudience = process.env.AZURE_AD_AUDIENCE? process.env.AZURE_AD_AUDIENCE : "api://AzureADTokenExchange";

        //
        // get the identity token from the instance metadata endpoint
        // this gets the identity token for the service account assigned to the gcp compute
        //
        const endpoint="http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience="
                        + aadAudience;
    
        const options = {
            method: "GET",
            headers: headers,
        };
    
        logger.debug('request made to gcp token endpoint at: %s ' + new Date().toString(), endpoint);
        return fetch(endpoint, options)
        .then(function(token:any) {
            logger.debug("gcp token is %o", token);
            return token.text(); 
        })
        .catch(function(error:any) {
            logger.error("gcp token is error %o", error);
            throw(error);
        });
    }
}

export default gcpCredential;