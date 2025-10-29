import React, { useState } from 'react';
import type { CountryVisaInfo, ApprovalTip, SecurityInfo, HealthInfo, VisaType, ProcessStep, GeneralInfo } from '../types';
import { getLiveVisaData } from '../services/visaApiService';
import { updateCountry } from '../services/supabaseService';
import { generateSummaryWithAI } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { AutomationStatus } from '../types';
import { AIResearchAssistant } from './AIResearchAssistant';

interface CountryDetailProps {
  country: CountryVisaInfo;
  onBack: () => void;
  onUpdate: (updatedCountry: CountryVisaInfo) => void;
  t: (key: string) => string;
}

const DangerBadge: React.FC<{ level: SecurityInfo['dangerLevel'] | undefined }> = ({ level }) => {
    if (!level) return null;
    const styles = {
        'Alto': 'bg-red-100 text-red-800',
        'Médio': 'bg-yellow-100 text-yellow-800',
        'Baixo': 'bg-green-100 text-green-800',
        'Desconhecido': 'bg-slate-100 text-slate-800',
    };
    return <span className={`px-3 py-1 text-sm font-bold rounded-full ${styles[level]}`}>{level}</span>;
}

// Reusable input component for clean forms
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" />
);


export const CountryDetail: React.FC<CountryDetailProps> = ({ country, onBack, onUpdate, t }) => {
  const [liveData, setLiveData] = useState<Partial<CountryVisaInfo> | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [editableCountry, setEditableCountry] = useState<CountryVisaInfo>(country);

  const fetchLiveData = async () => {
    setIsLoadingApi(true);
    setLiveData(null);
    try {
      const data = await getLiveVisaData(country.country_code);
      setLiveData(data);
    } catch (error) {
      console.error("Failed to fetch live data:", error);
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleGenerateTip = async () => {
    setIsGeneratingAI(true);
    try {
        const generatedText = await generateSummaryWithAI(editableCountry);
        handleAddListItem('approval_tips', {
            title: t('aiGeneratedTipTitle'),
            description: generatedText,
            priority: 'medium',
        });
    } catch (error) {
        console.error("Failed to generate AI tip:", error);
    } finally {
        setIsGeneratingAI(false);
    }
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      let dataToSave = { ...editableCountry };
      if (liveData) {
        // Merge only the specific fields updated by the API
        const mergedGeneralInfo = { ...dataToSave.general_info, ...liveData.general_info };
        dataToSave = {
            ...dataToSave,
            general_info: mergedGeneralInfo as GeneralInfo,
            official_visa_link: liveData.official_visa_link || dataToSave.official_visa_link,
            data_source: liveData.data_source || dataToSave.data_source,
        };
      }
      dataToSave.last_verified = new Date().toISOString().split('T')[0];
      dataToSave.automation_status = AutomationStatus.OK;
      
      const updated = await updateCountry(dataToSave);
      onUpdate(updated);
      setLiveData(null);
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (section: keyof CountryVisaInfo, field: string, value: any) => {
    setEditableCountry(prev => {
        if (section === 'general_info' || section === 'health_info' || section === 'security_info') {
            return {
                ...prev,
                [section]: {
                    ...(prev[section] as object),
                    [field]: value
                }
            }
        }
        return { ...prev, [field]: value };
    });
  };

  const handleListItemChange = (section: 'visa_types' | 'process_steps' | 'approval_tips' | 'required_documents', index: number, field: string | null, value: any) => {
    setEditableCountry(prev => {
        const list = [...prev[section]];
        if (field) {
            (list[index] as any)[field] = value;
        } else {
             list[index] = value;
        }
        return { ...prev, [section]: list };
    });
  };

  const handleAddListItem = (section: 'visa_types' | 'process_steps' | 'approval_tips' | 'required_documents', newItem: any) => {
    setEditableCountry(prev => ({
        ...prev,
        [section]: [...prev[section], newItem]
    }));
  };

  const handleRemoveListItem = (section: 'visa_types' | 'process_steps' | 'approval_tips' | 'required_documents', index: number) => {
    setEditableCountry(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const generalInfo = editableCountry.general_info;
  const liveGeneralInfo = liveData?.general_info;

  const renderLiveBadge = (currentValue: any, liveValue: any) => {
      const hasChanged = liveValue !== undefined && JSON.stringify(currentValue) !== JSON.stringify(liveValue);
      if (!hasChanged) return null;
      const displayValue = (val: any) => (typeof val === 'boolean' ? (val ? 'Sim' : 'Não') : val || 'N/A');
      
      return (
          <span className="mt-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-md p-1 block animate__animated animate__flash">
              API: {displayValue(liveValue)}
          </span>
      )
  }

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      {/* Header and actions */}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span>{t('backToList')}</span>
        </button>
        <div className="flex items-center space-x-3">
          <button onClick={fetchLiveData} disabled={isLoadingApi} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center">
            {isLoadingApi ? <LoadingSpinner size="w-5 h-5" /> : t('syncWithApi')}
          </button>
          <button onClick={handleSaveChanges} disabled={isSaving} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center">
            {isSaving ? <LoadingSpinner size="w-5 h-5" /> : t('saveChanges')}
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <div className="flex items-start space-x-4">
          <span className="text-5xl">{editableCountry.flag_emoji}</span>
          <div>
            <h2 className="text-3xl font-bold">{editableCountry.country}</h2>
            {editableCountry.is_territory && <p className="text-md font-semibold text-indigo-600">{t('territoryLabelDetail')}</p>}
          </div>
        </div>
        
        {generalInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div><label className="text-sm font-medium text-slate-500">{t('totalCostLabel')}</label><Input value={generalInfo.totalCost || ''} onChange={e => handleFieldChange('general_info', 'totalCost', e.target.value)} />{renderLiveBadge(generalInfo.totalCost, liveGeneralInfo?.totalCost)}</div>
                <div><label className="text-sm font-medium text-slate-500">{t('maxValidityLabel')}</label><Input value={generalInfo.maxValidity || ''} onChange={e => handleFieldChange('general_info', 'maxValidity', e.target.value)} />{renderLiveBadge(generalInfo.maxValidity, liveGeneralInfo?.maxValidity)}</div>
                <div><label className="text-sm font-medium text-slate-500">{t('processingTimeLabel')}</label><Input value={generalInfo.processingTime || ''} onChange={e => handleFieldChange('general_info', 'processingTime', e.target.value)} />{renderLiveBadge(generalInfo.processingTime, liveGeneralInfo?.processingTime)}</div>
                <div><label className="text-sm font-medium text-slate-500">{t('officialLinkLabel')}</label><Input value={editableCountry.official_visa_link || ''} onChange={e => handleFieldChange('official_visa_link', 'official_visa_link', e.target.value)} />{renderLiveBadge(editableCountry.official_visa_link, liveData?.official_visa_link)}</div>
                <div className="flex items-center gap-4"><label className="text-sm font-medium text-slate-500">{t('interviewLabel')}</label><input type="checkbox" checked={generalInfo.interviewRequired || false} onChange={e => handleFieldChange('general_info', 'interviewRequired', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />{renderLiveBadge(generalInfo.interviewRequired, liveGeneralInfo?.interviewRequired)}</div>
                <div className="flex items-center gap-4"><label className="text-sm font-medium text-slate-500">{t('onlineAppLabel')}</label><input type="checkbox" checked={generalInfo.onlineApplication || false} onChange={e => handleFieldChange('general_info', 'onlineApplication', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />{renderLiveBadge(generalInfo.onlineApplication, liveGeneralInfo?.onlineApplication)}</div>
                <div className="flex items-center gap-4"><label className="text-sm font-medium text-slate-500">{t('biometricsLabel')}</label><input type="checkbox" checked={generalInfo.biometricsRequired || false} onChange={e => handleFieldChange('general_info', 'biometricsRequired', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />{renderLiveBadge(generalInfo.biometricsRequired, liveGeneralInfo?.biometricsRequired)}</div>
            </div>
        )}
      </div>
      
      {/* Visa Types */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">{t('visaTypesTitle')}</h3>
          <div className="space-y-4">
              {editableCountry.visa_types.map((visa, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2 relative">
                      <button onClick={() => handleRemoveListItem('visa_types', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                      <div className="grid grid-cols-2 gap-2">
                          <div><label className="text-xs font-semibold text-slate-500">{t('nameLabel')}</label><Input value={visa.name} onChange={e => handleListItemChange('visa_types', index, 'name', e.target.value)} /></div>
                          <div><label className="text-xs font-semibold text-slate-500">{t('costLabel')}</label><Input value={visa.cost || ''} onChange={e => handleListItemChange('visa_types', index, 'cost', e.target.value)} /></div>
                          <div><label className="text-xs font-semibold text-slate-500">{t('durationLabel')}</label><Input value={visa.duration || ''} onChange={e => handleListItemChange('visa_types', index, 'duration', e.target.value)} /></div>
                          <div><label className="text-xs font-semibold text-slate-500">{t('validityLabel')}</label><Input value={visa.validity || ''} onChange={e => handleListItemChange('visa_types', index, 'validity', e.target.value)} /></div>
                      </div>
                      <div><label className="text-xs font-semibold text-slate-500">{t('descriptionLabel')}</label><Textarea value={visa.description} onChange={e => handleListItemChange('visa_types', index, 'description', e.target.value)} /></div>
                  </div>
              ))}
          </div>
          <button onClick={() => handleAddListItem('visa_types', { code: 'NEW', name: '', description: '' })} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">{t('addVisaTypeButton')}</button>
      </div>
      
      {/* Documents and Steps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">{t('requiredDocsTitle')}</h3>
          <div className="space-y-2">
            {editableCountry.required_documents.map((doc, i) => 
                <div key={i} className="flex gap-2 items-center">
                    <Input value={doc} onChange={e => handleListItemChange('required_documents', i, null, e.target.value)} />
                    <button onClick={() => handleRemoveListItem('required_documents', i)} className="text-red-500 hover:text-red-700 p-1">&times;</button>
                </div>
            )}
          </div>
          <button onClick={() => handleAddListItem('required_documents', '')} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">{t('addDocumentButton')}</button>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">{t('processStepsTitle')}</h3>
          <div className="space-y-3">
            {editableCountry.process_steps.map((step, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2 relative">
                    <button onClick={() => handleRemoveListItem('process_steps', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                    <div><label className="text-xs font-semibold text-slate-500">{t('titleLabel')}</label><Input value={step.title} onChange={e => handleListItemChange('process_steps', index, 'title', e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-slate-500">URL</label><Input value={step.url || ''} onChange={e => handleListItemChange('process_steps', index, 'url', e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-slate-500">{t('descriptionLabel')}</label><Textarea value={step.description} onChange={e => handleListItemChange('process_steps', index, 'description', e.target.value)} /></div>
                </div>
            ))}
          </div>
           <button onClick={() => handleAddListItem('process_steps', { step: editableCountry.process_steps.length + 1, title: '', description: '' })} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">{t('addStepButton')}</button>
        </div>
      </div>

       {/* Health and Security */}
       <div className="grid md:grid-cols-2 gap-6">
          {editableCountry.health_info && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
                  <h3 className="font-bold text-lg">🩺 {t('healthTitle')}</h3>
                  <div><label className="text-sm font-medium text-slate-500">{t('mandatoryVaccinesLabel')}</label><Input value={editableCountry.health_info.mandatoryVaccines.join(', ')} onChange={e => handleFieldChange('health_info', 'mandatoryVaccines', e.target.value.split(',').map(s => s.trim()))} /></div>
                  <div><label className="text-sm font-medium text-slate-500">{t('recommendedVaccinesLabel')}</label><Input value={editableCountry.health_info.recommendedVaccines?.join(', ') || ''} onChange={e => handleFieldChange('health_info', 'recommendedVaccines', e.target.value.split(',').map(s => s.trim()))} /></div>
                  <div><label className="text-sm font-medium text-slate-500">{t('healthRisksLabel')}</label><Input value={editableCountry.health_info.healthRisks?.join(', ') || ''} onChange={e => handleFieldChange('health_info', 'healthRisks', e.target.value.split(',').map(s => s.trim()))} /></div>
              </div>
          )}
           {editableCountry.security_info && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">🛡️ {t('securityTitle')}</h3>
                    <DangerBadge level={editableCountry.security_info.dangerLevel} />
                </div>
                  <div><label className="text-sm font-medium text-slate-500">{t('dangerLevelLabel')}</label><Select value={editableCountry.security_info.dangerLevel} onChange={e => handleFieldChange('security_info', 'dangerLevel', e.target.value)}><option>Baixo</option><option>Médio</option><option>Alto</option><option>Desconhecido</option></Select></div>
                  <div><label className="text-sm font-medium text-slate-500">{t('criticalWarningsLabel')}</label><Input value={editableCountry.security_info.criticalWarnings?.join(', ') || ''} onChange={e => handleFieldChange('security_info', 'criticalWarnings', e.target.value.split(',').map(s => s.trim()))} /></div>
                  <div><label className="text-sm font-medium text-slate-500">{t('areasToAvoidLabel')}</label><Input value={editableCountry.security_info.areasToAvoid?.join(', ') || ''} onChange={e => handleFieldChange('security_info', 'areasToAvoid', e.target.value.split(',').map(s => s.trim()))} /></div>
              </div>
          )}
       </div>
      
      {/* Approval Tips */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{t('approvalTipsTitle')}</h3>
            <button onClick={handleGenerateTip} disabled={isGeneratingAI} className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 disabled:bg-purple-300 transition-colors flex items-center space-x-2">
                {isGeneratingAI ? <LoadingSpinner size="w-4 h-4" /> : <span>✨ {t('generateWithAiButton')}</span>}
            </button>
          </div>
          <div className="space-y-4">
            {editableCountry.approval_tips.map((tip, i) => (
                <div key={i} className={`p-4 rounded-lg relative ${tip.title === t('aiGeneratedTipTitle') ? 'bg-purple-50 border-l-4 border-purple-400' : 'bg-slate-50'}`}>
                    <button onClick={() => handleRemoveListItem('approval_tips', i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">&times;</button>
                    <div><label className="text-xs font-semibold text-slate-500">{t('titleLabel')}</label><Input value={tip.title} onChange={e => handleListItemChange('approval_tips', i, 'title', e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-slate-500">{t('descriptionLabel')}</label><Textarea value={tip.description} onChange={e => handleListItemChange('approval_tips', i, 'description', e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-slate-500">{t('priorityLabel')}</label><Select value={tip.priority || 'low'} onChange={e => handleListItemChange('approval_tips', i, 'priority', e.target.value)}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></Select></div>
                </div>
            ))}
          </div>
          <button onClick={() => handleAddListItem('approval_tips', { title: '', description: '', priority: 'low' })} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">{t('addTipButton')}</button>
        </div>

        <AIResearchAssistant countryName={editableCountry.country} t={t} />
    </div>
  );
};
