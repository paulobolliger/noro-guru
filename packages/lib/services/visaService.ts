import { createCollectionService, type RuntimeDocument } from './runtimeCrud';

export interface VisaCountry extends RuntimeDocument {
  country: string;
  country_code: string;
  flag_emoji?: string;
  slug: string;
  last_verified?: string;
  priority_level?: number;
}

export interface VisaRequirement extends RuntimeDocument {
  countryId: string;
  visaType?: string;
  requirement: string;
}

export const visaCountriesService = createCollectionService<VisaCountry>(
  'visa_countries',
);
export const visaRequirementsService = createCollectionService<VisaRequirement>(
  'visa_requirements',
);

export const listVisaCountries = visaCountriesService.list;
export const getVisaCountryById = visaCountriesService.getById;
export const createVisaCountry = visaCountriesService.create;
export const updateVisaCountry = visaCountriesService.update;
export const removeVisaCountry = visaCountriesService.remove;
