/**
 * 문자열을 gzip으로 압축합니다.
 *
 * @param data 압축할 문자열
 * @returns gzip으로 압축된 바이트 배열
 */
export async function compress(data: string): Promise<Uint8Array> {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(data));
      controller.close();
    },
  }).pipeThrough(new CompressionStream('gzip'));

  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * gzip으로 압축된 데이터를 문자열로 해제합니다.
 *
 * @param data 압축된 바이트 배열
 * @returns 압축 해제된 문자열
 */
export async function decompress(data: Uint8Array): Promise<string> {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  }).pipeThrough(new DecompressionStream('gzip'));

  return new Response(stream).text();
}
