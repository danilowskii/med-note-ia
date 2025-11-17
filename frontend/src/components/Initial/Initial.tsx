import { useState } from "react";
import Specialities from "../SpecialityModal";
import WebRecorder from "../WebRecorder";

export default function Initial() {
  const [aba, setAba] = useState<"init" | "intro">("init");
  const [appointment, setAppointment] = useState<"presential" | "online">(
    "presential"
  );

  return (
    <section className="flex justify-center items-center flex-col h-screen bg-green-100">
      <div className="w-[80%] max-w-[480px] h-[90%] flex flex-col gap-6">
        {/* ABAS */}
        <div className="flex justify-center w-full mb-4">
          <div className="flex border-2 text-sm border-green-600 rounded overflow-hidden">
            <button
              className={`flex-1 px-10 text-white font-medium transition-colors ${
                aba === "init"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-200 text-green-800 hover:bg-green-300"
              }`}
              onClick={() => setAba("init")}
            >
              Iniciar
            </button>
            <button
              className={`flex-1 px-10  text-white font-medium transition-colors ${
                aba === "intro"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-200 text-green-800 hover:bg-green-300"
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
            <p className="text-green-800 font-semibold text-center text-lg">
              Vamos começar sua consulta
            </p>

            {/* Tipo de consulta */}
            <div className="flex gap-4 flex-row justify-center">
              <button
                className={`px-3 py-1 text-sm md:text-base md:px-4 md:py-2 rounded font-medium transition-colors ${
                  appointment === "presential"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-200 text-green-800 hover:bg-green-300"
                }`}
                onClick={() => setAppointment("presential")}
              >
                Consulta presencial
              </button>
              <button
                className={`px-3 py-1 text-sm md:text-base md:px-4 md:py-2 rounded font-medium transition-colors ${
                  appointment === "online"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-200 text-green-800 hover:bg-green-300"
                }`}
                onClick={() => setAppointment("online")}
              >
                Consulta On-line
              </button>
            </div>

            {/* Especialidades */}
            <div className="w-full">
              <Specialities />
            </div>

            {/* Aviso do microfone */}
            <p className="p-4 border border-green-300 bg-green-100 text-green-800 text-sm rounded text-center">
              Por favor, antes de iniciar, ative a permissão do microfone no seu
              navegador para que a consulta possa ser gravada.
            </p>
            <WebRecorder type={appointment} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center p-6 bg-white rounded-xl shadow-md w-full gap-4">
            <p className="text-green-800 font-semibold text-center text-lg">
              Tutorial de uso
            </p>
            <p className="text-green-700 text-center">
              Aqui você pode colocar instruções sobre como utilizar a consulta
              online ou presencial.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
