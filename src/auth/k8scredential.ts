import FederatedTokenBaseClass from './federatedtokenbaseclass';
var fs = require("fs");
var logger = require("../utils/loghelper").logger;


class k8sCredential extends FederatedTokenBaseClass {
    
    
    constructor(clientID:string, tenantID:string, aadAuthority:string) {
        super(clientID, tenantID, aadAuthority);
    }

    async getFederatedToken() {
        return new Promise<any>(function(resolve, reject) {
            fs.readFile(process.env.AZURE_FEDERATED_TOKEN_FILE, "utf8", function(err:any, data:string) {
                if (err) {
                    logger.error("k8s token error %o", err);
                    reject(err);
                }
                else {
                    logger.debug("k8s token is %o", data);
                    resolve(data);
                }
            });
        });
    }
}

export default k8sCredential;