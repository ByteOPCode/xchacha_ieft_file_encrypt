import { aesKey, cryptoKey, xChaChaKey } from '../model/crypto.model';
import { readFileSync, writeFileSync } from 'fs';
function convertBytesToMB(bytes: number) {
	return (bytes / 1024 / 1024);
}

// calculate throughput
function computeThroughput(bytes: number, time: number) {
	time = time / 1000; // transform to seconds
	return (convertBytesToMB(bytes) / time);
}


function saveKeyToFile(key: xChaChaKey | aesKey, fileName: string) {
	try {
		writeFileSync(fileName, JSON.stringify(key));
	} catch (e) {
		console.error('something went wrong while storing keys to disk', e);
	}
}

function readKeyFromFile(fileName: string) {
	try {
		const binary: xChaChaKey | aesKey = JSON.parse(readFileSync(fileName, 'utf8'));
		if (binary.type === 'XChaCha20') {
			return {
				inputIV: Buffer.from(binary.iv, 'base64'),
				inputKey: Uint8Array.from(binary.key.split(','), (byte: string) => parseInt(byte)),
				inputPublicIV: Buffer.from(binary.publicIV, 'base64')
			};
		} else {
			return { inputKey: Uint8Array.from(binary.key.split(','), (byte: string) => parseInt(byte)) };
		}
	} catch (e) {
		console.error('something went wrong while reading keys from disk', e);
	}
}
export { convertBytesToMB as convertBytes, computeThroughput as convertTimeToMBPerSecond, saveKeyToFile, readKeyFromFile };
