import Groq from "groq-sdk";
import { type Report } from "../models/Appointment.model.js";
import "dotenv/config";
import { client } from "../config/database.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateDiagnose = async (
  transcript: string,
  appointmentType: string,
  appointmentNotes: string,
  speciality: string
) => {
  const safeSpeciality = speciality || "Clínica Médica";
  const safeType = appointmentType || "Presencial";
  const safeNotes = appointmentNotes || "Nenhuma observação prévia.";
  const systemPrompt = `
### SYSTEM ROLE
Você é uma IA Especialista em ${safeSpeciality} e em PNL Clínica (Senior Medical Scribe).
Sua função é analisar transcrições de consultas e extrair dados estruturados para PEP.

### DIRETRIZES
1. VERACIDADE: Se um dado não estiver no texto, retorne null ou array vazio [].
2. NORMALIZAÇÃO: Converta termos coloquiais para termos técnicos médicos (pt-br).
3. RACIOCÍNIO: Seja técnico e objetivo.
4. AUTOEXPLICAÇÃO: Sempre explique suas hipóteses de forma clara e bem objetiva.

### OUTPUT FORMAT (JSON ONLY)
Responda APENAS com um objeto JSON válido. Siga este Schema estritamente:
{
  "meta": {
    "status_processamento": "success",
    "score_confianca": string (baseado na qualidade do áudio),
    "especialidade": "${safeSpeciality}",
    "tipoConsulta": "${safeType}"
  },
  "data": {
    "titulo": "string (Ex: Cefaleia Tensional)",
    "resumo_tecnico": "string (Descrição SOAP completa com autoexplicação da sua teoria)",
    "sentimento_paciente": "string (Ex: Ansioso, Colaborativo)",
    "sintomas_mapeados": [
      { "termo_tecnico": "string" }
    ],
    "hipoteses_diagnosticas": [ "string" ],
    "recomendacoes_gerais": [ "string" ],
    "exames_solicitados": [ "string" ], (nunca deixe exames_solicitados vazio)
    "prescricao_estruturada": [
      {
        "nome_farmaco": "string",
        "concentracao": "string or null",
        "posologia": "string or null",
        "duracao_tratamento": "string or null"
      }
    ], (nunca deixe prescricao_estruturada vazio)
    "contagem_palavras": "string"
  }
}
`;

  const userPrompt = `
### DETALHES DO CONTEXTO:
- Especialidade: ${safeSpeciality}
- Tipo: ${safeType}
- Notas do Médico: ${safeNotes}

### TRANSCRIPT INPUT:
"""${transcript}"""
`;

  //chama a ia
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

  let diagnose;
  try {
    diagnose = JSON.parse(raw);
  } catch {
    console.error("Erro ao parsear resposta da IA.", raw);
    diagnose = {
      meta: {
        meta: { status_processamento: "error", erro: "Falha no parse JSON" },
        data: { resumo_tecnico: "Erro ao processar o relatório da IA." },
      },
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

  const saved = await collection.findOne({ _id: result.insertedId });
  return saved;
};
