import React, { useState, useMemo } from 'react';
import type { CountryVisaInfo } from '../types';
import { AutomationStatus } from '../types';

interface CountryListProps {
  countries: CountryVisaInfo[];
  onSelectCountry: (country: CountryVisaInfo) => void;
  t: (key: string) => string;
}

const StatusBadge: React.FC<{ status: AutomationStatus }> = ({ status }) => {
  const statusStyles = {
    [AutomationStatus.OK]: 'bg-green-100 text-green-800',
    [AutomationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [AutomationStatus.ERROR]: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export const CountryList: React.FC<CountryListProps> = ({ countries, onSelectCountry, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AutomationStatus | 'ALL'>('ALL');

  const filteredCountries = useMemo(() => {
    return countries
      .filter(country => {
        if (statusFilter === 'ALL') return true;
        return country.automation_status === statusFilter;
      })
      .filter(country => {
        if (!searchTerm) return true;
        return country.country.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [countries, searchTerm, statusFilter]);

  const filterButtons: { labelKey: string, value: AutomationStatus | 'ALL' }[] = [
    { labelKey: 'filterAll', value: 'ALL' },
    { labelKey: 'filterPending', value: AutomationStatus.PENDING },
    { labelKey: 'filterOk', value: AutomationStatus.OK },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate__animated animate__fadeIn">
      <h2 className="text-2xl font-bold mb-4">{t('visaManagerTitle')}</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          {filterButtons.map(btn => (
             <button
              key={btn.value}
              onClick={() => setStatusFilter(btn.value)}
              className={`w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                statusFilter === btn.value
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(btn.labelKey)}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-slate-200">
            <tr>
              <th className="p-3 text-sm font-semibold text-slate-500">{t('tableHeaderCountry')}</th>
              <th className="p-3 text-sm font-semibold text-slate-500">{t('tableHeaderStatus')}</th>
              <th className="p-3 text-sm font-semibold text-slate-500">{t('tableHeaderLastVerified')}</th>
              <th className="p-3 text-sm font-semibold text-slate-500">{t('tableHeaderSource')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map(country => (
              <tr
                key={country.id}
                onClick={() => onSelectCountry(country)}
                className="border-b border-slate-100 hover:bg-indigo-50 cursor-pointer transition-colors group"
              >
                <td className="p-4 flex items-center space-x-4">
                  <span className="text-2xl">{country.flag_emoji}</span>
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600">{country.country}</span>
                    {country.is_territory && <span className="ml-2 text-xs text-slate-500">({t('territoryLabel')})</span>}
                  </div>
                </td>
                <td className="p-4">
                  <StatusBadge status={country.automation_status} />
                </td>
                <td className="p-4 text-slate-600">{new Date(country.last_verified).toLocaleDateString()}</td>
                <td className="p-4 text-sm text-slate-500">{country.data_source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCountries.length === 0 && (
          <p className="text-center p-8 text-slate-500">{t('noCountriesFound')}</p>
        )}
      </div>
    </div>
  );
};
