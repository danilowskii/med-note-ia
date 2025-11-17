export async function MixAudioContext(
  windowStream: MediaStream,
  micStream: MediaStream
): Promise<MediaStream> {
  const audioContext = new AudioContext({ sampleRate: 48000 });

  const desktopSource = audioContext.createMediaStreamSource(windowStream);
  const micSource = audioContext.createMediaStreamSource(micStream);

  //destino final mixado
  const destination = audioContext.createMediaStreamDestination();

  desktopSource.connect(destination);
  micSource.connect(destination);

  return destination.stream;
}
