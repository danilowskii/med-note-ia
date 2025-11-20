export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);

  // cabeçalho WAV
  let offset = 0;
  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
  };

  writeString("RIFF");
  view.setUint32(offset, length - 8, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2; // PCM
  view.setUint16(offset, numOfChan, true);
  offset += 2;
  view.setUint32(offset, buffer.sampleRate, true);
  offset += 4;
  view.setUint32(offset, buffer.sampleRate * numOfChan * 2, true);
  offset += 4;
  view.setUint16(offset, numOfChan * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, length - offset - 4, true);
  offset += 4;

  // grava os samples
  const interleaved = new Float32Array(buffer.length * numOfChan);
  for (let channel = 0; channel < numOfChan; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      interleaved[i * numOfChan + channel] = data[i];
    }
  }

  let pos = offset;
  for (let i = 0; i < interleaved.length; i++) {
    const sample = Math.max(-1, Math.min(1, interleaved[i]));
    view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    pos += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}
