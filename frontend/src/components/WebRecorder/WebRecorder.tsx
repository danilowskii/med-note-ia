import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { MixAudioContext } from "../../utils/Context/AudioContext.ts";
import Transcription from "../Transcription";
import api from "../../Services/api.ts";

type Props = {
  appointmentType: "presential" | "online";
  speciality: string | null;
};

export default function WebRecorder({ appointmentType, speciality }: Props) {
  const wSocketUrl = import.meta.env.VITE_WS_URL;
  const navigate = useNavigate();
  //para anotações
  const [notes, setNotes] = useState("");
  //para renderizar tela de transcricao
  const [showTranscription, setShowTranscription] = useState(false);
  //botoes de controle
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const windowStreamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const startRecording = async () => {
    console.log("== INICIANDO GRAVAÇÃO ==");
    try {
      console.log("PASSO 1: appointmentType =", appointmentType);
      let micStream: MediaStream | null = null;
      let windowStream: MediaStream | null = null;
      let finalStream: MediaStream | null = null;

      if (appointmentType === "presential") {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        finalStream = micStream;
      }

      if (appointmentType === "online") {
        windowStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true,
        });
        if (windowStream.getAudioTracks().length === 0) {
          throw new Error("A aba selecionada não envia áudio.");
        }
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mixedAudio = await MixAudioContext(windowStream, micStream);
        finalStream = new MediaStream([...mixedAudio.getAudioTracks()]);
      }

      if (!finalStream) throw new Error("Falha ao montar stream final.");

      micStreamRef.current = micStream;
      windowStreamRef.current = windowStream;

      wsRef.current = new WebSocket(wSocketUrl);
      wsRef.current.binaryType = "arraybuffer";
      wsRef.current.onopen = () => {
        console.log("Websocket conectado para transcrição.");
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket fechado — ignorando evento de stop automático.");
      };

      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = async (ev: BlobEvent) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(ev.data);
          }
        }
      };

      let stopAlreadyCalled = false;
      mediaRecorder.onstop = () => {
        if (stopAlreadyCalled) {
          console.log("stopAlready:", stopAlreadyCalled);
        }
        stopAlreadyCalled = true;
        const handleStop = async () => {
          setIsProcessing(true);
          try {
            micStreamRef.current?.getTracks().forEach((t) => t.stop());
            windowStreamRef.current?.getTracks().forEach((t) => t.stop());
            if (wsRef.current) wsRef.current.close();

            const blob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            const formData = new FormData();
            formData.append("audio", blob, "final_audio.webm");

            // 3. Transcrever
            console.log("Enviando áudio para transcrição...");
            const transResponse = await api.post("/transcribe", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            const finalTranscript = transResponse.data.transcript;

            console.log("Gerando prontuário com IA...");
            const payload = {
              transcript: finalTranscript,
              appointmentType: appointmentType,
              speciality: speciality || "Clínica Geral",
              appointmentNotes: notes,
            };

            const diagResponse = await api.post("/diagnose", payload);

            const reportCompleto = diagResponse.data.report.diagnose;

            navigate("/diagnostico", {
              state: {
                reportData: reportCompleto,
              },
            });
          } catch (error) {
            console.error("Erro no processo final:", error);
            alert("Erro ao processar consulta. Verifique o console.");
            setIsProcessing(false);
          }
        };

        handleStop();
      };

      mediaRecorder.start(3500);
      setRecording(true);
      setPaused(false);
      setShowTranscription(true);
    } catch (err) {
      console.error(err);
      alert("É necessário permitir o uso do microfone.");
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
    <div className="flex justify-center w-full h-full">
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/90 z-[60] flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Finalizando Consulta...</h2>
          <p className="text-slate-300 text-lg">
            A IA está estruturando o prontuário médico.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Isso pode levar alguns segundos.
          </p>
        </div>
      )}

      {!recording && !showTranscription && (
        <Button
          variant="primary"
          onClick={startRecording}
          className="px-3 py-2 group bg-slate-900 hover:bg-slate-800 text-white rounded"
        >
          <span className="mr-1 group-hover:text-red-600">⏺</span> Iniciar
          Gravação
        </Button>
      )}

      <div className="absolute z-50 top-8 md:w-[55%] lg:w-[60%] max-w-[1080px] w-[81%] ">
        {showTranscription && (
          <Transcription
            appointmentType={appointmentType}
            speciality={speciality}
            webSocket={wsRef.current}
            recording={recording}
            paused={paused}
            notes={notes}
            onChangeNotes={setNotes}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
          />
        )}
      </div>
    </div>
  );
}
