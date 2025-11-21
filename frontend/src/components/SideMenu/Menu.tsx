import medNoteLogo from "../../assets/medNoteLogo.png";
import clock from "../../assets/clock.png";
import info from "../../assets/info.png";
import Lottie from "lottie-react";
import play from "../../assets/play.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../../assets/arrow.png";
import Button from "../Button";
import stars from "../../assets/stars.png";
import api from "../../Services/api";
import ContextualChat from "../ContextualChat";

interface Report {
  _id: string;
  createdAt: string;
  diagnose?: {
    meta?: {
      especialidade?: string;
      tipoConsulta?: string;
    };
    data?: {
      titulo?: string;
      resumo_tecnico?: string;
    };
  };
}

interface MenuProps {
  reportData?: {
    data?: {
      resumo_tecnico: string;
      hipoteses_diagnosticas: any;
    };
    meta?: object;
  };
}

export default function Menu({ reportData }: MenuProps) {
  const [openChat, setOpenChat] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await api.get("/reports");
        setReports(response.data.reports);
      } catch (error) {
        console.error("Erro ao buscar consultas.", error);
      }
    };
    getReports();
  }, []);

  return (
    <section className="relative flex pt-6">
      {/* MENU FIXO NO MOBILE, RELATIVE NO DESKTOP */}
      <div
        className={`flex transition-transform duration-300 ease-out md:translate-x-0
          ${openMenu ? "translate-x-0" : "-translate-x-[88%]"}
          fixed md:relative top-0 left-0 z-50
        `}
      >
        {/* MENU */}
        <div className="p-4 flex flex-col overflow-hidden text-white h-screen md:h-[calc(100vh-50px)] rounded-r-2xl w-[280px] md:w-[300px] lg:w-[320px] bg-slate-900/95 backdrop-blur-sm border border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
          {/* TÍTULO */}
          <h3 className="flex gap-2 items-center md:text-lg pb-4 border-b border-slate-700 text-slate-300 font-semibold">
            <img className="w-4 h-4 opacity-80" src={clock} alt="" />
            Histórico de consultas
          </h3>

          {/* LISTA DE RELATÓRIOS */}
          <div className="flex flex-col gap-0 h-[50%] border-b border-slate-700/60 overflow-y-auto mt-2 pr-1">
            {reports.length > 0 ? (
              [...reports].reverse().map((report) => (
                <div key={report._id} className="p-1">
                  <div
                    onClick={() =>
                      navigate("/diagnostico", {
                        state: { reportData: report.diagnose },
                      })
                    }
                    className="group flex flex-row items-center justify-between
                      bg-slate-800/40 border border-slate-700/60
                      hover:bg-slate-700/50 hover:border-slate-500
                      p-3 cursor-pointer rounded-lg transition-all duration-150 shadow-sm"
                  >
                    <div className="flex flex-col w-11/12">
                      <h4 className="text-base font-bold text-slate-200 group-hover:text-white line-clamp-1">
                        {report.diagnose?.data?.titulo}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans">
                        {new Date(report.createdAt).toLocaleDateString("pt-BR")}{" "}
                        •{" "}
                        {new Date(report.createdAt).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    <img
                      className="w-5 h-auto opacity-0 group-hover:opacity-80 transition-opacity"
                      src={info}
                      alt=""
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center flex-col h-full text-center">
                <p className="text-slate-300 p-3 text-lg">
                  Inicie uma consulta agora.
                </p>

                <Button
                  variant="none"
                  onClick={() => console.log("cliquei no play")}
                  className="!bg-none !border-none"
                >
                  <Lottie
                    animationData={play}
                    className="lg:w-28 md:w-24 cursor-default opacity-90 hover:opacity-100 transition-opacity"
                    loop
                  />
                </Button>
              </div>
            )}
          </div>

          {/* BOTÃO IAGO */}
          <div className="flex flex-col gap-3 w-full items-center pt-4">
            <Button
              onClick={() => setOpenChat(true)}
              variant="secondary"
              className="group w-64 flex flex-row items-center justify-center md:w-72
                shadow-lg bg-slate-200 text-gray-900/90 font-medium rounded-lg
                hover:bg-white hover:shadow-[0_0_10px] hover:shadow-white/40
                transition-all duration-200"
            >
              <img src={stars} className="w-5 animate-pulse h-5 mr-2" alt="" />
              Pergunte ao Dr.
              <span
                className="bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-600 
                  ml-1 px-1 rounded text-white font-bold"
              >
                IA
              </span>
              GO
            </Button>
          </div>

          {/* LOGO */}
          <div className="flex justify-center mt-8 relative">
            <img
              className="w-56 md:w-72 opacity-90 drop-shadow-lg"
              src={medNoteLogo}
            />
          </div>
        </div>

        {/* BOTÃO QUE SE MOVE JUNTO */}
        <button
          className="md:hidden bg-slate-900 border border-slate-700 flex items-center justify-center p-1 rounded-r-full h-20 my-auto shadow-lg z-60"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <img
            src={arrow}
            className={`w-8 h-8 transition-transform duration-300 ease-out
              ${openMenu ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* CHAT */}
      {openChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl shadow-lg relative flex flex-col gap-4">
            <button
              className="absolute top-10 right-10 text-white font-bold text-xl"
              onClick={() => setOpenChat(false)}
            >
              ✕
            </button>

            <ContextualChat
              transcript={reportData?.data?.resumo_tecnico || ""}
              diagnose={reportData?.data?.hipoteses_diagnosticas || ""}
            />
          </div>
        </div>
      )}
    </section>
  );
}
