import FederatedToken from './federatedtoken';
var fs = require("fs");
var logger = require("../utils/loghelper").logger;


class k8sToken extends FederatedToken {
    
    
    constructor() {
        super();
        if (!process.env.AZURE_FEDERATED_TOKEN_FILE) {
            throw (new Error("k8s token environment not setup correctly"));
        }
    }

    async getFederatedToken() {
        return new Promise<any>(function(resolve, reject) {
            //
            // The K8s token is in a file location, read it and return.
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

export default k8sToken;