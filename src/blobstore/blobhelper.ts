"use strict";
import { TokenCredential } from "@azure/core-auth";
import { BlobServiceClient } from "@azure/storage-blob"

var logger = require("../utils/loghelper").logger;

//
// getKeyVaultSecret reads the secret from keyvault using managed identity
//
class BlobStore {
    client:any;

    constructor(account:string, credential:TokenCredential){
        logger.info("initialize store  %s", account);
        this.client = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            credential
        );

    }

    async streamToBuffer(readableStream:any) {
        return new Promise((resolve, reject) => {
          const chunks:any = [];
          readableStream.on("data", (data:any) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
          });
          readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
          });
          readableStream.on("error", reject);
        });
    }

    async getEntity(containerName:string, blobName:string) {
        logger.info("getting blob %s", blobName);
        const containerClient = this.client.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        return blobClient.download()
        .then((result:any) => {
            return this.streamToBuffer(result.readableStreamBody)
        })
        .then(function(resultData:any) {
            return resultData.toString();
        })
        .catch(function(error:any) {
            logger.info("get table entity error %o", error);
        });
    }

    async setEntity(containerName:string, blobName: string, value:any) {

        logger.info("setting blob %s", blobName);
        const containerClient = this.client.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(blobName);

        return blobClient.upload(value, value.length)
        .then(function(result:any) {
            logger.info("set blob entry %o", result);
            return result;
        })
        .catch(function(error:any) {
            logger.info("set blob entry error %o", error);
        });
    }
}

export default BlobStore;

