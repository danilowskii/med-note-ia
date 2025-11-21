import { groq } from "./groq.service.js";

export async function contextualChat(
  question: string,
  lang: "pt" | "en" = "pt",
  transcript?: string,
  diagnose?: object
) {
  const systemPrompt = `
Você é um Assistente Clínico de IA especializado em apoiar profissionais de saúde.
Seu objetivo é responder a perguntas baseando-se na transcrição da consulta fornecida (se houver) e no diagnóstico preliminar da IA (se houver).

DIRETRIZES PRINCIPAIS:
1. **Baseado em Evidências:** Você deve citar fatos de acordo com a informação recebida.
2. **Sem Alucinações:**  Não invente histórico médico.
3. **Tom Profissional:** Mantenha um tom clínico, objetivo e conciso.
4. **Prioridade de Contexto:** Confie nos dados recebidos para resposta estruturada.
5. **Idioma:** A resposta deve estar no idioma: ${
    lang === "en" ? "English" : "Português"
  }.
6. **Formato de Resposta:** Você DEVE responder APENAS em formato JSON válido com a seguinte estrutura:
{
  "reasoning": "Breve explicação do seu raciocínio",
  "answer": "A resposta final direta ao médico"
}
7. **Exceções:** Caso você não receba as informações necessárias, responda de forma geral, especificando que não tem todas as informações.
8. **Exceções:** Se você receber ${transcript} e ${diagnose} vazio, undefined ou null, responda estritamente da seguinte forma: Para que eu possa ajudar com diagnósticos, é necessário iniciar ou abrir uma consulta com as informações relevantes.
`;

  const userPrompt = `
Por favor, analise o seguinte contexto médico e responda à pergunta específica.

<transcricao_consulta>
${transcript}
</transcricao_consulta>

<diagnostico_ia>
${JSON.stringify(diagnose, null, 2)}
</diagnostico_ia>

---

Pergunta do Médico:
${question}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  let raw = response.choices[0]?.message?.content || "{}";
  // limpeza de segurança, remove markdown caso a ia n obedeça
  raw = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    console.error("Erro ao parsear resposta da IA.", raw);
    result = {
      answer:
        lang === "en"
          ? "Error: Could not process the response."
          : "Erro: Não foi possível processar a resposta.",
      reasoning: "",
    };
  }
  return result;
}
