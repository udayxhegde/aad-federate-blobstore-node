import FederatedTokenBaseClass from './federatedtokenbaseclass';


import { CognitoIdentityClient, GetOpenIdTokenForDeveloperIdentityCommand } from "@aws-sdk/client-cognito-identity"; // ES Modules import

var logger = require("../utils/loghelper").logger;
require('isomorphic-fetch');

class awsCredential extends FederatedTokenBaseClass {
    
    client:CognitoIdentityClient;

    constructor(clientID:string, tenantID:string, aadAuthority:string) {
        super(clientID, tenantID, aadAuthority);   
        this.client = new CognitoIdentityClient({ region: "us-west-2" }); 
    }

    async getFederatedToken() {
        logger.debug("in aws getfederatedtoken");
        const command = new GetOpenIdTokenForDeveloperIdentityCommand({IdentityPoolId: "us-west-2:1e2cf987-b9c8-4f2d-a46d-45f26e60fa2a",
                            Logins: { 
                                "aws.workloadidentity" : "aws_user" 
                            }
                        });

        return this.client.send(command)
        .then(function(data:any) {
            logger.debug("aws return is  %o", data);
            logger.debug("aws token is %o", data.Token);

            return data.Token;
        })
        .catch(function(error:any) {
            logger.error("aws token is error %o", error);
            throw(error);
        });
    }
}

export default awsCredential;

