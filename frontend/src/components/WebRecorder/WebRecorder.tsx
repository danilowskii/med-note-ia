import { useState, useRef } from "react";
import Button from "../Button";
import { MixAudioContext } from "../../utils/Context/AudioContext.ts";
import Transcription from "../Transcription";

type Props = {
  appointmentType: "presential" | "online";
};

export default function WebRecorder({ appointmentType }: Props) {
  //para renderizar tela de transcricao
  const [showTranscription, setShowTranscription] = useState(false);
  //botoes de controle
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  //URL do audio gravado
  const [audioURL, setAudioURL] = useState<string | null>(null);
  //gravaçao da tela e chunks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  //chunks
  const audioChunksRef = useRef<Blob[]>([]);
  //microfone e audio da janela
  const micStreamRef = useRef<MediaStream | null>(null);
  const windowStreamRef = useRef<MediaStream | null>(null);
  //websocket props para transcricao
  const wsRef = useRef<WebSocket | null>(null);

  const startRecording = async () => {
    console.log("== INICIANDO GRAVAÇÃO ==");
    try {
      console.log("PASSO 1: appointmentType =", appointmentType);
      let micStream: MediaStream | null = null;
      let windowStream: MediaStream | null = null;
      let finalStream: MediaStream | null = null;

      // para presencial, só mic do usuario
      if (appointmentType === "presential") {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        finalStream = micStream;
      }

      // para teleconsulta, mic do usuario + audio da aba
      if (appointmentType === "online") {
        windowStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true, // obrigatório p/ Chrome liberar o áudio da aba
        });
        // checa se aba esta enviando audio corretamente
        if (windowStream.getAudioTracks().length === 0) {
          throw new Error(
            "A aba selecionada não envia áudio. Para consulta online, escolha o Meet ou outra plataforma de reuniões."
          );
        }

        // captura o audio do mic
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // mistura os dois audios, se houver

        const mixedAudio = await MixAudioContext(windowStream, micStream);

        // somente audio mixado
        finalStream = new MediaStream([...mixedAudio.getAudioTracks()]);
      }
      // avalia se a gravacao foi montada certo
      if (!finalStream) throw new Error("Falha ao montar stream final.");

      // salva streams
      micStreamRef.current = micStream;
      windowStreamRef.current = windowStream;

      // websocket pra envio da transcrição (add condicional url depois)
      wsRef.current = new WebSocket("ws://localhost:8000/stream");
      wsRef.current.binaryType = "arraybuffer";
      // avisa quando conectar
      wsRef.current.onopen = () => {
        console.log("Websocket conectado para transcrição.");
      };

      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      // reseta chunks
      audioChunksRef.current = [];

      // chunks enviados em tempo real para groq
      mediaRecorder.ondataavailable = async (ev: BlobEvent) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
          // cria e envia buff para websocket
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const buf = await ev.data.arrayBuffer();
            wsRef.current.send(buf);
          }
        }
      };
      // quando para, gera o arquivo final local
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        // parar streams
        micStreamRef.current?.getTracks().forEach((t) => t.stop());
        windowStreamRef.current?.getTracks().forEach((t) => t.stop());
        // para websocket
        wsRef.current?.close();
      };

      mediaRecorder.start(1000); //chunks a cada 1s p/ transcricao
      setRecording(true);
      setPaused(false);
      //renderiza o component transcription
      setShowTranscription(true);
    } catch (err) {
      console.error(err);
      alert("É necessário permitir o uso do microfone e da captura de tela.");
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
    <div className="flex flex-col justify-center items-center gap-4">
      {!recording && !showTranscription && (
        <Button
          variant="primary"
          onClick={startRecording}
          className="px-3 py-2 bg-green-600 hover:bg-green-800 text-white rounded"
        >
          ⏺ Iniciar Gravação
        </Button>
      )}

      {showTranscription && (
        <Transcription
          appointmentType={appointmentType}
          webSocket={wsRef.current} //envia o ref
          recording={recording} //envia o recording true or false
          paused={paused} //envia o paused true or false
          audioURL={audioURL} //envia o audiourl string
          onPause={pauseRecording} //envia a func pauseRecording
          onResume={resumeRecording} //envia a func resumeRecording
          onStop={stopRecording} //envia a func stopRecording
        />
      )}
    </div>
  );
}
