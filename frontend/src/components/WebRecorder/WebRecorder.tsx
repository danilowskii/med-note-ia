import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { MixAudioContext } from "../../utils/Context/AudioContext.ts";
import Transcription from "../Transcription";
import api from "../../Services/api.ts";
import { float32ToWav } from "../../utils/float32ToWav.ts";

type Props = {
  appointmentType: "presential" | "online";
};

export default function WebRecorder({ appointmentType }: Props) {
  const navigate = useNavigate();
  //para renderizar tela de transcricao
  const [showTranscription, setShowTranscription] = useState(false);
  //botoes de controle
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  //URL do audio gravado
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
          video: true, // obrigatório p/ chrome liberar o áudio da aba
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
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      // reseta chunks
      audioChunksRef.current = [];

      // chunks enviados em tempo real para groq
      mediaRecorder.ondataavailable = async (ev: BlobEvent) => {
        if (ev.data.size > 0) {
          // adiciona ao array de chunks
          audioChunksRef.current.push(ev.data);

          // envia para WS se estiver aberto
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(ev.data);
          }
        }
      };
      // quando para, gera o arquivo final local
      mediaRecorder.onstop = () => {
        const handleStop = async () => {
          try {
            // cria blob do áudio
            const blob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });

            /*const arrayBuffer = await blob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const wavBlob = float32ToWav(audioBuffer);*/

            // envia para backend
            const formData = new FormData();
            formData.append("audio", blob, "final_audio.webm");
            await api.post("/transcribe", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            // parar streams
            micStreamRef.current?.getTracks().forEach((t) => t.stop());
            windowStreamRef.current?.getTracks().forEach((t) => t.stop());

            // envia finish pelo websocket ou fallback
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: "finish" }));
            } else {
              console.warn(
                "WebSocket fechado, usando fallback via /transcribe."
              );

              const fallbackBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
              });
              const fallbackFormData = new FormData();
              fallbackFormData.append(
                "audio",
                fallbackBlob,
                "final_audio.webm"
              );

              try {
                const resp = await api.post("/transcribe", fallbackFormData);
                console.log("Fallback transcrição completa:", resp.data);

                navigate("/transcricao", {
                  state: { websocket: wsRef.current },
                });
              } catch (err) {
                console.error("Erro no fallback de transcrição:", err);
              }
            }
          } catch (err) {
            console.error("Erro ao processar áudio:", err);
          }
        };

        handleStop();
      };

      mediaRecorder.start(3500); //chunks a cada 3.5s p/ transcricao
      setRecording(true);
      setPaused(false);
      //renderiza o component transcription
      setShowTranscription(true);
    } catch (err) {
      console.error(err);
      alert("É necessário permitir o uso do microfone e da captura de tela.");
    }
  };

  const stopRecording = async () => {
    try {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      setPaused(false);
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
    }
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
          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded"
        >
          <span className="mr-1">⏺</span> Iniciar Gravação
        </Button>
      )}
      <div className="absolute top-8 md:w-[55%] lg:w-[60%] max-w-[1080px] w-[81%] ">
        {showTranscription && (
          <Transcription
            appointmentType={appointmentType}
            webSocket={wsRef.current} //envia o ref
            recording={recording} //envia o recording true or false
            paused={paused} //envia o paused true or false
            //envia o audiourl string
            onPause={pauseRecording} //envia a func pauseRecording
            onResume={resumeRecording} //envia a func resumeRecording
            onStop={stopRecording} //envia a func stopRecording
          />
        )}
      </div>
    </div>
  );
}
