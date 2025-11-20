export interface MetaDiagnose {
  status_processamento: "success" | "error";
  score_confianca: number;
}

export interface MapSymptom {
  termo_tecnico: string;
}

export interface ItemPrescription {
  nome_farmaco: string;
  concentracao: string | null;
  posologia: string | null;
  duracao_tratamento: string | null;
}

export interface DiagnoseIA {
  meta: MetaDiagnose;
  data: {
    resumo_tecnico: string;
    sentimento_paciente: string[];
    sintomas_mapeados: MapSymptom[];
    hipoteses_diagnosticas: string[];
    recomendacoes_gerais: string[];
    exames_solicitados: string[];
    prescricao_estruturada: ItemPrescription[];
    contagem_palavras: string;
  };
}

export interface Report {
  _id?: string;
  transcript: string;
  diagnose: DiagnoseIA;
  createdAt?: Date;
}
