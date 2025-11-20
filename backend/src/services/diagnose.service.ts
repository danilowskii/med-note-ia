import Groq from "groq-sdk";
import { type Report } from "../models/Appointment.model.js";
import "dotenv/config";
import { client } from "../config/database.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateDiagnose = async (transcript: string) => {
  const prompt = `### SYSTEM ROLE & OBJECTIVE
Você é uma IA Especialista em PNL Clínica e Estruturação de Dados Médicos (Senior Medical Scribe). Sua função é analisar transcrições de consultas e extrair dados estruturados com precisão para integração em sistemas de Prontuário Eletrônico (PEP).

### DIRETRIZES DE SEGURANÇA E COMPLIANCE
1. PRINCÍPIO DA VERACIDADE: Extraia APENAS informações explicitamente citadas. Se um dado (ex: dosagem) não estiver no texto, retorne null. JAMAIS invente ou alucine informações.
2. NORMALIZAÇÃO TÉCNICA: Converta a linguagem coloquial do paciente (ex: "dor de cabeça") para a terminologia médica padrão (ex: "cefaleia") no campo específico.
3. ESTRUTURAÇÃO FARMACÊUTICA: Separe rigorosamente o nome do fármaco, a concentração e as instruções de uso.

### OUTPUT FORMAT (JSON ONLY)
Sua resposta deve ser ESTRITAMENTE um objeto JSON válido, sem blocos de markdown (\`\`\`) e sem texto introdutório. Siga este Schema:

{
  "meta": {
    "status_processamento": "success",
    "score_confianca": float (0.0 a 1.0 baseada na clareza do áudio)
  },
  "data": {
    "resumo_tecnico": "string (Resumo conciso em linguagem formal médica, estilo SOAP)",
    "sentimento_paciente": "string (Até 3 sentimentos detectados através da fala do paciente)"
    "sintomas_mapeados": [
      {
        "termo_tecnico": "string (termo médico padrão)"
      }
    ],
    "hipoteses_diagnosticas": [
      "string (Possíveis condições baseadas nos sintomas)"
    ],
    "recomendacoes_gerais": [
      "string (Orientações não medicamentosas)"
    ],
    "exames_solicitados": [
    "string (Exames relacionados à situação do paciente)"
    ]
    "prescricao_estruturada": [
      {
        "nome_farmaco": "string (Nome genérico ou comercial citado)",
        "concentracao": "string (ex: 500mg) ou null",
        "posologia": "string (ex: Tomar 1 comprimido a cada 8 horas) ou null",
        "duracao_tratamento": "string (ex: por 5 dias) ou null"
      }
    ]
      "contagem_palavras": "string (quantas palavras foram ditas com base no transcripto, inclui médico e paciente)"
  }
}

### TRANSCRIPT INPUT
"""${transcript}"""`;

  //chama a ia
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Você é uma IA Especialista em PNL Clínica e Estruturação de Dados Médicos (Senior Medical Scribe). Sua função é analisar transcrições de consultas e extrair dados estruturados com precisão para integração em sistemas de Prontuário Eletrônico (PEP).",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const raw = response.choices[0]?.message?.content || "{}";

  let diagnose;
  try {
    diagnose = JSON.parse(raw);
  } catch {
    console.error("Erro ao parsear resposta da IA.", raw);
    diagnose = {
      meta: {
        status_processamento: "error",
        score_confianca: 0,
      },
      data: {},
    };
  }

  //salvar no banco
  const db = client.db("medNote");
  const collection = db.collection<Report>("reports");

  const result = await collection.insertOne({
    transcript,
    diagnose,
    createdAt: new Date(),
  });

  return {
    _id: result.insertedId,
    transcript,
    diagnose,
    createdAt: new Date(),
  };
};
