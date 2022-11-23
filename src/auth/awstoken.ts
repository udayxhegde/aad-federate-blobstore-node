import FederatedToken from './federatedtoken';

import { CognitoIdentityClient, GetOpenIdTokenForDeveloperIdentityCommand } from "@aws-sdk/client-cognito-identity"; // ES Modules import

var logger = require("../utils/loghelper").logger;
require('isomorphic-fetch');

class awsToken extends FederatedToken {
    
    client:CognitoIdentityClient;
    poolId:any;
    region:any;
    devName:any;
    devId:any;

    constructor() {
        super();   

        if ((process.env.COGNITO_IDENTITY_POOL_ID) && 
               (process.env.AWS_REGION) && 
               (process.env.COGNITO_DEVELOPER_NAME) && 
               (process.env.COGNITO_DEVELOPER_ID)) {

            //
            // This is the cognito identity pool id
            this.poolId = process.env.COGNITO_IDENTITY_POOL_ID;

            //
            // Region of our Cognito pool
            this.region = process.env.AWS_REGION;

            //
            // The developer provider name we configured in Cognito
            this.devName = process.env.COGNITO_DEVELOPER_NAME;

            //
            // The developer ID for this workload, which we used to create a cognito id.
            this.devId = process.env.COGNITO_DEVELOPER_ID;
            this.client = new CognitoIdentityClient({ region: this.region }); 
        }
        else {
            throw(new Error("AWS environment not set correctly"))
        }
    }

    async getFederatedToken() {
        logger.debug("in aws getfederatedtoken");

        var Logins:any = {};
        Logins[this.devName] = this.devId;
        
        //
        // use the AWS SDK to call GetOpenIDTokenForDeveloperIdentity. We are requesting a token for the identity we created by passing
        // the DeveloperProviderName:DeveloperId in the Logins field
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

export default awsToken;

