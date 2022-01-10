// FederatedTokenInterface.ts
import ClientAssertionCredential from './clientassertioncredential';
import {TokenCredential, GetTokenOptions, AccessToken} from "@azure/core-auth"

class FederatedTokenBaseClass implements TokenCredential {
  credential:ClientAssertionCredential;
    constructor(clientID:string, tenantID:string, aadAuthority:string) {
        this.credential =  new ClientAssertionCredential(clientID,
                                                         tenantID,
                                                         aadAuthority,
                                                         this);
    }
  async getFederatedToken() {
    throw(new Error("not implemented"));
  }

  async getToken(scope: string | string[], options?: GetTokenOptions | undefined) :Promise<AccessToken> {
    return this.credential.getToken(scope, options);
  }
}

export default FederatedTokenBaseClass;