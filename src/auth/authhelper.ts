
var logger = require("../utils/loghelper").logger;
import gcpToken from "./gcptoken";
import k8sToken  from "./k8stoken";
import spiffeToken from "./spiffetoken";
import awsToken from "./awstoken";

import { DefaultAzureCredential, EnvironmentCredential, ClientAssertionCredential, ClientCertificateCredentialOptions } from "@azure/identity";
import msalClientAssertionCredential from "./msalclientassertioncredential";

var federatedToken:any = null;

function init() {


    let whereRunning:any = process.env.FEDERATED_ENVIRONMENT;
    let whichSDK:any = process.env.USE_MSAL? "MSAL":"AzureIdentity";

    let credential:any = null;

    let clientID:any = process.env.AZURE_CLIENT_ID;
    let tenantID:any = process.env.AZURE_TENANT_ID;
    let authority:any = process.env.AAD_AUTHORITY;

    if (!process.env.FEDERATED_ENVIRONMENT || !process.env.AZURE_CLIENT_ID || !process.env.AZURE_TENANT_ID || !process.env.AAD_AUTHORITY) {
        throw(new Error("AuthHelper init, environment not set up"));
    }

    switch (whereRunning) {
        case 'Google':
            logger.info("using gcp token");
            federatedToken = new gcpToken();
            break;

        case 'AWS':
            logger.info("using AWS token");
            federatedToken = new awsToken();    

            break;
        case 'k8s': 
            logger.info("using K8s token, for use with clientassertioncredential in MSAL or AzureIdentity");

            federatedToken = new k8sToken();
            break;

        case 'k8sAzureIdentity':
            logger.info("using Azure Idenitity SDK DefaultAzureCredential for k8sAzureIdentity");
            credential = new DefaultAzureCredential();
            break;

        case 'spiffe':
            logger.info("using spiffe token");
            federatedToken = new spiffeToken();
            break;
        
    
        case 'local':
            logger.info("using env creds for local");
            credential = new EnvironmentCredential();
            break;

        default:
            var error:string = "error: no credentials for whereRunning=" + whereRunning;
            logger.info(error);
            throw (new Error(error));
            break;

    }
    if (!credential) {
        if (whichSDK === "MSAL") {
            logger.info("using MSAL SDK");
            credential = new msalClientAssertionCredential(clientID,
                tenantID,
                authority,
                federatedToken);
        }
        else {
            logger.info("using Azure Identity SDK: clientAssertionCredential");

            let credOptions:ClientCertificateCredentialOptions = {authorityHost: authority};

            credential = new ClientAssertionCredential( tenantID,
                clientID,
                federatedToken.getFederatedToken,
                credOptions);
        }
    }
    return credential;
}

module.exports = { init: init, federatedToken: federatedToken };