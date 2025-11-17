import { useState, useRef } from "react";
import Button from "../Button";
import { MixAudioContext } from "../../utils/Context/AudioContext.ts";

type Props = {
  type: "presential" | "online";
};

export default function WebRecorder({ type }: Props) {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const micStreamRef = useRef<MediaStream | null>(null);
  const windowStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      let micStream: MediaStream | null = null;
      let windowStream: MediaStream | null = null;

      let finalStream: MediaStream | null = null;

      // ===== PRESENCIAL =====
      if (type === "presential") {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        finalStream = micStream;
      }

      // ===== ONLINE =====
      if (type === "online") {
        windowStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true, // obrigatório p/ Chrome liberar o áudio da aba
        });

        if (windowStream.getAudioTracks().length === 0) {
          throw new Error(
            "A aba selecionada não envia áudio. Para consulta online, escolha o Meet."
          );
        }

        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mixedAudio = await MixAudioContext(windowStream, micStream);

        // AUDIO + VIDEO DA TELA
        finalStream = new MediaStream([...mixedAudio.getAudioTracks()]);
      }

      if (!finalStream) throw new Error("Falha ao montar stream final.");

      // salvar streams
      micStreamRef.current = micStream;
      windowStreamRef.current = windowStream;

      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        // parar streams
        micStreamRef.current?.getTracks().forEach((t) => t.stop());
        windowStreamRef.current?.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setPaused(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao iniciar gravação.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setPaused(false);
  };

  return (
    <div>
      {!recording && (
        <Button
          variant="primary"
          onClick={startRecording}
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          Iniciar Gravação
        </Button>
      )}

      {recording && !paused && (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={pauseRecording}
            className="px-3 py-2 bg-yellow-500 text-white rounded"
          >
            Pausar
          </Button>

          <Button
            variant="secondary"
            onClick={stopRecording}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Parar
          </Button>
        </div>
      )}

      {recording && paused && (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={resumeRecording}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Retomar
          </Button>

          <Button
            variant="secondary"
            onClick={stopRecording}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Parar
          </Button>
        </div>
      )}

      {audioURL && <audio controls src={audioURL}></audio>}
    </div>
  );
}
