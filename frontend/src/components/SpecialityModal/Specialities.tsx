import { useState } from "react";

interface SpecialitiesProps {
  selected: string | null;
  onSelect: (speciality: string | null) => void;
}

export default function Specialities({
  selected,
  onSelect,
}: SpecialitiesProps) {
  const [open, setOpen] = useState(false);

  const specialities: string[] = [
    "Angiologia",
    "Cardiologia",
    "Cirurgia Médica",
    "Clínica Médica",
    "Dermatologia",
    "Endocrinologia",
    "Gastroenterologia",
    "Geriatria",
    "Ginecologia",
    "Hematologia",
    "Infectologia",
    "Nefrologia",
    "Neurologia",
    "Nutrologia",
    "Oncologia",
    "Ortopedia",
    "Oftalmologia",
    "Otorrinolaringologia",
    "Pediatria",
    "Psiquiatria",
    "Reumatologia",
    "Urologia",
  ];

  return (
    <div className="flex flex-col items-center mx-auto justify-center w-full max-w-[500px] h-full">
      <div
        onClick={() => setOpen(!open)}
        className=" group flex justify-center cursor-pointer rounded-t-xl bg-slate-900 hover:bg-slate-800 w-full transition-colors "
      >
        <button className="relative px-2 py-1 md:px-3 md:py-2 bg-slate-900 text-white font-normal rounded shadow group-hover:bg-slate-800 transition-colors flex items-center justify-center w-1/2 max-w-xs">
          {selected && selected !== "Selecionar especialidade:" ? (
            <span className="flex items-center gap-2">
              <span
                onClick={() => {
                  setOpen(true);
                }}
                className="cursor-pointer md:text-base text-sm text-white hover:text-gray-200"
              >
                {selected}{" "}
                <span
                  onClick={() => {
                    onSelect(null);
                  }}
                  className="absolute right-2 md:right-4"
                >
                  ✕
                </span>
              </span>
            </span>
          ) : (
            "Selecionar especialidade:"
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="bg-slate-100 border-x border-slate-900 w-full rounded-t-none rounded-xl shadow-2xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
              Especialidades
            </h2>

            <div className="flex flex-wrap justify-center gap-3 max-h-[150px] md:max-h-[200px] py-2 border-t border-t-slate-900  overflow-y-auto px-2">
              {specialities.map((spe) => (
                <button
                  key={spe}
                  onClick={() => {
                    onSelect(spe);
                    setOpen(false);
                  }}
                  className={`px-3 py-1 md:text-base text-sm md:px-4 md:py-2 border border-slate-900 text-slate-900 hover:text-slate-900 rounded shadow hover:bg-slate-200 bg-slate-100 transition-colors`}
                >
                  {spe}
                </button>
              ))}
            </div>

            <button
              className="mt-6 py-2 bg-slate-900 text-white rounded-lg shadow hover:bg-slate-800 transition-colors w-full"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
