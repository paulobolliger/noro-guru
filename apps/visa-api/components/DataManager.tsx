import React, { useState, useEffect } from 'react';
import { CountryList } from './CountryList';
import { CountryDetail } from './CountryDetail';
import { Header } from './Header';
import { getCountries } from '../services/supabaseService';
import type { CountryVisaInfo } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface DataManagerProps {
    t: (key: string) => string;
    onLogout: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ t, onLogout }) => {
  const [countries, setCountries] = useState<CountryVisaInfo[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryVisaInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const data = await getCountries();
        setCountries(data);
      } catch (err) {
        setError('Failed to load country data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectCountry = (country: CountryVisaInfo) => {
    setSelectedCountry(country);
  };

  const handleBackToList = () => {
    setSelectedCountry(null);
  };

  const handleUpdateCountryData = (updatedCountry: CountryVisaInfo) => {
    setCountries(prevCountries => 
      prevCountries.map(c => c.id === updatedCountry.id ? updatedCountry : c)
    );
    setSelectedCountry(updatedCountry);
  };

  return (
    <>
      <Header t={t} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
        ) : selectedCountry ? (
          <CountryDetail 
            country={selectedCountry} 
            onBack={handleBackToList}
            onUpdate={handleUpdateCountryData}
            t={t}
          />
        ) : (
          <CountryList countries={countries} onSelectCountry={handleSelectCountry} t={t} />
        )}
      </main>
    </>
  );
};
