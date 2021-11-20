import * as _sodium from "libsodium-wrappers";
import { createReadStream, createWriteStream, statSync } from "fs";
import { blockSize } from "./constants";
import { convertBytes, convertTimeToMBPerSecond } from "./util/util";

/**
 * @name decryptFile
 * @param sodium instance of sodium
 * @param key Uint8Array of 32byte key
 * @param nonce Buffer of Private Nonce (32byte)
 * @param filePath File existence path
 * @param publicNonce Buffer of Public Nonce (24byte)
 * @returns {void}
 */
export const decryptFile = (
  sodium: typeof _sodium,
  key: Uint8Array,
  nonce: Buffer,
  filePath: string,
  publicNonce: Buffer
) => {
  var startTime: number, endTime: number;
  const fileExtension = filePath.split(".")?.reverse()[1];
  const input = createReadStream(filePath, { highWaterMark: blockSize + 16 });
  const output = createWriteStream(`${filePath}.${fileExtension}`, {
    highWaterMark: blockSize + 16,
  });
  const fileSize = statSync(filePath).size;
  startTime = performance.now();

  input.on("open", () => {
    startTime = performance.now();
  });
  try {
    input.on("data", (data: Buffer) => {
      const bufferValue = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        nonce,
        new Uint8Array(data),
        "",
        publicNonce,
        key
      );

      output.write(bufferValue);
    });
  } catch (error: unknown) {
    throw new Error(error.toString());
  }
  input.on("end", () => {
    endTime = performance.now();
    const totalDuration = endTime - startTime;
    console.log(
      `XChacha20, Decrypt, ${filePath}, ${convertBytes(
        fileSize
      )}, ${totalDuration} , ${convertTimeToMBPerSecond(
        fileSize,
        totalDuration
      )}`
    );
  });
};
