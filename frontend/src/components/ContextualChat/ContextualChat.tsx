import { useEffect, useRef, useState } from "react";
import api from "../../Services/api";
import Button from "../Button";

type Props = {
  transcript: string;
  diagnose: object;
  lang?: "pt" | "en";
};

export default function ContextualChat({
  transcript,
  diagnose,
  lang = "pt",
}: Props) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<{ sender: "doctor" | "ia"; text: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  async function handleSend(customQuestion?: string) {
    const q = customQuestion || question;
    if (!q.trim()) return;

    setChat((prev) => [...prev, { sender: "doctor", text: question }]);

    setLoading(true);

    try {
      const response = await api.post("/chat", {
        transcript,
        diagnose,
        question: q,
        lang,
      });

      const { answer, reasoning } = response.data;

      setChat((prev) => [
        ...prev,
        {
          sender: "ia",
          text: `${answer}\n\n💡 *Raciocínio Clínico*: ${reasoning}`,
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { sender: "ia", text: "Erro ao obter resposta da IA." },
      ]);
    }

    setLoading(false);
    setQuestion("");
  }

  return (
    <div className="w-full font-serif bg-slate-800 shadow p-4 rounded-xl  flex flex-col h-[500px]">
      <h2 className="font-bold text-xl text-white mb-3">
        💬 Pergunte ao Dr. IAGO
      </h2>

      {/* Chat messages */}
      <div className="flex-1 h-64 overflow-y-auto border border-slate-900/50 rounded-lg p-3 mb-4 bg-slate-300">
        {chat.map((message, id) => (
          <div
            key={id}
            className={`mb-3 p-2 rounded-lg whitespace-pre-wrap max-w-[80%] ${
              message.sender === "doctor"
                ? "bg-slate-700 text-white ml-auto"
                : "bg-slate-200 text-gray-800 mr-auto"
            }`}
          >
            {message.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 italic">IA analisando...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input + Send */}
      <div className="flex items-center gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite sua pergunta clínica..."
          className="flex-1 bg-slate-200 border px-3 py-2 rounded-lg"
        />
        <Button
          onClick={() => handleSend()}
          className="bg-slate-800 border text-base text-white mdpx-4 py-2 rounded-lg hover:bg-slate-600"
        >
          Enviar
        </Button>
      </div>

      {/* Botão Explique o Diagnóstico */}
      <div className="mt-3 flex justify-end">
        <Button
          onClick={() =>
            handleSend("Explique este diagnóstico detalhadamente.")
          }
          className="bg-slate-200 hover:bg-slate-100 text-gray-900 px-4 py-2 rounded-lg"
        >
          Explique este diagnóstico
        </Button>
      </div>
    </div>
  );
}
