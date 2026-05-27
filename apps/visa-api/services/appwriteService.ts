import type { CountryVisaInfo } from '../types';
import {
  type VisaCountry,
  createVisaCountry,
  getVisaCountryById,
  listVisaCountries,
  removeVisaCountry,
  updateVisaCountry,
} from '@noro/lib/services/visaService';
import type { CreateDocumentInput, UpdateDocumentInput } from '@noro/lib/services/appwriteCrud';

const toCountryVisaInfo = (country: VisaCountry): CountryVisaInfo =>
  ({
    ...country,
    id: country.$id,
  }) as CountryVisaInfo;

export const getCountries = async (): Promise<CountryVisaInfo[]> => {
  const countries = await listVisaCountries();
  return countries.map(toCountryVisaInfo);
};

export const getCountryById = async (id: string): Promise<CountryVisaInfo | null> => {
  const country = await getVisaCountryById(id);
  return country ? toCountryVisaInfo(country) : null;
};

export const createCountry = async (
  data: Omit<CountryVisaInfo, '$id' | '$createdAt' | '$updatedAt'>,
): Promise<CountryVisaInfo> => {
  const country = await createVisaCountry(data as unknown as CreateDocumentInput<VisaCountry>);
  return toCountryVisaInfo(country);
};

export const updateCountry = async (
  id: string,
  data: Partial<CountryVisaInfo>,
): Promise<CountryVisaInfo> => {
  const country = await updateVisaCountry(id, data as UpdateDocumentInput<VisaCountry>);
  return toCountryVisaInfo(country);
};

export const deleteCountry = async (id: string): Promise<void> => {
  await removeVisaCountry(id);
};
