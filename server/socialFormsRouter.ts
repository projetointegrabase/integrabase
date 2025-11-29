import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { db } from "./db-d1";
import { forms, formResponses, athletes } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

// Schema de validação para Ficha de Acompanhamento Social
const fichaAcompanhamentoSchema = z.object({
  athleteId: z.number(),
  profissionalResponsavel: z.string(),
  
  // Seção 1: Situação Familiar
  secao1: z.object({
    composicaoFamiliar: z.object({
      moraComPai: z.boolean(),
      moraComMae: z.boolean(),
      moraComPadrastoMadrasta: z.boolean(),
      moraComIrmaos: z.boolean(),
      quantidadeIrmaos: z.number().optional(),
      moraComAvos: z.boolean(),
      moraComTios: z.boolean(),
      moraComOutros: z.boolean(),
      outrosEspecificar: z.string().optional(),
      estruturaFamiliar: z.enum(['nuclear', 'monoparental', 'reconstituida', 'extensa', 'outro']),
      estruturaFamiliarOutro: z.string().optional(),
    }),
    situacaoEconomica: z.object({
      rendaFamiliar: z.enum(['ate_1sm', '1_2sm', '2_3sm', '3_5sm', 'acima_5sm', 'nao_informar']),
      situacaoMoradia: z.enum(['propria', 'alugada', 'cedida', 'outro']),
      situacaoMoradiaOutro: z.string().optional(),
      aguaEncanada: z.boolean(),
      energiaEletrica: z.boolean(),
      saneamento: z.boolean(),
      internet: z.boolean(),
    }),
    dinamicaFamiliar: z.object({
      relacionamentoFamiliar: z.enum(['muito_bom', 'bom', 'regular', 'dificil', 'muito_dificil']),
      apoioFamiliar: z.enum(['muito_apoiador', 'apoiador', 'neutro', 'pouco_apoiador', 'nao_apoiador']),
      desafiosFamiliares: z.string(),
    }),
  }),
  
  // Seção 2: Situação Social
  secao2: z.object({
    circuloSocial: z.object({
      quantidadeAmigos: z.enum(['nenhum', '1_2', '3_5', '6_10', 'mais_10']),
      frequenciaContato: z.enum(['diariamente', 'varias_vezes_semana', 'uma_vez_semana', 'raramente', 'nunca']),
    }),
    envolvimentoComunitario: z.object({
      participa: z.enum(['sim_regularmente', 'sim_ocasionalmente', 'nao']),
      atividadesEspecificar: z.string().optional(),
    }),
    impactoTransicao: z.object({
      impactoRelacionamentos: z.enum(['fortaleceu', 'nao_afetou', 'alguns_conflitos', 'prejudicou', 'isolou']),
      desafiosSociais: z.string(),
    }),
  }),
  
  // Seção 3: Situação Educacional
  secao3: z.object({
    escolaridade: z.object({
      nivelEducacional: z.enum(['fundamental_incompleto', 'fundamental_completo', 'medio_incompleto', 'medio_completo', 'superior_incompleto', 'superior_completo']),
      estudandoAtualmente: z.enum(['sim_regular', 'sim_ead', 'sim_eja', 'nao_pretende_retomar', 'nao_nao_pretende']),
      instituicao: z.string().optional(),
    }),
    desempenhoAcademico: z.object({
      avaliacao: z.enum(['excelente', 'bom', 'regular', 'abaixo', 'muito_abaixo']),
      dificuldades: z.object({
        faltaTempo: z.boolean(),
        dificuldadeConcentracao: z.boolean(),
        dificuldadeDisciplinas: z.boolean(),
        faltaMotivacao: z.boolean(),
        problemasAprendizagem: z.boolean(),
        outro: z.boolean(),
        outroEspecificar: z.string().optional(),
      }),
    }),
    perspectivaEducacional: z.string(),
  }),
  
  // Seção 4: Saúde e Bem-estar
  secao4: z.object({
    saudeGeral: z.object({
      avaliacaoSaude: z.enum(['excelente', 'boa', 'regular', 'ruim', 'muito_ruim']),
      condicaoCronica: z.boolean(),
      condicaoEspecificar: z.string().optional(),
      acompanhamentoMedico: z.enum(['sim', 'nao', 'ocasionalmente']),
    }),
    habitosVida: z.object({
      qualidadeSono: z.enum(['excelente', 'boa', 'regular', 'ruim']),
      alimentacao: z.enum(['muito_saudavel', 'saudavel', 'regular', 'pouco_saudavel', 'muito_pouco_saudavel']),
      atividadesLazer: z.enum(['regularmente', 'ocasionalmente', 'raramente', 'nao_pratico']),
      atividadesEspecificar: z.string().optional(),
    }),
    usoSubstancias: z.object({
      alcool: z.enum(['nao', 'raramente', 'ocasionalmente', 'frequentemente']),
      tabaco: z.enum(['nao', 'ocasionalmente', 'regularmente']),
      drogas: z.boolean(),
      drogasEspecificar: z.string().optional(),
    }),
  }),
  
  // Seção 5: Situação Financeira
  secao5: z.object({
    rendaAtleta: z.object({
      recebeSalario: z.boolean(),
      faixaRenda: z.enum(['ate_1sm', '1_2sm', '2_5sm', '5_10sm', 'acima_10sm']).optional(),
    }),
    gestaoFinanceira: z.object({
      gestao: z.enum(['conta_controlo', 'conta_pais_controlam', 'sem_conta', 'outro']),
      gestaoOutro: z.string().optional(),
      temDividas: z.enum(['nao', 'pequenas', 'significativas']),
      orientacaoFinanceira: z.enum(['familia', 'profissional', 'nao_recebe']),
    }),
    perspectivaFinanceira: z.object({
      seguranca: z.enum(['muito_seguro', 'seguro', 'incerto', 'inseguro', 'muito_inseguro']),
      preocupacoes: z.string(),
    }),
  }),
  
  // Seção 6: Fatores de Proteção e Vulnerabilidade
  secao6: z.object({
    fatoresProtecao: z.object({
      familiaApoiadora: z.boolean(),
      amigosConfianca: z.boolean(),
      suporteEscolar: z.boolean(),
      boaSaudeFisica: z.boolean(),
      resiliencia: z.boolean(),
      feEspiritualidade: z.boolean(),
      mentores: z.boolean(),
      estabilidadeFinanceira: z.boolean(),
      outro: z.boolean(),
      outroEspecificar: z.string().optional(),
    }),
    fatoresVulnerabilidade: z.object({
      instabilidadeFamiliar: z.boolean(),
      isolamentoSocial: z.boolean(),
      dificuldadesEducacionais: z.boolean(),
      problemasSaude: z.boolean(),
      pressaoPsicologica: z.boolean(),
      dificuldadesFinanceiras: z.boolean(),
      faltaPerspectiva: z.boolean(),
      outro: z.boolean(),
      outroEspecificar: z.string().optional(),
    }),
  }),
  
  // Seção 7: Necessidades de Intervenção
  secao7: z.object({
    areasIntervencao: z.object({
      apoioFamiliar: z.boolean(),
      orientacaoEducacional: z.boolean(),
      suporteFinanceiro: z.boolean(),
      acompanhamentoPsicologico: z.boolean(),
      inclusaoSocial: z.boolean(),
      orientacaoProfissional: z.boolean(),
      suporteMedico: z.boolean(),
      outro: z.boolean(),
      outroEspecificar: z.string().optional(),
    }),
    planoAcao: z.object({
      acoesRecomendadas: z.string(),
      responsaveis: z.string(),
      proximaAvaliacao: z.string(), // ISO date string
    }),
    observacoesProfissional: z.string(),
  }),
  
  // Assinaturas
  assinaturaProfissional: z.string().optional(),
  dataAssinaturaProfissional: z.string().optional(),
  assinaturaAtleta: z.string().optional(),
  dataAssinaturaAtleta: z.string().optional(),
  
  status: z.enum(['draft', 'completed', 'reviewed']).default('draft'),
});

// Schema de validação para Feedback Familiar
const feedbackFamiliarSchema = z.object({
  athleteId: z.number(),
  nomeResponsavel: z.string(),
  relacaoAtleta: z.enum(['pai', 'mae', 'padrasto', 'madrasta', 'avo', 'avo_masc', 'outro']),
  relacaoOutro: z.string().optional(),
  profissionalResponsavel: z.string(),
  
  // Seção 1: Percepção Geral
  secao1: z.object({
    satisfacaoTransicao: z.object({
      avaliacao: z.enum(['muito_positiva', 'positiva', 'neutra', 'negativa', 'muito_negativa']),
      aspectosPositivos: z.string(),
      preocupacoes: z.string(),
    }),
    impactoFamilia: z.object({
      impacto: z.enum(['fortaleceu', 'nao_afetou', 'alguns_desafios', 'prejudicou', 'muito_prejudicial']),
      descricao: z.string(),
    }),
  }),
  
  // Seção 2: Adaptação e Bem-estar
  secao2: z.object({
    percepcaoBemEstar: z.object({
      bemEstarGeral: z.enum(['excelente', 'bom', 'regular', 'ruim', 'muito_ruim']),
      mudancasObservadas: z.object({
        humor: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        confianca: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        saudeFisica: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        saudeMental: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        relacionamentos: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        desempenhoEscolar: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        sono: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
        apetite: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
      }),
    }),
    comportamentos: z.object({
      motivacao: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
      responsabilidade: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
      comunicacao: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
      respeito: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
      independencia: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
      maturidade: z.enum(['melhorou', 'sem_mudanca', 'piorou']),
    }),
  }),
  
  // Seção 3: Suporte Familiar
  secao3: z.object({
    tipoSuporte: z.object({
      emocional: z.boolean(),
      logistico: z.boolean(),
      financeiro: z.boolean(),
      estudos: z.boolean(),
      orientacao: z.boolean(),
      presencaJogos: z.boolean(),
      outro: z.boolean(),
      outroEspecificar: z.string().optional(),
    }),
    qualidadeSuporte: z.object({
      avaliacao: z.enum(['muito_adequado', 'adequado', 'moderado', 'inadequado', 'muito_inadequado']),
      dificuldades: z.string(),
    }),
    necessidadesSuporte: z.object({
      necessita: z.enum(['sim_muito', 'sim_moderado', 'pouco', 'nao']),
      tipos: z.object({
        orientacao: z.boolean(),
        financeiro: z.boolean(),
        psicologico: z.boolean(),
        educacional: z.boolean(),
        gestaoCarreira: z.boolean(),
        outro: z.boolean(),
        outroEspecificar: z.string().optional(),
      }),
    }),
  }),
  
  // Seção 4: Comunicação com Clube
  secao4: z.object({
    qualidadeComunicacao: z.object({
      avaliacao: z.enum(['excelente', 'boa', 'regular', 'ruim', 'muito_ruim']),
      frequencia: z.enum(['semanal', 'quinzenal', 'mensal', 'ocasional', 'raramente']),
    }),
    transparencia: z.object({
      processoTransicao: z.enum(['sim', 'parcialmente', 'nao']),
      expectativasClube: z.enum(['sim', 'parcialmente', 'nao']),
      desempenhoAtleta: z.enum(['sim', 'parcialmente', 'nao']),
      oportunidadesJogo: z.enum(['sim', 'parcialmente', 'nao']),
      planoDesenvolvimento: z.enum(['sim', 'parcialmente', 'nao']),
      suportesDisponiveis: z.enum(['sim', 'parcialmente', 'nao']),
    }),
    relacionamentoProfissionais: z.object({
      tecnico: z.enum(['excelente', 'bom', 'regular', 'ruim']),
      comissaoTecnica: z.enum(['excelente', 'bom', 'regular', 'ruim']),
      psicologo: z.enum(['excelente', 'bom', 'regular', 'ruim']),
      assistenteSocial: z.enum(['excelente', 'bom', 'regular', 'ruim']),
      medico: z.enum(['excelente', 'bom', 'regular', 'ruim']),
      direcao: z.enum(['excelente', 'bom', 'regular', 'ruim']),
    }),
  }),
  
  observacoesFinais: z.string().optional(),
  assinaturaResponsavel: z.string().optional(),
  dataAssinatura: z.string().optional(),
  
  status: z.enum(['draft', 'completed', 'reviewed']).default('draft'),
});

export const socialFormsRouter = router({
  // Criar Ficha de Acompanhamento Social
  createFichaAcompanhamento: publicProcedure
    .input(fichaAcompanhamentoSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      // Criar registro do formulário
      const [form] = await db(ctx.env.DB).insert(forms).values({
        athleteId: input.athleteId,
        formType: 'social',
        sector: 'servico_social',
        submittedBy: userId,
        status: input.status,
      }).returning();
      
      // Salvar dados como JSON em formResponses
      await db(ctx.env.DB).insert(formResponses).values({
        formId: form.id,
        questionKey: 'ficha_acompanhamento_data',
        questionText: 'Dados completos da Ficha de Acompanhamento Social',
        responseValue: JSON.stringify(input),
        responseType: 'text',
      });
      
      return { success: true, formId: form.id };
    }),
  
  // Criar Feedback Familiar
  createFeedbackFamiliar: publicProcedure
    .input(feedbackFamiliarSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      const [form] = await db(ctx.env.DB).insert(forms).values({
        athleteId: input.athleteId,
        formType: 'social',
        sector: 'servico_social',
        submittedBy: userId,
        status: input.status,
      }).returning();
      
      await db(ctx.env.DB).insert(formResponses).values({
        formId: form.id,
        questionKey: 'feedback_familiar_data',
        questionText: 'Dados completos do Feedback Familiar',
        responseValue: JSON.stringify(input),
        responseType: 'text',
      });
      
      return { success: true, formId: form.id };
    }),
  
  // Listar formulários do Serviço Social
  listSocialForms: publicProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      const result = await db(ctx.env.DB)
        .select()
        .from(forms)
        .where(eq(forms.sector, 'servico_social'))
        .orderBy(desc(forms.submittedAt))
        .limit(50);
      
      return result;
    }),
  
  // Obter formulário específico com dados
  getSocialForm: publicProcedure
    .input(z.object({ formId: z.number() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) throw new Error("Não autenticado");
      
      const [form] = await db(ctx.env.DB)
        .select()
        .from(forms)
        .where(eq(forms.id, input.formId));
      
      if (!form) throw new Error("Formulário não encontrado");
      
      const responses = await db(ctx.env.DB)
        .select()
        .from(formResponses)
        .where(eq(formResponses.formId, input.formId));
      
      const data = responses.find(r => 
        r.questionKey === 'ficha_acompanhamento_data' || 
        r.questionKey === 'feedback_familiar_data'
      );
      
      return {
        ...form,
        data: data ? JSON.parse(data.responseValue || '{}') : null,
      };
    }),
});
