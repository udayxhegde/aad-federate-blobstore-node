import FederatedTokenBaseClass from './federatedtokenbaseclass';
var logger = require("../utils/loghelper").logger;

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const workloadApiDef = protoLoader.loadSync(__dirname + '/../utils/workloadapi.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});


class spiffeCredential extends FederatedTokenBaseClass {
    grpcClient:any;
    constructor(clientID:string, tenantID:string, aadAuthority:string) {
        //const socketPath = process.env.SOCKET_PATH;
        super(clientID, tenantID, aadAuthority);

        const spiffeProto = grpc.loadPackageDefinition(workloadApiDef);

        this.grpcClient = new spiffeProto.SpiffeWorkloadAPI('unix:///run/spire/sockets/agent.sock', grpc.credentials.createInsecure());
    
        logger.debug("spiffe done with client %o", this.grpcClient);
    }

    async getFederatedToken() {
        return new Promise<any>((resolve, reject) => {
            logger.info("in get federated token %o", this);
            var meta = new grpc.Metadata();
            meta.add('workload.spiffe.io', true);
            this.grpcClient.FetchJWTSVID({audience: ['api://AzureADTokenExchange']}, meta, function(err:any, message:any) {;
                if (err) {
                    logger.error("spiffe token error %o", err);
                    reject(err);
                }
                else {
                    logger.debug("spiffe token is %o", message);
                    resolve(message.svids[0].svid);
                }   
            });
        });
    }
}

export default spiffeCredential;