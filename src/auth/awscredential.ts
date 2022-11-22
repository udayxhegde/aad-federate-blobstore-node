import FederatedTokenBaseClass from './federatedtokenbaseclass';

import { CognitoIdentityClient, GetOpenIdTokenForDeveloperIdentityCommand } from "@aws-sdk/client-cognito-identity"; // ES Modules import

var logger = require("../utils/loghelper").logger;
require('isomorphic-fetch');

class awsCredential extends FederatedTokenBaseClass {
    
    client:CognitoIdentityClient;
    poolId:any;
    region:any;
    logins:any;
    devId:any;

    constructor(clientID:string, tenantID:string, aadAuthority:string) {
        super(clientID, tenantID, aadAuthority);   
        this.poolId = process.env.AWS_IDENTITY_POOL_ID;
        this.region = process.env.AWS_REGION;
        this.logins = process.env.AWS_LOGINS;
        this.devId = process.env.AWS_DEVELOPER_ID;
        this.client = new CognitoIdentityClient({ region: this.region }); 
    }

    async getFederatedToken() {
        logger.debug("in aws getfederatedtoken");
        var Logins:any = {};
        Logins[this.logins] = this.devId;
        
        const command = new GetOpenIdTokenForDeveloperIdentityCommand({IdentityPoolId: this.poolId,
                            Logins
                        });

        logger.debug("sending command to cognito %o", command);
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

