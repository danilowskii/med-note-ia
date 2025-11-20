import { useState } from "react";
import Specialities from "../SpecialityModal";
import WebRecorder from "../WebRecorder";

export default function Initial() {
  const [aba, setAba] = useState<"init" | "intro">("init");
  const [appointment, setAppointment] = useState<"presential" | "online">(
    "presential"
  );

  return (
    <section className="flex justify-center items-center flex-col h-screen bg-slate-800">
      <div className="w-[80%] max-w-[1080px] h-screen pt-10 flex flex-col gap-6">
        {/* ABAS */}
        <div className="flex justify-center w-full mb-4">
          <div className="flex border text-base border-slate-200/50 rounded-full overflow-hidden">
            <button
              className={`flex-1 px-10 py-1 text-white font-medium transition-colors whitespace-nowrap ${
                aba === "init"
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-500"
              }`}
              onClick={() => setAba("init")}
            >
              Iniciar
            </button>
            <button
              className={`flex-1 px-6 text-white font-medium transition-colors whitespace-nowrap ${
                aba === "intro"
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-500"
              }`}
              onClick={() => setAba("intro")}
            >
              Como usar?
            </button>
          </div>
        </div>

        {/* CONTEÚDO */}
        {aba === "init" ? (
          <div className="flex flex-col justify-center items-center gap-6 p-4 bg-white rounded-xl shadow-md">
            <p className="text-slate-900 border-b border-b-slate-900 pb-2 w-full font-semibold text-center text-xl">
              Vamos começar
            </p>

            {/* Tipo de consulta */}
            <p className="text-slate-800">
              Selecione a modalidade da consulta:
            </p>

            <div className="flex flex-col">
              <div className="flex gap-4 flex-row justify-center">
                <button
                  className={`px-3 py-1 text-sm md:text-base md:px-4 md:py-2 rounded font-medium transition-colors ${
                    appointment === "presential"
                      ? "bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      : "text-slate-800 border border-slate-900 hover:bg-slate-200"
                  }`}
                  onClick={() => setAppointment("presential")}
                >
                  Presencial
                </button>

                <button
                  className={`px-3 py-1 text-sm md:text-base md:px-4 md:py-2 rounded font-medium transition-colors ${
                    appointment === "online"
                      ? "bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      : "text-slate-800 border border-slate-900 hover:bg-slate-200"
                  }`}
                  onClick={() => setAppointment("online")}
                >
                  Teleconsulta
                </button>
              </div>
              {appointment === "online" && (
                <p className="text-center text-sm p-3 mt-4 rounded border border-slate-900 bg-slate-300">
                  Certifique-se de selecionar uma guia e habilitar o
                  compartilhamento do áudio desta guia.
                </p>
              )}
            </div>

            {/* Especialidades */}
            <div className="w-full">
              <h3 className="text-slate-900 text-center pb-2">
                Selecione a sua especialização:
              </h3>
              <Specialities />
            </div>

            {/* Aviso para microfone */}
            <p className="p-4 border mt-4 border-slate-900 bg-slate-300 text-slate-900 text-sm rounded text-center">
              Lembrete: Antes de iniciar, ative a permissão do microfone no seu
              navegador para que a consulta possa ser gravada.
            </p>
            <WebRecorder appointmentType={appointment} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center p-6 bg-white rounded-xl shadow-md w-full gap-4">
            <p className="text-slate-900 font-semibold text-center text-xl">
              Tutorial de uso
            </p>
            <p className="text-slate-900 text-center">
              Aqui você pode colocar instruções sobre como utilizar a consulta
              online ou presencial.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
