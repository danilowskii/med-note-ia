import medNoteLogo from "../../assets/medNoteLogo.png";
import clock from "../../assets/clock.png";
import info from "../../assets/info.png";
import Lottie from "lottie-react";
import play from "../../assets/play.json";
import { useState } from "react";
import arrow from "../../assets/arrow.png";

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false);

  type MyHistory = {
    id: number;
    title: string;
    date: string;
    content: string;
  };

  const fakeHistories: MyHistory[] = [
    {
      id: 1,
      title: "Cefaleia",
      date: "2023-10-01",
      content: "Discussão sobre sintomas de dor de cabeça.",
    },
    {
      id: 2,
      title: "Hipertensão",
      date: "2023-10-05",
      content: "Análise dos níveis de pressão arterial.",
    },
    {
      id: 3,
      title: "Diabetes",
      date: "2023-10-10",
      content: "Revisão dos níveis de glicose no sangue.",
    },
    {
      id: 4,
      title: "Cefaleia",
      date: "2023-10-01",
      content: "Discussão sobre sintomas de dor de cabeça.",
    },
    {
      id: 5,
      title: "Hipertensão",
      date: "2023-10-05",
      content: "Análise dos níveis de pressão arterial.",
    },
    {
      id: 6,
      title: "Diabetes",
      date: "2023-10-10",
      content: "Revisão dos níveis de glicose no sangue.",
    },
    {
      id: 7,
      title: "Cefaleia",
      date: "2023-10-01",
      content: "Discussão sobre sintomas de dor de cabeça.",
    },
    {
      id: 8,
      title: "Hipertensão",
      date: "2023-10-05",
      content: "Análise dos níveis de pressão arterial.",
    },
    {
      id: 9,
      title: "Diabetes",
      date: "2023-10-10",
      content: "Revisão dos níveis de glicose no sangue.",
    },
    {
      id: 10,
      title: "Cefaleia",
      date: "2023-10-01",
      content: "Discussão sobre sintomas de dor de cabeça.",
    },
    {
      id: 11,
      title: "Hipertensão",
      date: "2023-10-05",
      content: "Análise dos níveis de pressão arterial.",
    },
    {
      id: 12,
      title: "Diabetes melittus tipo 2 com causa desconhecida",
      date: "2023-10-10",
      content: "Revisão dos níveis de glicose no sangue.",
    },
  ];
  return (
    <section className="flex flex-row items-center h-screen ">
      <button
        className="md:hidden my-auto order-2 bg-[#136901]/60 flex items-center  justify-center p-1 rounded-r-full h-20"
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? (
          <img src={arrow} className="w-8 h-8" />
        ) : (
          <img src={arrow} className="w-8 h-8 rotate-180" />
        )}
      </button>

      <div
        className={`p-4 flex flex-col overflow-hidden font-serif text-white/90 
        h-screen w-4/5 md:w-2/6 lg:w-1/5 bg-gradient-to-b from-[#136901]/80 
        via-[#136901]/60 to-[#136901]/80 transform transition-transform 
        duration-500 ease-out 
        ${openMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h3 className="flex gap-2 items-center md:text-lg sticky pb-4 top-0">
          <img className="w-4 h-4" src={clock} alt="" /> Histórico de consultas
        </h3>
        <div className="flex flex-col gap-0 h-[50%]  border-b overflow-y-auto">
          {fakeHistories.length > 0 ? (
            [...fakeHistories].reverse().map((history) => (
              <div key={history.id} className="p-1">
                <div className="group flex flex-row items-center justify-between hover:bg-[#8bf265] hover:text-black/70 hover:shadow-md p-3 cursor-pointer rounded-lg">
                  <div className="flex flex-col w-11/12">
                    <h4 className="text-base font-bold line-clamp-1">
                      {history.title}
                    </h4>
                    <p className="text-sm font-normal">{history.date}</p>
                  </div>
                  <img
                    className="w-5 h-auto brightness-[.3] hidden group-hover:block"
                    src={info}
                    alt=""
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-col h-full">
              <p className="text-white/80 p-3 text-xl text-center">
                Inicie uma consulta agora.
              </p>
              <div className="items-center justify-center flex ">
                <Lottie
                  animationData={play}
                  className="lg:w-32 md:w-24 cursor-pointer"
                  loop={true}
                />
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0  flex  items-end justify-center">
          <img className="w-56 md:w-72 " src={medNoteLogo}></img>
        </div>
      </div>
    </section>
  );
}
