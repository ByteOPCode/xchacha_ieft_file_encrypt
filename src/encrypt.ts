import * as _sodium from "libsodium-wrappers";
import { createReadStream, createWriteStream, statSync } from "fs";
import { blockSize } from "./constants";
import { convertBytes, convertTimeToMBPerSecond } from "./util/util";

/**
 * @name encryptFile
 * @param sodium instance of sodium
 * @param key Uint8Array of 32byte key
 * @param nonce Buffer of Private Nonce (32byte)
 * @param filePath File existence path
 * @param  publicNonce Buffer of Public Nonce (24byte)
 * @returns {void}
 */

export const encryptFile = (
  sodium: typeof _sodium,
  key: Uint8Array,
  nonce: Buffer,
  filePath: string,
  publicNonce: Buffer
) => {
  var startTime: number, endTime: number;

  const input = createReadStream(filePath, { highWaterMark: blockSize });
  const output = createWriteStream(`${filePath}.enc`, {
    highWaterMark: blockSize,
  });
  const fileSize = statSync(filePath).size;
  startTime = performance.now();

  input.on("open", () => {
    startTime = performance.now();
  });

  try {
    input.on("data", (data) => {
      const bufferValue = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        data,
        null,
        nonce,
        publicNonce,
        key
      );

      output.write(bufferValue);
    });
  } catch (error) {
    console.error(error);
  }
  input.on("end", () => {
    endTime = performance.now();
    const totalDuration = endTime - startTime;
    console.log(
      `XChacha20, Encrypt, ${filePath}, ${convertBytes(
        fileSize
      )}, ${totalDuration},  ${convertTimeToMBPerSecond(
        fileSize,
        totalDuration
      )}`
    );
  });
};
