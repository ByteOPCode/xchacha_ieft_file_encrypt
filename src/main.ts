import * as _sodium from "libsodium-wrappers";
import { encryptFile } from "./encrypt";
import { randomBytes } from "crypto";
import { decryptFile } from "./decrypt";
import { existsSync } from "fs";
import { encryptFileAES } from "./aes-encrypt";
import { decryptFileAES } from "./aes-decrypt";
import { readKeyFromFile, saveKeyToFile } from "./util/util";
import { keyFileName } from "./constants";

(async () => {
  await _sodium.ready;
  const sodium = _sodium;
  const argsProcessed = process.argv.slice(2);
  if (!existsSync(argsProcessed[1])) throw new Error("file not found");

  const key = sodium.crypto_aead_xchacha20poly1305_ietf_keygen();
  switch (argsProcessed[0]) {
    case "encrypt":
      var nonce = randomBytes(32);
      var publicNonce = randomBytes(
        sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
      );
      saveKeyToFile(
        {
          key: key.toString(),
          nonce: nonce.toString("base64"),
          publicNonce: publicNonce.toString("base64"),
          type: "XChaCha20",
          fileName: argsProcessed[1],
        },
        keyFileName
      );
      encryptFile(sodium, key, nonce, argsProcessed[1], publicNonce);

      break;
    case "encryptAES":
      saveKeyToFile(
        { key: key.toString(), type: "AES", fileName: argsProcessed[1] },
        keyFileName
      );

      encryptFileAES(key, argsProcessed[1]);

      break;
    case "decrypt": {
      const { inputKey, inputNonce, inputPublicNonce } =
        readKeyFromFile(keyFileName);
      decryptFile(
        sodium,
        inputKey,
        inputNonce,
        argsProcessed[1],
        inputPublicNonce
      );

      break;
    }
    case "decryptAES":
      const { inputKey } = readKeyFromFile(keyFileName);
      decryptFileAES(inputKey, argsProcessed[1]);

      break;
    default:
      throw new Error("parameter should be either encrypt or decrypt");
  }
})();
