import { useState } from "react";
import Specialities from "../SpecialityModal";
import WebRecorder from "../WebRecorder";
import Tutorial from "../Tutorial";

export default function Initial() {
  const [aba, setAba] = useState<"init" | "intro">("init");
  const [appointment, setAppointment] = useState<"presential" | "online">(
    "presential"
  );
  const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(
    null
  );

  return (
    <section className="h-screen flex justify-center items-center flex-col min-h-screen bg-slate-800 pb-10 font-serif">
      <div className="w-[90%] max-w-[1100px] min-h-screen pt-10 flex flex-col gap-8">
        {/* ABAS */}
        <div className="flex justify-center w-full mb-4">
          <div className="flex border border-slate-600 rounded-full overflow-hidden bg-slate-900/40 backdrop-blur shadow-lg">
            <button
              className={`px-10 py-2 text-sm md:text-base font-medium transition-all whitespace-nowrap
                ${
                  aba === "init"
                    ? "bg-slate-700 text-white shadow-inner"
                    : "text-slate-300 hover:bg-slate-700/40"
                }`}
              onClick={() => setAba("init")}
            >
              Iniciar
            </button>

            <button
              className={`px-6 py-2 text-sm md:text-base font-medium transition-all whitespace-nowrap
                ${
                  aba === "intro"
                    ? "bg-slate-700 text-white shadow-inner"
                    : "text-slate-300 hover:bg-slate-700/40"
                }`}
              onClick={() => setAba("intro")}
            >
              Como usar?
            </button>
          </div>
        </div>

        {/* CONTEÚDO */}
        {aba === "init" ? (
          <div className="flex flex-col justify-center items-center gap-6 p-6 bg-slate-900/40 backdrop-blur border border-slate-700 rounded-xl shadow-xl animate-fade-in">
            <p className="text-slate-100 pb-3 border-b border-slate-700 w-full font-bold text-center text-2xl tracking-wide">
              Vamos começar
            </p>

            {/* Tipo de consulta */}
            <p className="text-slate-300 text-lg">
              Selecione a modalidade da consulta:
            </p>

            <div className="flex flex-col items-center">
              <div className="flex gap-4 flex-row justify-center">
                <button
                  className={`px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-all shadow 
                    ${
                      appointment === "presential"
                        ? "bg-slate-100 text-black hover:bg-slate-200"
                        : "text-slate-300 border border-slate-600 hover:bg-slate-700"
                    }`}
                  onClick={() => setAppointment("presential")}
                >
                  Presencial
                </button>

                <button
                  className={`px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-all shadow
                    ${
                      appointment === "online"
                        ? "bg-slate-100 text-black hover:bg-slate-200"
                        : "text-slate-300 border border-slate-600 hover:bg-slate-700"
                    }`}
                  onClick={() => setAppointment("online")}
                >
                  Teleconsulta
                </button>
              </div>

              {appointment === "online" && (
                <p className="text-center text-sm p-3 mt-4 rounded border border-slate-600 bg-slate-700/40 text-slate-200 w-full max-w-[400px] shadow">
                  Certifique-se de selecionar uma guia e habilitar o
                  compartilhamento do áudio desta guia.
                </p>
              )}
            </div>

            {/* Especialidades */}
            <div className="w-full relative z-50">
              <h3 className="text-slate-200 text-center pb-2 text-lg font-medium">
                Selecione a sua especialização:
              </h3>
              <div className="absolute bottom-full top-14 left-0 w-full">
                <Specialities
                  selected={selectedSpeciality}
                  onSelect={setSelectedSpeciality}
                />
              </div>
            </div>

            {/* Aviso de microfone */}
            <div className="relative mt-10 p-4 border border-slate-700 bg-slate-800/60 text-slate-200 text-sm rounded-lg text-center shadow-md">
              <div className="absolute top-0 left-0 bg-blue-500 h-full w-1.5 rounded-l"></div>
              Lembrete: Antes de iniciar, ative a permissão do microfone no seu
              navegador para que a consulta possa ser gravada.
            </div>

            <WebRecorder
              appointmentType={appointment}
              speciality={selectedSpeciality}
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-6 p-6 bg-slate-900/40 backdrop-blur border border-slate-700 rounded-xl shadow-xl animate-fade-in">
            <p className="text-slate-100 pb-3 border-b border-slate-700 w-full font-bold text-center text-2xl tracking-wide">
              Tutorial de uso
            </p>
            <Tutorial />
          </div>
        )}
      </div>
    </section>
  );
}
