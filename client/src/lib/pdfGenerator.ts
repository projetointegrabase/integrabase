import { jsPDF } from 'jspdf';
import { getLogoInter, getLogoBaseProfissional } from './imageLoader';

interface PDFConfig {
  title: string;
  subtitle: string;
  formType: 'ficha' | 'feedback';
}

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 0;
  private pageHeight: number = 297; // A4 height in mm
  private margin: number = 20;
  private config: PDFConfig;
  private logoInter: string = '';
  private logoBase: string = '';
  
  constructor(config: PDFConfig, logoInter?: string, logoBase?: string) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.config = config;
    this.logoInter = logoInter || '';
    this.logoBase = logoBase || '';
    this.addHeader();
    this.currentY = 70; // Start after header
  }
  
  private addHeader() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    
    // Logo do Internacional (topo centro)
    if (this.logoInter) {
      try {
        this.doc.addImage(this.logoInter, 'PNG', pageWidth/2 - 15, 10, 30, 30);
      } catch (error) {
        console.error('Failed to add Inter logo:', error);
      }
    }
    
    // Linha vermelha horizontal
    this.doc.setDrawColor(200, 16, 46); // #C8102E
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 45, pageWidth - this.margin, 45);
    
    // Título "Projeto Integração"
    this.doc.setTextColor(200, 16, 46);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Projeto Integração', pageWidth / 2, 52, { align: 'center' });
    
    // Subtítulo (nome do formulário)
    this.doc.setFontSize(18);
    this.doc.text(this.config.subtitle, pageWidth / 2, 60, { align: 'center' });
    
    // Linha vermelha horizontal
    this.doc.line(this.margin, 65, pageWidth - this.margin, 65);
  }
  
  private addFooter() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const footerY = this.pageHeight - 25;
    
    // Linha vermelha horizontal
    this.doc.setDrawColor(200, 16, 46);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, footerY, pageWidth - this.margin, footerY);
    
    // Logo Base & Profissional
    if (this.logoBase) {
      try {
        this.doc.addImage(this.logoBase, 'PNG', pageWidth/2 - 20, footerY + 2, 40, 10);
      } catch (error) {
        console.error('Failed to add Base logo:', error);
      }
    }
    
    // Texto do rodapé
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Formando Atletas de Alta Performance', pageWidth / 2, footerY + 10, { align: 'center' });
    this.doc.text('e Cidadãos para a Vida', pageWidth / 2, footerY + 15, { align: 'center' });
  }
  
  private checkPageBreak(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight - 35) {
      this.addFooter();
      this.doc.addPage();
      this.addHeader();
      this.currentY = 70;
      return true;
    }
    return false;
  }
  
  addSection(title: string) {
    // Sempre quebrar página antes de nova seção (exceto primeira)
    if (this.currentY > 70) {
      this.addFooter();
      this.doc.addPage();
      this.addHeader();
      this.currentY = 70;
    }
    
    this.doc.setTextColor(200, 16, 46);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 8;
    
    // Linha abaixo do título da seção
    const pageWidth = this.doc.internal.pageSize.getWidth();
    this.doc.setDrawColor(200, 16, 46);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, this.currentY, pageWidth - this.margin, this.currentY);
    this.currentY += 5;
  }
  
  addField(label: string, value: string | boolean | undefined) {
    this.checkPageBreak(15);
    
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (this.margin * 2);
    
    // Label
    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(label, this.margin, this.currentY);
    this.currentY += 5;
    
    // Value
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    let displayValue = '';
    if (typeof value === 'boolean') {
      displayValue = value ? 'Sim' : 'Não';
    } else if (value === undefined || value === null || value === '') {
      displayValue = '(não preenchido)';
      this.doc.setTextColor(150, 150, 150);
    } else {
      displayValue = String(value);
    }
    
    // Quebrar texto longo em múltiplas linhas
    const lines = this.doc.splitTextToSize(displayValue, maxWidth);
    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      this.doc.text(line, this.margin + 5, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 3; // Espaço entre campos
  }
  
  addSubsection(title: string) {
    this.checkPageBreak(10);
    
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 6;
  }
  
  save(filename: string) {
    // Adicionar rodapé na última página
    this.addFooter();
    
    // Salvar PDF
    this.doc.save(filename);
  }
  
  getBlob(): Blob {
    this.addFooter();
    return this.doc.output('blob');
  }
}

// Função auxiliar para formatar valores de enum
export function formatEnumValue(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Função para gerar PDF da Ficha de Acompanhamento
export async function generateFichaAcompanhamentoPDF(data: any): Promise<Blob> {
  const logoInter = await getLogoInter();
  const logoBase = await getLogoBaseProfissional();
  const pdf = new PDFGenerator({
    title: 'Projeto Integração',
    subtitle: 'Ficha de Acompanhamento Social',
    formType: 'ficha'
  }, logoInter, logoBase);
  
  // Dados do Atleta
  pdf.addSection('Dados do Atleta');
  pdf.addField('Nome do Atleta', data.athleteName || 'Atleta #' + data.athleteId);
  pdf.addField('Profissional Responsável', data.profissionalResponsavel);
  pdf.addField('Data de Preenchimento', new Date(data.submittedAt).toLocaleDateString('pt-BR'));
  
  // Seção 1: Situação Familiar
  pdf.addSection('Seção 1: Situação Familiar');
  
  pdf.addSubsection('Composição Familiar');
  pdf.addField('Mora com Pai', data.secao1.composicaoFamiliar.moraComPai);
  pdf.addField('Mora com Mãe', data.secao1.composicaoFamiliar.moraComMae);
  pdf.addField('Estrutura Familiar', formatEnumValue(data.secao1.composicaoFamiliar.estruturaFamiliar));
  
  pdf.addSubsection('Situação Econômica');
  pdf.addField('Renda Familiar', formatEnumValue(data.secao1.situacaoEconomica.rendaFamiliar));
  pdf.addField('Situação de Moradia', formatEnumValue(data.secao1.situacaoEconomica.situacaoMoradia));
  
  pdf.addSubsection('Dinâmica Familiar');
  pdf.addField('Relacionamento Familiar', formatEnumValue(data.secao1.dinamicaFamiliar.relacionamentoFamiliar));
  pdf.addField('Apoio Familiar', formatEnumValue(data.secao1.dinamicaFamiliar.apoioFamiliar));
  pdf.addField('Desafios Familiares', data.secao1.dinamicaFamiliar.desafiosFamiliares);
  
  // Seção 2: Situação Social
  pdf.addSection('Seção 2: Situação Social e Relacionamentos');
  
  pdf.addSubsection('Círculo Social');
  pdf.addField('Quantidade de Amigos', formatEnumValue(data.secao2.circuloSocial.quantidadeAmigos));
  pdf.addField('Frequência de Contato', formatEnumValue(data.secao2.circuloSocial.frequenciaContato));
  
  pdf.addSubsection('Envolvimento Comunitário');
  pdf.addField('Participa de Atividades', formatEnumValue(data.secao2.envolvimentoComunitario.participa));
  
  pdf.addSubsection('Impacto da Transição');
  pdf.addField('Impacto nos Relacionamentos', formatEnumValue(data.secao2.impactoTransicao.impactoRelacionamentos));
  pdf.addField('Desafios Sociais', data.secao2.impactoTransicao.desafiosSociais);
  
  // Seção 3: Situação Educacional
  pdf.addSection('Seção 3: Situação Educacional');
  
  pdf.addField('Nível Educacional', formatEnumValue(data.secao3.escolaridade.nivelEducacional));
  pdf.addField('Estudando Atualmente', formatEnumValue(data.secao3.escolaridade.estudandoAtualmente));
  pdf.addField('Instituição', data.secao3.escolaridade.instituicao);
  pdf.addField('Desempenho Acadêmico', formatEnumValue(data.secao3.desempenhoAcademico.avaliacao));
  pdf.addField('Perspectiva Educacional', data.secao3.perspectivaEducacional);
  
  // Seção 4: Saúde e Bem-estar
  pdf.addSection('Seção 4: Saúde e Bem-estar');
  
  pdf.addField('Avaliação da Saúde', formatEnumValue(data.secao4.saudeGeral.avaliacaoSaude));
  pdf.addField('Condição Crônica', data.secao4.saudeGeral.condicaoCronica);
  pdf.addField('Qualidade do Sono', formatEnumValue(data.secao4.habitosVida.qualidadeSono));
  pdf.addField('Alimentação', formatEnumValue(data.secao4.habitosVida.alimentacao));
  pdf.addField('Consumo de Álcool', formatEnumValue(data.secao4.usoSubstancias.alcool));
  pdf.addField('Uso de Tabaco', formatEnumValue(data.secao4.usoSubstancias.tabaco));
  
  // Seção 5: Situação Financeira
  pdf.addSection('Seção 5: Situação Financeira Pessoal');
  
  pdf.addField('Recebe Salário', data.secao5.rendaAtleta.recebeSalario);
  if (data.secao5.rendaAtleta.recebeSalario) {
    pdf.addField('Faixa de Renda', formatEnumValue(data.secao5.rendaAtleta.faixaRenda));
  }
  pdf.addField('Gestão Financeira', formatEnumValue(data.secao5.gestaoFinanceira.gestao));
  pdf.addField('Dívidas', formatEnumValue(data.secao5.gestaoFinanceira.temDividas));
  pdf.addField('Segurança Financeira', formatEnumValue(data.secao5.perspectivaFinanceira.seguranca));
  pdf.addField('Preocupações Financeiras', data.secao5.perspectivaFinanceira.preocupacoes);
  
  // Seção 6: Fatores de Proteção e Vulnerabilidade
  pdf.addSection('Seção 6: Fatores de Proteção e Vulnerabilidade');
  
  pdf.addSubsection('Fatores de Proteção');
  pdf.addField('Família Apoiadora', data.secao6.fatoresProtecao.familiaApoiadora);
  pdf.addField('Amigos de Confiança', data.secao6.fatoresProtecao.amigosConfianca);
  
  pdf.addSubsection('Fatores de Vulnerabilidade');
  pdf.addField('Instabilidade Familiar', data.secao6.fatoresVulnerabilidade.instabilidadeFamiliar);
  pdf.addField('Isolamento Social', data.secao6.fatoresVulnerabilidade.isolamentoSocial);
  
  // Seção 7: Necessidades de Intervenção
  pdf.addSection('Seção 7: Necessidades de Intervenção e Plano de Ação');
  
  pdf.addSubsection('Áreas de Intervenção');
  pdf.addField('Apoio Familiar', data.secao7.areasIntervencao.apoioFamiliar);
  pdf.addField('Orientação Educacional', data.secao7.areasIntervencao.orientacaoEducacional);
  
  pdf.addSubsection('Plano de Ação');
  pdf.addField('Ações Recomendadas', data.secao7.planoAcao.acoesRecomendadas);
  pdf.addField('Responsáveis', data.secao7.planoAcao.responsaveis);
  pdf.addField('Próxima Avaliação', new Date(data.secao7.planoAcao.proximaAvaliacao).toLocaleDateString('pt-BR'));
  
  pdf.addField('Observações do Profissional', data.secao7.observacoesProfissional);
  
  return pdf.getBlob();
}

// Função para gerar PDF do Feedback Familiar
export async function generateFeedbackFamiliarPDF(data: any): Promise<Blob> {
  const logoInter = await getLogoInter();
  const logoBase = await getLogoBaseProfissional();
  const pdf = new PDFGenerator({
    title: 'Projeto Integração',
    subtitle: 'Formulário de Feedback Familiar',
    formType: 'feedback'
  }, logoInter, logoBase);
  
  // Dados da Família
  pdf.addSection('Dados da Família');
  pdf.addField('Nome do Atleta', data.athleteName || 'Atleta #' + data.athleteId);
  pdf.addField('Nome do Responsável', data.nomeResponsavel);
  pdf.addField('Relação com o Atleta', formatEnumValue(data.relacaoAtleta));
  pdf.addField('Profissional Responsável', data.profissionalResponsavel);
  pdf.addField('Data de Preenchimento', new Date(data.submittedAt).toLocaleDateString('pt-BR'));
  
  // Seção 1: Percepção Geral
  pdf.addSection('Seção 1: Percepção Geral da Transição');
  
  pdf.addSubsection('Satisfação com a Transição');
  pdf.addField('Avaliação', formatEnumValue(data.secao1.satisfacaoTransicao.avaliacao));
  pdf.addField('Aspectos Positivos', data.secao1.satisfacaoTransicao.aspectosPositivos);
  pdf.addField('Preocupações', data.secao1.satisfacaoTransicao.preocupacoes);
  
  pdf.addSubsection('Impacto na Família');
  pdf.addField('Impacto', formatEnumValue(data.secao1.impactoFamilia.impacto));
  pdf.addField('Descrição', data.secao1.impactoFamilia.descricao);
  
  // Seção 2: Adaptação e Bem-estar
  pdf.addSection('Seção 2: Adaptação e Bem-estar do Atleta');
  
  pdf.addField('Bem-estar Geral', formatEnumValue(data.secao2.percepcaoBemEstar.bemEstarGeral));
  
  pdf.addSubsection('Mudanças Observadas');
  pdf.addField('Humor/Disposição', formatEnumValue(data.secao2.percepcaoBemEstar.mudancasObservadas.humor));
  pdf.addField('Confiança', formatEnumValue(data.secao2.percepcaoBemEstar.mudancasObservadas.confianca));
  pdf.addField('Saúde Física', formatEnumValue(data.secao2.percepcaoBemEstar.mudancasObservadas.saudeFisica));
  pdf.addField('Saúde Mental', formatEnumValue(data.secao2.percepcaoBemEstar.mudancasObservadas.saudeMental));
  
  pdf.addSubsection('Comportamentos e Atitudes');
  pdf.addField('Motivação', formatEnumValue(data.secao2.comportamentos.motivacao));
  pdf.addField('Responsabilidade', formatEnumValue(data.secao2.comportamentos.responsabilidade));
  
  // Seção 3: Suporte Familiar
  pdf.addSection('Seção 3: Suporte Familiar');
  
  pdf.addSubsection('Tipo de Suporte Oferecido');
  pdf.addField('Suporte Emocional', data.secao3.tipoSuporte.emocional);
  pdf.addField('Suporte Logístico', data.secao3.tipoSuporte.logistico);
  pdf.addField('Suporte Financeiro', data.secao3.tipoSuporte.financeiro);
  
  pdf.addSubsection('Qualidade do Suporte');
  pdf.addField('Avaliação', formatEnumValue(data.secao3.qualidadeSuporte.avaliacao));
  pdf.addField('Dificuldades', data.secao3.qualidadeSuporte.dificuldades);
  
  pdf.addField('Necessita de Suporte do Clube', formatEnumValue(data.secao3.necessidadesSuporte.necessita));
  
  // Seção 4: Comunicação com o Clube
  pdf.addSection('Seção 4: Comunicação e Relacionamento com o Clube');
  
  pdf.addField('Qualidade da Comunicação', formatEnumValue(data.secao4.qualidadeComunicacao.avaliacao));
  pdf.addField('Frequência de Contato', formatEnumValue(data.secao4.qualidadeComunicacao.frequencia));
  
  pdf.addSubsection('Transparência e Informação');
  pdf.addField('Processo de Transição', formatEnumValue(data.secao4.transparencia.processoTransicao));
  pdf.addField('Expectativas do Clube', formatEnumValue(data.secao4.transparencia.expectativasClube));
  
  pdf.addSubsection('Relacionamento com Profissionais');
  pdf.addField('Técnico', formatEnumValue(data.secao4.relacionamentoProfissionais.tecnico));
  pdf.addField('Assistente Social', formatEnumValue(data.secao4.relacionamentoProfissionais.assistenteSocial));
  
  // Observações Finais
  pdf.addSection('Observações Finais');
  pdf.addField('Observações', data.observacoesFinais);
  
  return pdf.getBlob();
}
