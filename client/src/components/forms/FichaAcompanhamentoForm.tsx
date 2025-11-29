import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, FileDown } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Props {
  formId: number | null;
  onBack: () => void;
}

export default function FichaAcompanhamentoForm({ formId, onBack }: Props) {
  const [athleteId, setAthleteId] = useState(1); // TODO: Implementar seleção de atleta
  const [profissionalResponsavel, setProfissionalResponsavel] = useState("");
  
  // Seção 1: Situação Familiar
  const [moraComPai, setMoraComPai] = useState(false);
  const [moraComMae, setMoraComMae] = useState(false);
  const [estruturaFamiliar, setEstruturaFamiliar] = useState<string>("nuclear");
  const [rendaFamiliar, setRendaFamiliar] = useState<string>("1_2sm");
  const [situacaoMoradia, setSituacaoMoradia] = useState<string>("propria");
  const [relacionamentoFamiliar, setRelacionamentoFamiliar] = useState<string>("bom");
  const [apoioFamiliar, setApoioFamiliar] = useState<string>("apoiador");
  const [desafiosFamiliares, setDesafiosFamiliares] = useState("");
  
  // Seção 2: Situação Social
  const [quantidadeAmigos, setQuantidadeAmigos] = useState<string>("3_5");
  const [frequenciaContato, setFrequenciaContato] = useState<string>("varias_vezes_semana");
  const [participa, setParticipa] = useState<string>("sim_ocasionalmente");
  const [impactoRelacionamentos, setImpactoRelacionamentos] = useState<string>("nao_afetou");
  const [desafiosSociais, setDesafiosSociais] = useState("");
  
  // Seção 3: Situação Educacional
  const [nivelEducacional, setNivelEducacional] = useState<string>("medio_completo");
  const [estudandoAtualmente, setEstudandoAtualmente] = useState<string>("sim_regular");
  const [instituicao, setInstituicao] = useState("");
  const [avaliacaoDesempenho, setAvaliacaoDesempenho] = useState<string>("bom");
  const [perspectivaEducacional, setPerspectivaEducacional] = useState("");
  
  // Seção 4: Saúde e Bem-estar
  const [avaliacaoSaude, setAvaliacaoSaude] = useState<string>("boa");
  const [condicaoCronica, setCondicaoCronica] = useState(false);
  const [qualidadeSono, setQualidadeSono] = useState<string>("boa");
  const [alimentacao, setAlimentacao] = useState<string>("saudavel");
  const [alcool, setAlcool] = useState<string>("nao");
  const [tabaco, setTabaco] = useState<string>("nao");
  
  // Seção 5: Situação Financeira
  const [recebeSalario, setRecebeSalario] = useState(false);
  const [faixaRenda, setFaixaRenda] = useState<string>("1_2sm");
  const [gestao, setGestao] = useState<string>("conta_controlo");
  const [temDividas, setTemDividas] = useState<string>("nao");
  const [seguranca, setSeguranca] = useState<string>("incerto");
  const [preocupacoesFinanceiras, setPreocupacoesFinanceiras] = useState("");
  
  // Seção 6: Fatores de Proteção e Vulnerabilidade
  const [familiaApoiadora, setFamiliaApoiadora] = useState(false);
  const [amigosConfianca, setAmigosConfianca] = useState(false);
  const [instabilidadeFamiliar, setInstabilidadeFamiliar] = useState(false);
  const [isolamentoSocial, setIsolamentoSocial] = useState(false);
  
  // Seção 7: Necessidades de Intervenção
  const [apoioFamiliarIntervencao, setApoioFamiliarIntervencao] = useState(false);
  const [orientacaoEducacional, setOrientacaoEducacional] = useState(false);
  const [acoesRecomendadas, setAcoesRecomendadas] = useState("");
  const [responsaveis, setResponsaveis] = useState("");
  const [observacoesProfissional, setObservacoesProfissional] = useState("");
  
  const createMutation = trpc.socialForms.createFichaAcompanhamento.useMutation({
    onSuccess: () => {
      alert("Formulário salvo com sucesso!");
      onBack();
    },
    onError: (error) => {
      alert(`Erro ao salvar: ${error.message}`);
    },
  });
  
  const handleSave = (status: 'draft' | 'completed') => {
    const data = {
      athleteId,
      profissionalResponsavel,
      secao1: {
        composicaoFamiliar: {
          moraComPai,
          moraComMae,
          moraComPadrastoMadrasta: false,
          moraComIrmaos: false,
          moraComAvos: false,
          moraComTios: false,
          moraComOutros: false,
          estruturaFamiliar: estruturaFamiliar as any,
        },
        situacaoEconomica: {
          rendaFamiliar: rendaFamiliar as any,
          situacaoMoradia: situacaoMoradia as any,
          aguaEncanada: true,
          energiaEletrica: true,
          saneamento: true,
          internet: true,
        },
        dinamicaFamiliar: {
          relacionamentoFamiliar: relacionamentoFamiliar as any,
          apoioFamiliar: apoioFamiliar as any,
          desafiosFamiliares,
        },
      },
      secao2: {
        circuloSocial: {
          quantidadeAmigos: quantidadeAmigos as any,
          frequenciaContato: frequenciaContato as any,
        },
        envolvimentoComunitario: {
          participa: participa as any,
        },
        impactoTransicao: {
          impactoRelacionamentos: impactoRelacionamentos as any,
          desafiosSociais,
        },
      },
      secao3: {
        escolaridade: {
          nivelEducacional: nivelEducacional as any,
          estudandoAtualmente: estudandoAtualmente as any,
          instituicao,
        },
        desempenhoAcademico: {
          avaliacao: avaliacaoDesempenho as any,
          dificuldades: {
            faltaTempo: false,
            dificuldadeConcentracao: false,
            dificuldadeDisciplinas: false,
            faltaMotivacao: false,
            problemasAprendizagem: false,
            outro: false,
          },
        },
        perspectivaEducacional,
      },
      secao4: {
        saudeGeral: {
          avaliacaoSaude: avaliacaoSaude as any,
          condicaoCronica,
          acompanhamentoMedico: 'sim' as any,
        },
        habitosVida: {
          qualidadeSono: qualidadeSono as any,
          alimentacao: alimentacao as any,
          atividadesLazer: 'ocasionalmente' as any,
        },
        usoSubstancias: {
          alcool: alcool as any,
          tabaco: tabaco as any,
          drogas: false,
        },
      },
      secao5: {
        rendaAtleta: {
          recebeSalario,
          faixaRenda: recebeSalario ? (faixaRenda as any) : undefined,
        },
        gestaoFinanceira: {
          gestao: gestao as any,
          temDividas: temDividas as any,
          orientacaoFinanceira: 'familia' as any,
        },
        perspectivaFinanceira: {
          seguranca: seguranca as any,
          preocupacoes: preocupacoesFinanceiras,
        },
      },
      secao6: {
        fatoresProtecao: {
          familiaApoiadora,
          amigosConfianca,
          suporteEscolar: false,
          boaSaudeFisica: false,
          resiliencia: false,
          feEspiritualidade: false,
          mentores: false,
          estabilidadeFinanceira: false,
          outro: false,
        },
        fatoresVulnerabilidade: {
          instabilidadeFamiliar,
          isolamentoSocial,
          dificuldadesEducacionais: false,
          problemasSaude: false,
          pressaoPsicologica: false,
          dificuldadesFinanceiras: false,
          faltaPerspectiva: false,
          outro: false,
        },
      },
      secao7: {
        areasIntervencao: {
          apoioFamiliar: apoioFamiliarIntervencao,
          orientacaoEducacional,
          suporteFinanceiro: false,
          acompanhamentoPsicologico: false,
          inclusaoSocial: false,
          orientacaoProfissional: false,
          suporteMedico: false,
          outro: false,
        },
        planoAcao: {
          acoesRecomendadas,
          responsaveis,
          proximaAvaliacao: new Date().toISOString(),
        },
        observacoesProfissional,
      },
      status,
    };
    
    createMutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#C8102E]">Ficha de Acompanhamento Social</h2>
          <p className="text-sm text-gray-600">Projeto Integração - Base & Profissional</p>
        </div>
        <Button variant="outline" onClick={() => handleSave('draft')}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Rascunho
        </Button>
        <Button className="bg-[#C8102E] hover:bg-[#A00D24]" onClick={() => handleSave('completed')}>
          <FileDown className="h-4 w-4 mr-2" />
          Finalizar
        </Button>
      </div>
      
      {/* Dados do Atleta */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Atleta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Atleta ID (temporário)</Label>
            <Input type="number" value={athleteId} onChange={(e) => setAthleteId(Number(e.target.value))} />
          </div>
          <div>
            <Label>Profissional Responsável</Label>
            <Input value={profissionalResponsavel} onChange={(e) => setProfissionalResponsavel(e.target.value)} />
          </div>
        </div>
      </Card>
      
      {/* Seção 1: Situação Familiar */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 1: Situação Familiar</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Composição Familiar</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={moraComPai} onChange={(e) => setMoraComPai(e.target.checked)} className="rounded" />
                <span>Mora com Pai</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={moraComMae} onChange={(e) => setMoraComMae(e.target.checked)} className="rounded" />
                <span>Mora com Mãe</span>
              </label>
            </div>
          </div>
          
          <div>
            <Label>Estrutura Familiar</Label>
            <select value={estruturaFamiliar} onChange={(e) => setEstruturaFamiliar(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="nuclear">Família nuclear (ambos os pais)</option>
              <option value="monoparental">Família monoparental (um dos pais)</option>
              <option value="reconstituida">Família reconstituída</option>
              <option value="extensa">Família extensa</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <Label>Renda Familiar Mensal</Label>
            <select value={rendaFamiliar} onChange={(e) => setRendaFamiliar(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="ate_1sm">Até 1 salário mínimo</option>
              <option value="1_2sm">1 a 2 salários mínimos</option>
              <option value="2_3sm">2 a 3 salários mínimos</option>
              <option value="3_5sm">3 a 5 salários mínimos</option>
              <option value="acima_5sm">Acima de 5 salários mínimos</option>
            </select>
          </div>
          
          <div>
            <Label>Situação de Moradia</Label>
            <select value={situacaoMoradia} onChange={(e) => setSituacaoMoradia(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="propria">Casa própria</option>
              <option value="alugada">Casa alugada</option>
              <option value="cedida">Cedida/Emprestada</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <Label>Relacionamento com a Família</Label>
            <select value={relacionamentoFamiliar} onChange={(e) => setRelacionamentoFamiliar(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="muito_bom">Muito bom</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
              <option value="dificil">Difícil</option>
              <option value="muito_dificil">Muito difícil</option>
            </select>
          </div>
          
          <div>
            <Label>Apoio Familiar para Carreira</Label>
            <select value={apoioFamiliar} onChange={(e) => setApoioFamiliar(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="muito_apoiador">Muito apoiador</option>
              <option value="apoiador">Apoiador</option>
              <option value="neutro">Neutro</option>
              <option value="pouco_apoiador">Pouco apoiador</option>
              <option value="nao_apoiador">Não apoiador</option>
            </select>
          </div>
          
          <div>
            <Label>Principais Desafios Familiares</Label>
            <Textarea value={desafiosFamiliares} onChange={(e) => setDesafiosFamiliares(e.target.value)} 
              rows={3} placeholder="Descreva os principais desafios..." />
          </div>
        </div>
      </Card>
      
      {/* Seção 2: Situação Social */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 2: Situação Social e Relacionamentos</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Quantidade de Amigos Fora do Futebol</Label>
            <select value={quantidadeAmigos} onChange={(e) => setQuantidadeAmigos(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="nenhum">Nenhum</option>
              <option value="1_2">1-2 amigos</option>
              <option value="3_5">3-5 amigos</option>
              <option value="6_10">6-10 amigos</option>
              <option value="mais_10">Mais de 10 amigos</option>
            </select>
          </div>
          
          <div>
            <Label>Frequência de Contato</Label>
            <select value={frequenciaContato} onChange={(e) => setFrequenciaContato(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="diariamente">Diariamente</option>
              <option value="varias_vezes_semana">Várias vezes por semana</option>
              <option value="uma_vez_semana">Uma vez por semana</option>
              <option value="raramente">Raramente</option>
              <option value="nunca">Nunca</option>
            </select>
          </div>
          
          <div>
            <Label>Participa de Atividades Comunitárias</Label>
            <select value={participa} onChange={(e) => setParticipa(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="sim_regularmente">Sim, regularmente</option>
              <option value="sim_ocasionalmente">Sim, ocasionalmente</option>
              <option value="nao">Não participo</option>
            </select>
          </div>
          
          <div>
            <Label>Impacto da Transição nos Relacionamentos</Label>
            <select value={impactoRelacionamentos} onChange={(e) => setImpactoRelacionamentos(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="fortaleceu">Fortaleceu meus relacionamentos</option>
              <option value="nao_afetou">Não afetou significativamente</option>
              <option value="alguns_conflitos">Causou alguns conflitos</option>
              <option value="prejudicou">Prejudicou significativamente</option>
              <option value="isolou">Isolou-me socialmente</option>
            </select>
          </div>
          
          <div>
            <Label>Desafios Sociais Identificados</Label>
            <Textarea value={desafiosSociais} onChange={(e) => setDesafiosSociais(e.target.value)} 
              rows={3} placeholder="Descreva os desafios sociais..." />
          </div>
        </div>
      </Card>
      
      {/* Seção 3: Situação Educacional */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 3: Situação Educacional</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Nível Educacional Atual</Label>
            <select value={nivelEducacional} onChange={(e) => setNivelEducacional(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="fundamental_incompleto">Ensino Fundamental incompleto</option>
              <option value="fundamental_completo">Ensino Fundamental completo</option>
              <option value="medio_incompleto">Ensino Médio incompleto</option>
              <option value="medio_completo">Ensino Médio completo</option>
              <option value="superior_incompleto">Educação Superior incompleta</option>
              <option value="superior_completo">Educação Superior completa</option>
            </select>
          </div>
          
          <div>
            <Label>Está Estudando Atualmente?</Label>
            <select value={estudandoAtualmente} onChange={(e) => setEstudandoAtualmente(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="sim_regular">Sim, ensino regular</option>
              <option value="sim_ead">Sim, educação a distância</option>
              <option value="sim_eja">Sim, EJA</option>
              <option value="nao_pretende_retomar">Não, mas pretendo retomar</option>
              <option value="nao_nao_pretende">Não, e não pretendo</option>
            </select>
          </div>
          
          <div>
            <Label>Instituição de Ensino</Label>
            <Input value={instituicao} onChange={(e) => setInstituicao(e.target.value)} 
              placeholder="Nome da instituição" />
          </div>
          
          <div>
            <Label>Avaliação do Desempenho Acadêmico</Label>
            <select value={avaliacaoDesempenho} onChange={(e) => setAvaliacaoDesempenho(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="excelente">Excelente</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
              <option value="abaixo">Abaixo do esperado</option>
              <option value="muito_abaixo">Muito abaixo do esperado</option>
            </select>
          </div>
          
          <div>
            <Label>Perspectiva Educacional (próximos 2 anos)</Label>
            <Textarea value={perspectivaEducacional} onChange={(e) => setPerspectivaEducacional(e.target.value)} 
              rows={3} placeholder="Descreva os planos educacionais..." />
          </div>
        </div>
      </Card>
      
      {/* Seção 4: Saúde e Bem-estar */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 4: Saúde e Bem-estar</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Avaliação da Saúde Geral</Label>
            <select value={avaliacaoSaude} onChange={(e) => setAvaliacaoSaude(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="excelente">Excelente</option>
              <option value="boa">Boa</option>
              <option value="regular">Regular</option>
              <option value="ruim">Ruim</option>
              <option value="muito_ruim">Muito ruim</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={condicaoCronica} onChange={(e) => setCondicaoCronica(e.target.checked)} className="rounded" />
              <span>Possui condição de saúde crônica</span>
            </label>
          </div>
          
          <div>
            <Label>Qualidade do Sono</Label>
            <select value={qualidadeSono} onChange={(e) => setQualidadeSono(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="excelente">Excelente (7-9h, sono reparador)</option>
              <option value="boa">Boa (6-7h, geralmente reparador)</option>
              <option value="regular">Regular (5-6h, com dificuldades)</option>
              <option value="ruim">Ruim (menos de 5h ou perturbado)</option>
            </select>
          </div>
          
          <div>
            <Label>Alimentação</Label>
            <select value={alimentacao} onChange={(e) => setAlimentacao(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="muito_saudavel">Muito saudável</option>
              <option value="saudavel">Saudável</option>
              <option value="regular">Regular</option>
              <option value="pouco_saudavel">Pouco saudável</option>
              <option value="muito_pouco_saudavel">Muito pouco saudável</option>
            </select>
          </div>
          
          <div>
            <Label>Consumo de Álcool</Label>
            <select value={alcool} onChange={(e) => setAlcool(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="nao">Não</option>
              <option value="raramente">Raramente (menos de 1x/mês)</option>
              <option value="ocasionalmente">Ocasionalmente (1-3x/mês)</option>
              <option value="frequentemente">Frequentemente (mais de 1x/semana)</option>
            </select>
          </div>
          
          <div>
            <Label>Uso de Tabaco</Label>
            <select value={tabaco} onChange={(e) => setTabaco(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="nao">Não</option>
              <option value="ocasionalmente">Ocasionalmente</option>
              <option value="regularmente">Regularmente</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Seção 5: Situação Financeira */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 5: Situação Financeira Pessoal</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={recebeSalario} onChange={(e) => setRecebeSalario(e.target.checked)} className="rounded" />
              <span>Recebe salário/bolsa como atleta profissional</span>
            </label>
          </div>
          
          {recebeSalario && (
            <div>
              <Label>Faixa de Renda Mensal</Label>
              <select value={faixaRenda} onChange={(e) => setFaixaRenda(e.target.value)} 
                className="w-full border rounded-md p-2">
                <option value="ate_1sm">Até 1 salário mínimo</option>
                <option value="1_2sm">1 a 2 salários mínimos</option>
                <option value="2_5sm">2 a 5 salários mínimos</option>
                <option value="5_10sm">5 a 10 salários mínimos</option>
                <option value="acima_10sm">Acima de 10 salários mínimos</option>
              </select>
            </div>
          )}
          
          <div>
            <Label>Gestão Financeira</Label>
            <select value={gestao} onChange={(e) => setGestao(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="conta_controlo">Tenho conta bancária e controlo meu dinheiro</option>
              <option value="conta_pais_controlam">Tenho conta, mas pais controlam</option>
              <option value="sem_conta">Não tenho conta bancária</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div>
            <Label>Dívidas ou Compromissos Financeiros</Label>
            <select value={temDividas} onChange={(e) => setTemDividas(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="nao">Não</option>
              <option value="pequenas">Sim, pequenas dívidas</option>
              <option value="significativas">Sim, dívidas significativas</option>
            </select>
          </div>
          
          <div>
            <Label>Segurança Financeira Futura</Label>
            <select value={seguranca} onChange={(e) => setSeguranca(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="muito_seguro">Muito seguro</option>
              <option value="seguro">Seguro</option>
              <option value="incerto">Incerto</option>
              <option value="inseguro">Inseguro</option>
              <option value="muito_inseguro">Muito inseguro</option>
            </select>
          </div>
          
          <div>
            <Label>Principais Preocupações Financeiras</Label>
            <Textarea value={preocupacoesFinanceiras} onChange={(e) => setPreocupacoesFinanceiras(e.target.value)} 
              rows={3} placeholder="Descreva as preocupações..." />
          </div>
        </div>
      </Card>
      
      {/* Seção 6: Fatores de Proteção e Vulnerabilidade */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 6: Fatores de Proteção e Vulnerabilidade</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Fatores de Proteção</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={familiaApoiadora} onChange={(e) => setFamiliaApoiadora(e.target.checked)} className="rounded" />
                <span>Família apoiadora</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={amigosConfianca} onChange={(e) => setAmigosConfianca(e.target.checked)} className="rounded" />
                <span>Amigos de confiança</span>
              </label>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Fatores de Vulnerabilidade</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={instabilidadeFamiliar} onChange={(e) => setInstabilidadeFamiliar(e.target.checked)} className="rounded" />
                <span>Instabilidade familiar</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isolamentoSocial} onChange={(e) => setIsolamentoSocial(e.target.checked)} className="rounded" />
                <span>Isolamento social</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Seção 7: Necessidades de Intervenção */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 7: Necessidades de Intervenção</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Áreas de Intervenção Recomendadas</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={apoioFamiliarIntervencao} onChange={(e) => setApoioFamiliarIntervencao(e.target.checked)} className="rounded" />
                <span>Apoio familiar</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={orientacaoEducacional} onChange={(e) => setOrientacaoEducacional(e.target.checked)} className="rounded" />
                <span>Orientação educacional</span>
              </label>
            </div>
          </div>
          
          <div>
            <Label>Ações Recomendadas</Label>
            <Textarea value={acoesRecomendadas} onChange={(e) => setAcoesRecomendadas(e.target.value)} 
              rows={3} placeholder="Descreva as ações recomendadas..." />
          </div>
          
          <div>
            <Label>Responsáveis</Label>
            <Input value={responsaveis} onChange={(e) => setResponsaveis(e.target.value)} 
              placeholder="Nome dos responsáveis" />
          </div>
          
          <div>
            <Label>Observações do Profissional</Label>
            <Textarea value={observacoesProfissional} onChange={(e) => setObservacoesProfissional(e.target.value)} 
              rows={4} placeholder="Observações adicionais..." />
          </div>
        </div>
      </Card>
      
      {/* Botões de Ação */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Cancelar
        </Button>
        <Button variant="outline" onClick={() => handleSave('draft')}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Rascunho
        </Button>
        <Button className="bg-[#C8102E] hover:bg-[#A00D24]" onClick={() => handleSave('completed')}>
          <FileDown className="h-4 w-4 mr-2" />
          Finalizar e Gerar PDF
        </Button>
      </div>
    </div>
  );
}
