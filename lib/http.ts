export async function readJson(body: ReadableStream<Uint8Array> | null, limit: number): Promise<unknown> {
  const reader = body?.getReader();
  if (!reader) throw new Error("Missing body");
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  try {
    for (;;) {
      const {done,value} = await reader.read();
      if (done) return JSON.parse(text + decoder.decode());
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error("Request too large");
      }
      text += decoder.decode(value,{stream:true});
    }
  } finally {
    reader.releaseLock();
  }
}
