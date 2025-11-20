// src/utils/float32ToWav.ts
export function float32ToWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;

  const buffers = [];
  let length = audioBuffer.length * numChannels * 2 + 44; // 44 bytes header

  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  // write WAV header
  let offset = 0;
  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
  }

  writeString("RIFF");
  view.setUint32(offset, length - 8, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4; // subchunk1Size
  view.setUint16(offset, format, true);
  offset += 2;
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, (sampleRate * numChannels * bitsPerSample) / 8, true);
  offset += 4;
  view.setUint16(offset, (numChannels * bitsPerSample) / 8, true);
  offset += 2;
  view.setUint16(offset, bitsPerSample, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, length - offset - 4, true);
  offset += 4;

  // write interleaved PCM samples
  const interleaved = new Int16Array(audioBuffer.length * numChannels);
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = audioBuffer.getChannelData(ch)[i];
      sample = Math.max(-1, Math.min(1, sample));
      interleaved[i * numChannels + ch] =
        sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }
  }

  for (let i = 0; i < interleaved.length; i++) {
    view.setInt16(offset, interleaved[i], true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}
