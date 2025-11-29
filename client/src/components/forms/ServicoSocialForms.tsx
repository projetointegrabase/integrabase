import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import FichaAcompanhamentoForm from "./FichaAcompanhamentoForm";
import FeedbackFamiliarForm from "./FeedbackFamiliarForm";

type FormType = 'list' | 'ficha' | 'feedback';

export default function ServicoSocialForms() {
  const [currentView, setCurrentView] = useState<FormType>('list');
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  
  const { data: forms, isLoading } = trpc.socialForms.listSocialForms.useQuery();
  
  if (currentView === 'ficha') {
    return (
      <FichaAcompanhamentoForm
        formId={selectedFormId}
        onBack={() => {
          setCurrentView('list');
          setSelectedFormId(null);
        }}
      />
    );
  }
  
  if (currentView === 'feedback') {
    return (
      <FeedbackFamiliarForm
        formId={selectedFormId}
        onBack={() => {
          setCurrentView('list');
          setSelectedFormId(null);
        }}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Formulários do Serviço Social</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie fichas de acompanhamento e feedback familiar
          </p>
        </div>
      </div>
      
      {/* Botões de Novo Formulário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#C8102E]"
          onClick={() => setCurrentView('ficha')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#C8102E] bg-opacity-10 rounded-lg">
              <FileText className="h-8 w-8 text-[#C8102E]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">
                Ficha de Acompanhamento Social
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Avaliar situação familiar, social e psicossocial do atleta
              </p>
            </div>
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#C8102E]"
          onClick={() => setCurrentView('feedback')}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#C8102E] bg-opacity-10 rounded-lg">
              <Users className="h-8 w-8 text-[#C8102E]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">
                Formulário de Feedback Familiar
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Coletar perspectivas da família sobre a transição
              </p>
            </div>
            <Plus className="h-6 w-6 text-gray-400" />
          </div>
        </Card>
      </div>
      
      {/* Lista de Formulários Recentes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Formulários Recentes</h3>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : forms && forms.length > 0 ? (
          <div className="space-y-3">
            {forms.map((form) => (
              <Card key={form.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedFormId(form.id);
                  setCurrentView(form.formType === 'social' ? 'ficha' : 'feedback');
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#C8102E]" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {form.formType === 'social' ? 'Ficha de Acompanhamento' : 'Feedback Familiar'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(form.submittedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    form.status === 'completed' ? 'bg-green-100 text-green-800' :
                    form.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {form.status === 'completed' ? 'Completo' :
                     form.status === 'reviewed' ? 'Revisado' : 'Rascunho'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Nenhum formulário criado ainda</p>
            <p className="text-sm text-gray-500 mt-1">
              Clique em um dos cards acima para criar seu primeiro formulário
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
