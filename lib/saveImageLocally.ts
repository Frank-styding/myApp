import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto"; // 👈 para generar hash SHA256

export async function saveImageLocally(base64: string, fileName: string) {
  const fileUri = `${FileSystem.documentDirectory}${fileName}.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}

export async function getBase64Hash(base64: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    base64
  );
}
