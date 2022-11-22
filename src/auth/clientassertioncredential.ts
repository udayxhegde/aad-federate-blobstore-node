const msal = require("@azure/msal-node");
import {TokenCredential, GetTokenOptions, AccessToken} from "@azure/core-auth"
import { LogLevel } from "@azure/msal-node";
import FederatedTokenInterface from './federatedtokenbaseclass';

var logger = require("../utils/loghelper").logger;

class ClientAssertionCredential implements TokenCredential {
    clientID:string;
    tenantID: string;
    aadAuthority: string;
    federatedToken:FederatedTokenInterface;

    constructor(clientID:string, tenantID:string, aadAuthority:string, federatedToken:FederatedTokenInterface) {
        this.clientID = clientID;
        this.tenantID = tenantID;
        this.aadAuthority = aadAuthority;
        this.federatedToken = federatedToken;
    }
    
    async getToken(scope: string | string[], _options?: GetTokenOptions):Promise<AccessToken> {

        logger.debug("Client assertion cred, getToken called");
        var scopes:string[] = [];

        if (Array.isArray(scope)) {
            for (let index =0; index < scope.length; index++) {
                scopes[index] = scope[index];
            }
        }
        else {
            scopes[0]=scope;
        }

        //first get the federated token
        return this.federatedToken.getFederatedToken()
        //now pass this as a client assertion to the confidential client app
        .then((clientAssertion:any)=> {
            logger.debug("client assertion cred, got federated token %o", clientAssertion);
            var msalApp: any;
            var authParams = {
                clientId: this.clientID,
                authority: this.aadAuthority + this.tenantID,
                clientAssertion: clientAssertion,
            }

            const msalConfig = {
                auth: authParams,
                system: {
                    loggerCallback: (_level: LogLevel, message: string, _containsPii: boolean): void => {
                        console.log('MSAL Logging: ', message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Verbose
                }
            };

            logger.debug("authParams is %o", authParams);
            logger.debug("Scopes is %o", scopes);
            msalApp = new msal.ConfidentialClientApplication(
                msalConfig
            );
            return msalApp.acquireTokenByClientCredential({ scopes })
        })
        // 
        // we should have the AAD token, return the pieces that are relevant... why is this needed?
        //
        .then(function(aadToken) {
            logger.debug("client assertion cred, got AAD token %o", aadToken);        
            let returnToken = {
                token: aadToken.accessToken,
                expiresOnTimestamp: aadToken.expiresOn.getTime(),
            };
            return (returnToken);
        })
        //
        // if there are any errors, log it here for debugging, and rethrow
        //
        .catch(function(error) {
            logger.error("getToken error %o", error);
            throw(error);
        });
    }
}
export default ClientAssertionCredential;

