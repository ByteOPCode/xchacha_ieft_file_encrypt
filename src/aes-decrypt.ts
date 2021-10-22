
import { createReadStream,createWriteStream,statSync } from "fs";
import { blockSize,aesCounterIteration } from './constants';
import { convertBytes } from './util/util';
import * as aes  from "../src/extras/aes-pure-js/index"

/**
 * @name decryptFile
 * @param sodium instance of sodium
 * @param key Array of 32byte key
 * @param iv Buffer of Private Nonce or Initialization Vector
 * @param filePath File existence path 
 * @param publicIV Buffer of Public Nonce or Public Initialization vector
 * @returns {void}
 */
export const decryptFileAES = ((key:Uint8Array,filePath:string,) =>{
    var startTime:number,endTime:number;
    const fileExtension = filePath.split(".")?.reverse()[1];
    
    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    const input = createReadStream(filePath,{highWaterMark:blockSize+16});
    const output = createWriteStream(`${filePath}.${fileExtension}`,{highWaterMark:blockSize+16});
    const fileSize = statSync(filePath).size

   
    input.on("open",()=>{
        startTime = performance.now()
       
    })
    try{
    input.on("data", (encryptedBytes:Buffer) =>{
    
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    output.write(decryptedBytes)
    
    })}
    catch (error:unknown){
       throw new Error(error.toString())
    }
    input.on("end",()=>{
     endTime = performance.now()
     console.log(`Decryption of  ${filePath} using AES CTR mode of size ${convertBytes(fileSize)} MB took ${endTime - startTime} milliseconds  `);
    process.exit(0)
})


})