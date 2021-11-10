import * as _sodium from 'libsodium-wrappers';
import { createReadStream,createWriteStream,statSync } from "fs";
import { blockSize } from './constants';
import { convertBytes, convertTimeToMBPerSecond } from './util/util';

/**
 * @name decryptFile
 * @param sodium instance of sodium
 * @param key Array of 32byte key
 * @param iv Buffer of Private Nonce or Initialization Vector
 * @param filePath File existence path 
 * @param publicIV Buffer of Public Nonce or Public Initialization vector
 * @returns {void}
 */
export const decryptFile = ((sodium : typeof _sodium,key:Uint8Array,iv:Buffer,filePath:string,publicIV:Buffer,) =>{

    var startTime:number,endTime:number;
    const fileExtension = filePath.split(".")?.reverse()[1];
    const input = createReadStream(filePath,{highWaterMark:blockSize+16});
    const output = createWriteStream(`${filePath}.${fileExtension}`,{highWaterMark:blockSize+16});
    const fileSize = statSync(filePath).size
    startTime = performance.now()

    input.on("open",()=>{
        startTime = performance.now()
       
    })
    try{
    input.on("data", (data:Buffer) =>{
    
    const bufferValue = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(iv,  new Uint8Array(data),"",publicIV,key)
    
    output.write(bufferValue)
    
    })}
    catch (error:unknown){
       throw new Error(error.toString())
    }
    input.on("end",()=>{
     endTime = performance.now()
     const totalDuration = endTime - startTime
     console.log(`XChacha20, "Decrypt", ${filePath}, ${convertBytes(fileSize)}, ${totalDuration} , ${ convertTimeToMBPerSecond(fileSize,totalDuration)}`)
     
})


})
