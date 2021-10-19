import * as _sodium from 'libsodium-wrappers';
import { encryptFile } from './encrypt';
import { randomBytes } from 'crypto';
import { decryptFile } from './decrypt';
import { existsSync } from 'fs';
import { createInterface } from 'readline';


function askQuestion(query : string) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise<string>(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}
(async () => {
	await _sodium.ready;
	const sodium = _sodium;
	const argsProcessed = process.argv.slice(2);
	if (!existsSync(argsProcessed[1])) throw new Error('file not found');
	switch (argsProcessed[0]) {
		case 'encrypt':
			var iv = randomBytes(32);
			const key = sodium.crypto_aead_xchacha20poly1305_ietf_keygen();

			var ivPublic = randomBytes(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);

			console.log('Public Nonce: ', ivPublic.toString('hex'));
			console.log('Private Nonce: ', iv.toString('hex'));
			console.log('Key: ', key.toString());
			encryptFile(sodium, key, iv, argsProcessed[1], ivPublic);

			break;
		case 'decrypt':
            let  inputKey :number[];
            let inputIV,inputPublicIV:string;
			inputKey = (await askQuestion(`Enter the key for decrypting ${argsProcessed[1]} `))?.split(",").map(number => parseInt(number))
			inputPublicIV =  (await askQuestion(`Enter the Public IV for decrypting ${argsProcessed[1]} `))
			inputIV =  (await askQuestion(`Enter the private IV for decrypting ${argsProcessed[1]} `))
            //readLineInstance.question(`Enter the key for decrypting ${argsProcessed[1]}`, (key)=>{
            //     inputKey =   key?.split(",").map(number => parseInt(number))
            //     if (inputKey.length != 32) throw new Error ("invalid key or key length")
               
        
            // })
			
			// readLineInstance.question(`Enter the Nonce or Initializing Vector`,(iv)=>{
			// 	inputIV = iv;
			// })
			// readLineInstance.question(`Enter the public IV`,(ivPublic)=>{
			// 	inputPublicIV = ivPublic
			// })
			decryptFile(
				sodium,
				Uint8Array.from(inputKey),
				Buffer.from(inputIV,'hex'),
				argsProcessed[1],
				Buffer.from(inputPublicIV,'hex')
			);

// console.log(inputIV,inputPublicIV,inputKey)
			break;
        default:
            throw new Error("parameter should be either encrypt or decrypt")
	}
})();
