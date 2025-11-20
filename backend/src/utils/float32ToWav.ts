export function float32ToWav(
  float32Array: Float32Array,
  options: { sampleRate: number }
): Buffer {
  const sampleRate = options.sampleRate;
  const bufferLength = float32Array.length * 2; // 16-bit PCM
  const wavBuffer = Buffer.alloc(44 + bufferLength);

  let offset = 0;

  // RIFF header
  wavBuffer.write("RIFF", offset);
  offset += 4;
  wavBuffer.writeUInt32LE(36 + bufferLength, offset);
  offset += 4;
  wavBuffer.write("WAVE", offset);
  offset += 4;

  // fmt chunk
  wavBuffer.write("fmt ", offset);
  offset += 4;
  wavBuffer.writeUInt32LE(16, offset);
  offset += 4; // subchunk1 size
  wavBuffer.writeUInt16LE(1, offset);
  offset += 2; // PCM
  wavBuffer.writeUInt16LE(1, offset);
  offset += 2; // mono
  wavBuffer.writeUInt32LE(sampleRate, offset);
  offset += 4;
  wavBuffer.writeUInt32LE(sampleRate * 2, offset);
  offset += 4; // byte rate
  wavBuffer.writeUInt16LE(2, offset);
  offset += 2; // block align
  wavBuffer.writeUInt16LE(16, offset);
  offset += 2; // bits per sample

  // data chunk
  wavBuffer.write("data", offset);
  offset += 4;
  wavBuffer.writeUInt32LE(bufferLength, offset);
  offset += 4;

  // escreve os samples
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    s = s < 0 ? s * 0x8000 : s * 0x7fff;
    wavBuffer.writeInt16LE(s, offset);
  }

  return wavBuffer;
}
