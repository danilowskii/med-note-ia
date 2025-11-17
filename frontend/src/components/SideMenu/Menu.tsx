import medNoteLogo from "../../assets/medNoteLogo.png";
import clock from "../../assets/clock.png";
import info from "../../assets/info.png";
import Lottie from "lottie-react";
import play from "../../assets/play.json";
import { useState } from "react";
import arrow from "../../assets/arrow.png";
import Button from "../Button";

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false);

  type MyHistory = {
    id: number;
    title: string;
    date: string;
    content: string;
  };

  const fakeHistories: MyHistory[] = [
    { id: 1, title: "Cefaleia", date: "2023-10-01", content: "" },
    { id: 2, title: "Hipertensão", date: "2023-10-05", content: "" },
    { id: 3, title: "Diabetes", date: "2023-10-10", content: "" },
    { id: 4, title: "Cefaleia", date: "2023-10-01", content: "" },
    { id: 5, title: "Hipertensão", date: "2023-10-05", content: "" },
    { id: 6, title: "Diabetes", date: "2023-10-10", content: "" },
    { id: 7, title: "Cefaleia", date: "2023-10-01", content: "" },
    { id: 8, title: "Hipertensão", date: "2023-10-05", content: "" },
    { id: 9, title: "Diabetes", date: "2023-10-10", content: "" },
    { id: 10, title: "Cefaleia", date: "2023-10-01", content: "" },
    { id: 11, title: "Hipertensão", date: "2023-10-05", content: "" },
    {
      id: 12,
      title: "Diabetes tipo 2 melittus com asma",
      date: "2023-10-10",
      content: "",
    },
  ];

  return (
    <section className="h-screen rounded-r-lg flex items-center overflow-hidden">
      {/* CONTAINER QUE SE MOVE JUNTO (MENU + BOTÃO) */}
      <div
        className={`flex transition-transform duration-300 ease-out md:translate-x-0
      ${openMenu ? "translate-x-0" : "-translate-x-[90%]"}
    `}
      >
        {/* MENU */}
        <div
          className="p-4 flex flex-col overflow-hidden text-green-50 
        h-[calc(100vh-50px)] rounded-r-2xl w-[280px] md:w-[300px] lg:w-[320px]
        bg-gradient-to-b from-green-700 via-green-600 to-green-700"
        >
          <h3 className="flex gap-2 items-center md:text-lg sticky pb-4 top-0">
            <img className="w-4 h-4" src={clock} alt="" /> Histórico de
            consultas
          </h3>

          <div className="flex flex-col gap-0 h-[50%] border-b border-green-400 overflow-y-auto">
            {fakeHistories.length > 0 ? (
              [...fakeHistories].reverse().map((history) => (
                <div key={history.id} className="p-1">
                  <div
                    className="group flex flex-row items-center justify-between 
                        hover:bg-green-400 hover:text-black/80 hover:shadow-md p-3 
                        cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="flex flex-col w-11/12">
                      <h4 className="text-base font-bold line-clamp-1">
                        {history.title}
                      </h4>
                      <p className="text-xs font-normal font-sans">
                        {history.date}
                      </p>
                    </div>
                    <img
                      className="w-5 h-auto brightness-[0.1] hidden group-hover:block"
                      src={info}
                      alt=""
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center flex-col h-full">
                <p className="text-green-100 p-3 text-xl text-center">
                  Inicie uma consulta agora.
                </p>

                <div className="items-center justify-center flex">
                  <Button
                    variant="none"
                    onClick={() => console.log("cliquei no play")}
                    className="!bg-none !border-none"
                  >
                    <Lottie
                      animationData={play}
                      className="lg:w-32 md:w-24 cursor-pointer"
                      loop
                    />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full items-center pt-4">
            <Button
              onClick={() => console.log("cliquei no Iniciar consulta")}
              variant="primary"
              className="w-64 md:w-72 bg-green-200 hover:bg-green-800 text-green-900 hover:text-white"
            >
              INICIAR CONSULTA
            </Button>
            <Button
              onClick={() => console.log("cliquei no Dr. IAGO")}
              variant="secondary"
              className="w-64 md:w-72  bg-green-600 hover:bg-green-700"
            >
              PERGUNTE AO DR.{" "}
              <span className="bg-green-900 p-1 rounded text-white">IA</span>
              GO
            </Button>
          </div>

          <div className="flex items-end justify-center">
            <img className="absolute w-56 md:w-72 bottom-5" src={medNoteLogo} />
          </div>
        </div>

        {/* BOTÃO QUE SE MOVE JUNTO */}
        <button
          className="md:hidden bg-green-600 flex items-center justify-center p-1 rounded-r-full h-20 my-auto"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <img
            src={arrow}
            className={`w-8 h-8 transition-transform duration-300 ease-out
          ${openMenu ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </section>
  );
}
