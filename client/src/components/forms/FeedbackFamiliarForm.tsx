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

export default function FeedbackFamiliarForm({ formId, onBack }: Props) {
  const [athleteId, setAthleteId] = useState(1);
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [relacaoAtleta, setRelacaoAtleta] = useState<string>("pai");
  const [profissionalResponsavel, setProfissionalResponsavel] = useState("");
  
  // Seção 1: Percepção Geral
  const [avaliacao, setAvaliacao] = useState<string>("positiva");
  const [aspectosPositivos, setAspectosPositivos] = useState("");
  const [preocupacoes, setPreocupacoes] = useState("");
  const [impacto, setImpacto] = useState<string>("nao_afetou");
  const [descricao, setDescricao] = useState("");
  
  // Seção 2: Adaptação e Bem-estar
  const [bemEstarGeral, setBemEstarGeral] = useState<string>("bom");
  const [humor, setHumor] = useState<string>("sem_mudanca");
  const [confianca, setConfianca] = useState<string>("melhorou");
  const [saudeFisica, setSaudeFisica] = useState<string>("sem_mudanca");
  const [saudeMental, setSaudeMental] = useState<string>("sem_mudanca");
  const [motivacao, setMotivacao] = useState<string>("melhorou");
  const [responsabilidade, setResponsabilidade] = useState<string>("melhorou");
  
  // Seção 3: Suporte Familiar
  const [emocional, setEmocional] = useState(false);
  const [logistico, setLogistico] = useState(false);
  const [financeiro, setFinanceiro] = useState(false);
  const [avaliacaoSuporte, setAvaliacaoSuporte] = useState<string>("adequado");
  const [dificuldades, setDificuldades] = useState("");
  const [necessita, setNecessita] = useState<string>("pouco");
  
  // Seção 4: Comunicação com Clube
  const [avaliacaoComunicacao, setAvaliacaoComunicacao] = useState<string>("boa");
  const [frequencia, setFrequencia] = useState<string>("mensal");
  const [processoTransicao, setProcessoTransicao] = useState<string>("sim");
  const [expectativasClube, setExpectativasClube] = useState<string>("parcialmente");
  const [tecnico, setTecnico] = useState<string>("bom");
  const [assistenteSocial, setAssistenteSocial] = useState<string>("excelente");
  
  const [observacoesFinais, setObservacoesFinais] = useState("");
  
  const createMutation = trpc.socialForms.createFeedbackFamiliar.useMutation({
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
      nomeResponsavel,
      relacaoAtleta: relacaoAtleta as any,
      profissionalResponsavel,
      secao1: {
        satisfacaoTransicao: {
          avaliacao: avaliacao as any,
          aspectosPositivos,
          preocupacoes,
        },
        impactoFamilia: {
          impacto: impacto as any,
          descricao,
        },
      },
      secao2: {
        percepcaoBemEstar: {
          bemEstarGeral: bemEstarGeral as any,
          mudancasObservadas: {
            humor: humor as any,
            confianca: confianca as any,
            saudeFisica: saudeFisica as any,
            saudeMental: saudeMental as any,
            relacionamentos: 'sem_mudanca' as any,
            desempenhoEscolar: 'sem_mudanca' as any,
            sono: 'sem_mudanca' as any,
            apetite: 'sem_mudanca' as any,
          },
        },
        comportamentos: {
          motivacao: motivacao as any,
          responsabilidade: responsabilidade as any,
          comunicacao: 'sem_mudanca' as any,
          respeito: 'sem_mudanca' as any,
          independencia: 'sem_mudanca' as any,
          maturidade: 'sem_mudanca' as any,
        },
      },
      secao3: {
        tipoSuporte: {
          emocional,
          logistico,
          financeiro,
          estudos: false,
          orientacao: false,
          presencaJogos: false,
          outro: false,
        },
        qualidadeSuporte: {
          avaliacao: avaliacaoSuporte as any,
          dificuldades,
        },
        necessidadesSuporte: {
          necessita: necessita as any,
          tipos: {
            orientacao: false,
            financeiro: false,
            psicologico: false,
            educacional: false,
            gestaoCarreira: false,
            outro: false,
          },
        },
      },
      secao4: {
        qualidadeComunicacao: {
          avaliacao: avaliacaoComunicacao as any,
          frequencia: frequencia as any,
        },
        transparencia: {
          processoTransicao: processoTransicao as any,
          expectativasClube: expectativasClube as any,
          desempenhoAtleta: 'sim' as any,
          oportunidadesJogo: 'sim' as any,
          planoDesenvolvimento: 'parcialmente' as any,
          suportesDisponiveis: 'sim' as any,
        },
        relacionamentoProfissionais: {
          tecnico: tecnico as any,
          comissaoTecnica: 'bom' as any,
          psicologo: 'bom' as any,
          assistenteSocial: assistenteSocial as any,
          medico: 'bom' as any,
          direcao: 'bom' as any,
        },
      },
      observacoesFinais,
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
          <h2 className="text-2xl font-bold text-[#C8102E]">Formulário de Feedback Familiar</h2>
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
      
      {/* Dados da Família */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados da Família</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Atleta ID (temporário)</Label>
            <Input type="number" value={athleteId} onChange={(e) => setAthleteId(Number(e.target.value))} />
          </div>
          <div>
            <Label>Nome do Responsável/Familiar</Label>
            <Input value={nomeResponsavel} onChange={(e) => setNomeResponsavel(e.target.value)} />
          </div>
          <div>
            <Label>Relação com o Atleta</Label>
            <select value={relacaoAtleta} onChange={(e) => setRelacaoAtleta(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="pai">Pai</option>
              <option value="mae">Mãe</option>
              <option value="padrasto">Padrasto</option>
              <option value="madrasta">Madrasta</option>
              <option value="avo">Avó</option>
              <option value="avo_masc">Avô</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <Label>Profissional Responsável</Label>
            <Input value={profissionalResponsavel} onChange={(e) => setProfissionalResponsavel(e.target.value)} />
          </div>
        </div>
      </Card>
      
      {/* Seção 1: Percepção Geral da Transição */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 1: Percepção Geral da Transição</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Como você avalia a transição para o profissional?</Label>
            <select value={avaliacao} onChange={(e) => setAvaliacao(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="muito_positiva">Muito positiva</option>
              <option value="positiva">Positiva</option>
              <option value="neutra">Neutra</option>
              <option value="negativa">Negativa</option>
              <option value="muito_negativa">Muito negativa</option>
            </select>
          </div>
          
          <div>
            <Label>Principais Aspectos Positivos da Transição</Label>
            <Textarea value={aspectosPositivos} onChange={(e) => setAspectosPositivos(e.target.value)} 
              rows={3} placeholder="Descreva os aspectos positivos..." />
          </div>
          
          <div>
            <Label>Principais Preocupações com a Transição</Label>
            <Textarea value={preocupacoes} onChange={(e) => setPreocupacoes(e.target.value)} 
              rows={3} placeholder="Descreva as preocupações..." />
          </div>
          
          <div>
            <Label>Como a transição afetou sua família?</Label>
            <select value={impacto} onChange={(e) => setImpacto(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="fortaleceu">Fortaleceu a família</option>
              <option value="nao_afetou">Não afetou significativamente</option>
              <option value="alguns_desafios">Causou alguns desafios</option>
              <option value="prejudicou">Prejudicou significativamente</option>
              <option value="muito_prejudicial">Muito prejudicial</option>
            </select>
          </div>
          
          <div>
            <Label>Descreva o Impacto</Label>
            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} 
              rows={3} placeholder="Descreva o impacto na família..." />
          </div>
        </div>
      </Card>
      
      {/* Seção 2: Adaptação e Bem-estar do Atleta */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 2: Adaptação e Bem-estar do Atleta</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Bem-estar Geral do Atleta</Label>
            <select value={bemEstarGeral} onChange={(e) => setBemEstarGeral(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="excelente">Excelente</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
              <option value="ruim">Ruim</option>
              <option value="muito_ruim">Muito ruim</option>
            </select>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Mudanças Observadas desde a Transição</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Humor/Disposição</Label>
                <select value={humor} onChange={(e) => setHumor(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="melhorou">Melhorou</option>
                  <option value="sem_mudanca">Sem mudança</option>
                  <option value="piorou">Piorou</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Confiança</Label>
                <select value={confianca} onChange={(e) => setConfianca(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="melhorou">Melhorou</option>
                  <option value="sem_mudanca">Sem mudança</option>
                  <option value="piorou">Piorou</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Saúde Física</Label>
                <select value={saudeFisica} onChange={(e) => setSaudeFisica(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="melhorou">Melhorou</option>
                  <option value="sem_mudanca">Sem mudança</option>
                  <option value="piorou">Piorou</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Saúde Mental</Label>
                <select value={saudeMental} onChange={(e) => setSaudeMental(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="melhorou">Melhorou</option>
                  <option value="sem_mudanca">Sem mudança</option>
                  <option value="piorou">Piorou</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Comportamentos e Atitudes</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Motivação</Label>
                <select value={motivacao} onChange={(e) => setMotivacao(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="melhorou">Melhorou</option>
                  <option value="sem_mudanca">Sem mudança</option>
                  <option value="piorou">Piorou</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Responsabilidade</Label>
                <select value={responsabilidade} onChange={(e) => setResponsabilidade(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="melhorou">Melhorou</option>
                  <option value="sem_mudanca">Sem mudança</option>
                  <option value="piorou">Piorou</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Seção 3: Suporte Familiar */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 3: Suporte Familiar</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Tipo de Suporte Oferecido</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={emocional} onChange={(e) => setEmocional(e.target.checked)} className="rounded" />
                <span>Suporte emocional/Encorajamento</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={logistico} onChange={(e) => setLogistico(e.target.checked)} className="rounded" />
                <span>Suporte logístico (transporte, alimentação)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={financeiro} onChange={(e) => setFinanceiro(e.target.checked)} className="rounded" />
                <span>Suporte financeiro</span>
              </label>
            </div>
          </div>
          
          <div>
            <Label>Qualidade do Suporte que Oferece</Label>
            <select value={avaliacaoSuporte} onChange={(e) => setAvaliacaoSuporte(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="muito_adequado">Muito adequado</option>
              <option value="adequado">Adequado</option>
              <option value="moderado">Moderadamente adequado</option>
              <option value="inadequado">Inadequado</option>
              <option value="muito_inadequado">Muito inadequado</option>
            </select>
          </div>
          
          <div>
            <Label>Dificuldades em Oferecer Suporte</Label>
            <Textarea value={dificuldades} onChange={(e) => setDificuldades(e.target.value)} 
              rows={3} placeholder="Descreva as dificuldades..." />
          </div>
          
          <div>
            <Label>Sua família necessita de suporte do clube?</Label>
            <select value={necessita} onChange={(e) => setNecessita(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="sim_muito">Sim, muito</option>
              <option value="sim_moderado">Sim, moderadamente</option>
              <option value="pouco">Pouco</option>
              <option value="nao">Não necessita</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Seção 4: Comunicação e Relacionamento com o Clube */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seção 4: Comunicação e Relacionamento com o Clube</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Qualidade da Comunicação do Clube</Label>
            <select value={avaliacaoComunicacao} onChange={(e) => setAvaliacaoComunicacao(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="excelente">Excelente</option>
              <option value="boa">Boa</option>
              <option value="regular">Regular</option>
              <option value="ruim">Ruim</option>
              <option value="muito_ruim">Muito ruim</option>
            </select>
          </div>
          
          <div>
            <Label>Frequência de Contato com o Clube</Label>
            <select value={frequencia} onChange={(e) => setFrequencia(e.target.value)} 
              className="w-full border rounded-md p-2">
              <option value="semanal">Semanal</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
              <option value="ocasional">Ocasional</option>
              <option value="raramente">Raramente</option>
            </select>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Transparência e Informação</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Processo de Transição</Label>
                <select value={processoTransicao} onChange={(e) => setProcessoTransicao(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="sim">Sim</option>
                  <option value="parcialmente">Parcialmente</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Expectativas do Clube</Label>
                <select value={expectativasClube} onChange={(e) => setExpectativasClube(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="sim">Sim</option>
                  <option value="parcialmente">Parcialmente</option>
                  <option value="nao">Não</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Relacionamento com Profissionais</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Técnico</Label>
                <select value={tecnico} onChange={(e) => setTecnico(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="excelente">Excelente</option>
                  <option value="bom">Bom</option>
                  <option value="regular">Regular</option>
                  <option value="ruim">Ruim</option>
                </select>
              </div>
              
              <div>
                <Label className="text-sm">Assistente Social</Label>
                <select value={assistenteSocial} onChange={(e) => setAssistenteSocial(e.target.value)} 
                  className="w-full border rounded-md p-2">
                  <option value="excelente">Excelente</option>
                  <option value="bom">Bom</option>
                  <option value="regular">Regular</option>
                  <option value="ruim">Ruim</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Observações Finais */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações Finais</h3>
        <Textarea value={observacoesFinais} onChange={(e) => setObservacoesFinais(e.target.value)} 
          rows={4} placeholder="Observações adicionais, sugestões ou comentários..." />
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
