export class cryptoKey {
  public key: string;
  public fileName: string;
  public type: "AES" | "XChaCha20";
}
export class xChaChaKey extends cryptoKey {
  public publicNonce?: string;
  public nonce?: string;
  public type: "XChaCha20";
}
export class aesKey extends cryptoKey {
  public type: "AES";
}
