import pako from 'pako';

/**
 * 문자열을 gzip으로 압축합니다.
 *
 * @param data 압축할 문자열
 * @returns gzip으로 압축된 바이트 배열
 */
export function compress(data: string): Uint8Array {
  return pako.gzip(data);
}

/**
 * gzip으로 압축된 데이터를 문자열로 해제합니다.
 *
 * @param data 압축된 바이트 배열
 * @returns 압축 해제된 문자열
 */
export function decompress(data: Uint8Array): string {
  return pako.ungzip(data, { to: 'string' });
}
