import image1 from "../../assets/1.png";
import image2 from "../../assets/2.png";
import image3 from "../../assets/3.png";
import image4 from "../../assets/4.png";

export default function Tutorial() {
  return (
    <div className="h-[400px] overflow-y-auto text-white p-2 rounded-lg shadow-lg">
      {/* 1. Iniciando uma Nova Transcrição */}
      <section className="pb-8 border-b border-b-white/50">
        <h2 className="text-xl font-bold mb-2">
          1. Iniciando uma Nova Transcrição
        </h2>

        <p className="mb-2 relative">
          Para começar uma transcrição, selecione a modalidade da consulta
          (presencial ou telemedicina). Em seguida, escolha a especialização
          médica desejada e clique em <strong>“Iniciar Gravação”</strong>. O
          software solicitará acesso ao microfone e, se necessário, ao
          compartilhamento de tela ou aba; aceite para garantir uma gravação de
          qualidade.
        </p>

        <p className="relative text-sm rounded-md italic bg-slate-200 py-1 px-3 text-gray-700">
          <span className="absolute top-0 left-0 bg-slate-400 w-1.5 h-full"></span>
          Dica: Utilize um microfone de boa qualidade para garantir maior
          precisão na transcrição automática.
        </p>
        <img
          src={image1}
          className="border border-white/50 rounded mt-2"
          alt=""
        />
      </section>

      {/* 2. Anotações e Transcrições */}
      <section className="pb-8 mt-6 border-b border-b-white/50">
        <h2 className="text-xl font-bold mb-2">2. Anotações e Transcrições</h2>
        <p className="mb-2">
          Durante a gravação, o software permite registrar anotações importantes
          sobre a consulta. Estas anotações serão enviadas junto com a
          transcrição para auxiliar na criação do diagnóstico final. É possível
          pausar e retomar a gravação a qualquer momento sem interromper a
          transcrição em tempo real. A ferramenta também indica se o microfone
          está ativo ou pausado.
        </p>

        <p className="relative text-sm rounded-md italic bg-slate-200 py-1 px-3 text-gray-700">
          <span className="absolute top-0 left-0 bg-slate-400 w-1.5 h-full"></span>
          Dica: Utilize a transcrição automática para revisar falas importantes
          do paciente durante a consulta e não perder nenhum detalhe relevante.
        </p>
        <img
          src={image2}
          className="border border-white/50 rounded mt-2"
          alt=""
        />
      </section>

      {/* 3. Utilizando Recursos de IA e Diagnóstico */}
      <section className="pb-8 mt-6 border-b border-b-white/50">
        <h2 className="text-xl font-bold mb-2">
          3. Utilizando Recursos de IA e Diagnóstico
        </h2>
        <p className="mb-2">
          O software oferece funcionalidades avançadas de inteligência
          artificial que auxiliam na identificação de informações médicas
          relevantes e podem sugerir diagnósticos preliminares. Estes recursos
          não substituem o julgamento clínico, mas ajudam a organizar os dados
          de forma eficiente.
        </p>
        <p className="mb-2">
          Além disso, é possível interagir com o <strong>Dr. IAGO</strong>, uma
          IA assistente que responde dúvidas clínicas, sugere referências
          médicas e ajuda na interpretação dos dados da consulta, funcionando
          como um apoio para o profissional de saúde.
        </p>

        <p className="relative text-sm rounded-md italic bg-slate-200 py-1 px-3 text-gray-700">
          <span className="absolute top-0 left-0 bg-slate-400 w-1.5 h-full"></span>
          Dica: Sempre revise as sugestões do Dr. IAGO antes de repassá-las ao
          paciente ou registrar no prontuário.
        </p>
        <img
          src={image3}
          className="border border-white/50 rounded mt-2"
          alt=""
        />
      </section>

      {/* 4. Salvando, Exportando e Compartilhando */}
      <section className="pb-8 mt-6 border-b border-b-white/50">
        <h2 className="text-xl font-bold mb-2">
          4. Salvando, Exportando e Compartilhando
        </h2>
        <p className="mb-2">
          Ao finalizar a transcrição, é possível salvar o documento no sistema,
          exportá-lo em PDF ou Word e compartilhá-lo com outros profissionais
          autorizados. O software mantém um histórico completo de todas as
          transcrições, permitindo consultas rápidas a registros anteriores.
        </p>

        <p className="relative text-sm rounded-md italic bg-slate-200 py-1 px-3 text-gray-700">
          <span className="absolute top-0 left-0 bg-slate-400 w-1.5 h-full"></span>
          Dica: Compartilhe com colegas ou utilize o diagnóstico como material
          de estudo. Todas as informações pessoais dos pacientes são protegidas
          para garantir privacidade e conformidade com normas de segurança de
          dados.
        </p>
        <img
          src={image4}
          className="border border-white/50 rounded mt-2"
          alt=""
        />
      </section>

      {/* Curiosidade: A Origem do Dr. IAGO */}
      <section className="relative p-3 rounded-lg mb-4 bg-blue-200 text-black">
        {/* Barra lateral */}
        <div className="bg-blue-400 w-1.5 h-full absolute top-0 left-0 "></div>

        {/* Conteúdo */}
        <div className="ml-4">
          <h2 className="text-xl font-bold mb-2">
            Curiosidade: A Origem do Dr. IAGO
          </h2>
          <p className="mb-2">
            O nome <strong>Dr. IAGO</strong> surgiu de um trocadilho criado pelo
            desenvolvedor da ferramenta,{" "}
            <a
              className="text-blue-700 underline"
              target="_blank"
              href="https://www.linkedin.com/in/paivadanilo/"
            >
              Danilo.
            </a>{" "}
            A lógica é criativa e significativa:
          </p>
          <ul className="list-disc list-inside mb-2">
            <li>
              <strong>IA</strong>: Refere-se à Inteligência Artificial.
            </li>
            <li>
              <strong>GO</strong>: Do verbo inglês <em>go</em>, representando
              ação e agilidade.
            </li>
          </ul>
          <p>
            Ao unir os dois, surge <strong>IAGO</strong>: uma tecnologia que não
            apenas “pensa”, mas também age. Além disso, a sigla forma um nome
            próprio real, humanizando o sistema e transformando códigos em um
            verdadeiro parceiro médico.
          </p>
        </div>
      </section>
    </div>
  );
}
