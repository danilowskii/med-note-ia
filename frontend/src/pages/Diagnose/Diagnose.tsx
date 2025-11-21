import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../components/Button";
import Menu from "../../components/SideMenu";
import ChatCard from "../../components/ChatCard";
import ContextualChat from "../../components/ContextualChat";

export default function Diagnose() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openChat, setOpenChat] = useState(false);

  const { reportData } = location.state || {};

  if (!reportData) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white flex-col gap-4 font-sans">
        <p className="text-lg">Nenhum relatório encontrado.</p>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          className="bg-gray-700 px-5 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Voltar ao Início
        </Button>
      </div>
    );
  }

  const { meta, data } = reportData;

  return (
    <div className="h-screen flex flex-row bg-gray-900 font-sans overflow-hidden">
      {/* Menu Lateral */}
      <div className="fixed inset-0 md:relative z-50 w-fit md:block">
        <Menu reportData={reportData} />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 gap-6">
        {/* Cabeçalho */}
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-start border-b border-gray-700 pb-6">
            <div>
              <h1 className="text-3xl text-white font-bold capitalize">
                {data.titulo || "Relatório Médico"}
              </h1>
              <div className="text-gray-400 text-sm mt-1 flex flex-wrap gap-2">
                📅 {new Date().toLocaleDateString()}{" "}
                {meta.tipoConsulta === "presential"
                  ? "• 🏥 Presencial"
                  : "• 🏥 Telemedicina"}{" "}
                • 📝 {data.contagem_palavras || "N/A"} palavras analisadas
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="px-4 py-1 bg-gray-700 text-white border border-gray-600 rounded text-sm font-semibold tracking-wide shadow">
                {meta.especialidade}
              </span>
              {meta.score_confianca && (
                <span className="text-[10px] uppercase tracking-wider text-green-400 bg-green-900/20 px-2 py-0.5 rounded">
                  Confiabilidade: {(meta.score_confianca * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lado Esquerdo: Resumo e Diagnóstico */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Resumo SOAP */}
              <div className="bg-gray-800/60 border border-gray-700 p-6 rounded-2xl shadow hover:border-gray-600 transition-colors">
                <h2 className="text-gray-200 font-bold text-lg mb-3">
                  📋 Resumo Técnico (SOAP)
                </h2>
                <p className="text-gray-300 leading-relaxed text-justify whitespace-pre-line">
                  {data.resumo_tecnico}
                </p>

                {data.sentimento_paciente && (
                  <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Sentimento Detectado:
                    </span>
                    <span className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded">
                      {data.sentimento_paciente}
                    </span>
                  </div>
                )}
              </div>

              {/* Diagnóstico */}
              <div className="bg-gray-800/60 border border-gray-700 p-6 rounded-2xl shadow hover:border-gray-600 transition-colors">
                <h2 className="text-blue-300 font-bold text-lg mb-4">
                  🔍 Diagnóstico & Sintomas
                </h2>

                {/* Hipóteses */}
                <div className="mb-5">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Hipóteses Diagnósticas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.hipoteses_diagnosticas?.map(
                      (hip: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-900/20 text-blue-200 border border-blue-800/50 rounded-md font-medium shadow-sm"
                        >
                          {hip}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Sintomas */}
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Sintomas Mapeados
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.sintomas_mapeados?.map((s: any, i: number) => (
                      <span
                        key={i}
                        className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded border border-gray-700/50"
                      >
                        • {s.termo_tecnico}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito: Prescrição e Conduta */}
            <div className="flex flex-col gap-6">
              {/* Prescrição */}
              <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-2xl shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                <h2 className="text-green-400 font-bold text-lg mb-4">
                  💊 Prescrição Médica
                </h2>

                {data.prescricao_estruturada?.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {data.prescricao_estruturada.map(
                      (item: any, idx: number) => (
                        <li
                          key={idx}
                          className="bg-gray-800/80 p-3 rounded border border-gray-700 shadow-sm"
                        >
                          <div className="font-bold text-white flex flex-col text-lg">
                            {item.nome_farmaco}
                            <span className="text-sm font-normal text-green-400">
                              {item.concentracao}
                            </span>
                          </div>
                          <div className="text-gray-300 text-sm mt-1 border-t border-gray-700/50 pt-1">
                            {item.posologia}
                          </div>
                          {item.duracao_tratamento && (
                            <div className="text-gray-500 text-xs mt-1 italic">
                              Duração: {item.duracao_tratamento}
                            </div>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    Nenhuma medicação prescrita.
                  </p>
                )}
              </div>

              {/* Exames e Recomendações */}
              <div className="bg-gray-800/60 border border-gray-700 p-6 rounded-2xl shadow">
                <h2 className="text-gray-200 font-bold text-lg mb-4">
                  📋 Conduta
                </h2>

                {data.exames_solicitados?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Exames Solicitados
                    </p>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                      {data.exames_solicitados.map((ex: string, i: number) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.recomendacoes_gerais?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Recomendações Gerais
                    </p>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                      {data.recomendacoes_gerais.map(
                        (rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="flex flex-wrap justify-end gap-4 mt-6 pb-10 border-t border-gray-700 pt-6">
            <Button
              variant="secondary"
              className="border border-gray-600 text-gray-300 font-semibold hover:bg-gray-700 px-6 py-2 rounded transition-colors"
              onClick={() => window.print()}
            >
              🖨️ Imprimir
            </Button>
            <Button
              variant="primary"
              className="bg-gray-100 text-gray-900/90  font-serif hover:bg-gray-200 font-semibold px-6 py-2 rounded shadow-lg hover:scale-[1.02] transition-transform"
              onClick={() => navigate("/")}
            >
              Nova Consulta
            </Button>
            {reportData && <ChatCard onOpenChat={() => setOpenChat(true)} />}
            {openChat && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl shadow-lg relative flex flex-col gap-4">
                  {/* Botão de fechar */}
                  <button
                    className="absolute top-10 right-10 text-white font-bold text-xl"
                    onClick={() => setOpenChat(false)}
                  >
                    ✕
                  </button>

                  <ContextualChat
                    transcript={data.resumo_tecnico || ""}
                    diagnose={data.hipoteses_diagnosticas}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
