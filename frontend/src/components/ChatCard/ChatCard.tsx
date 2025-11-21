import Button from "../Button";

type Props = {
  onOpenChat: () => void;
};

export default function ChatCard({ onOpenChat }: Props) {
  return (
    <div className="w-full mt-4">
      <Button
        onClick={onOpenChat}
        className="
          w-full p-4 rounded-2xl bg-white border hover:bg-slate-200 border-gray-200 
          shadow-sm hover:shadow-md transition-all flex items-center gap-4
        "
      >
        <div className="p-3 rounded-xl bg-slate-800 flex items-center justify-center">
          {/* Ícone simples usando emoji */}
          <span className="text-blue-600 text-2xl">💬</span>
        </div>

        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">
            Dúvidas sobre este diagnóstico?
          </h3>
          <p className="text-gray-600 font-semibold text-sm">
            Abra o chat clínico para fazer perguntas.
          </p>
        </div>
      </Button>
    </div>
  );
}
