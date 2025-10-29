import type { CountryVisaInfo, GeneralInfo } from '../types';

// Configuration for Travel Buddy API
// Key must come from environment variables. Never hardcode secrets.
const TRAVEL_BUDDY_API_CONFIG = {
  apiKey: process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_TRAVEL_BUDDY_KEY,
  host: 'visa-requirement.p.rapidapi.com',
  baseUrl: 'https://visa-requirement.p.rapidapi.com/v2/visa/check',
};

// --- Start of types for Travel Buddy API Response ---
interface TravelBuddyApiResponse {
  data: {
    passport: {
      code: string;
      name: string;
    };
    destination: {
      code: string;
      name: string;
      passport_validity: string;
      embassy_url: string;
    };
    visa_rules: {
      primary_rule: {
        name: string;
        duration: string;
        color: string;
      };
      secondary_rule?: {
        name: string;
        duration: string;
        color: string;
        link?: string;
      };
    };
  };
  meta: {
    version: string;
    language: string;
    generated_at: string;
  };
}
// --- End of new types ---


/**
 * Fetches fresh visa data from the "Travel Buddy" external API.
 * @param destinationCountryCode The ISO alpha-2 code of the destination country.
 * @param passportCountryCode The ISO alpha-2 code of the passport holder's country (defaults to 'BR').
 * @returns A Promise that resolves to a partial CountryVisaInfo object with the live data.
 */
export const getLiveVisaData = async (destinationCountryCode: string, passportCountryCode: string = 'BR'): Promise<Partial<CountryVisaInfo>> => {
  // Basic validation for API key presence
  if (!TRAVEL_BUDDY_API_CONFIG.apiKey) {
    console.warn('RAPIDAPI key not configured. Set RAPIDAPI_KEY or RAPIDAPI_TRAVEL_BUDDY_KEY.');
    return { data_source: 'Travel Buddy API (No Key)' };
  }

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': TRAVEL_BUDDY_API_CONFIG.apiKey,
      'X-RapidAPI-Host': TRAVEL_BUDDY_API_CONFIG.host
    },
    body: JSON.stringify({
      passport: passportCountryCode,
      destination: destinationCountryCode
    })
  };

  try {
    const response = await fetch(TRAVEL_BUDDY_API_CONFIG.baseUrl, options);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      console.error('Travel Buddy API Error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json() as TravelBuddyApiResponse;
    
    // Handle cases where the API returns a success status but no data object.
    if (!result.data) {
        console.warn('Travel Buddy API returned no data for the given country pair.');
        return { data_source: 'Travel Buddy API (No Data)' };
    }

    const { data } = result;

    // --- Map API response to our internal structure ---
    const partialInfo: Partial<CountryVisaInfo> = {
      data_source: 'Travel Buddy API',
    };

    const generalInfoUpdate: Partial<GeneralInfo> = {};

    // Logic to display visa rules as suggested by the API documentation
    const { primary_rule, secondary_rule } = data.visa_rules;
    let validityDisplay = '';
    let duration = '';
    
    if (primary_rule) {
        validityDisplay = primary_rule.name;
        if (secondary_rule) {
            validityDisplay += ` / ${secondary_rule.name}`;
        }
    }

    if (primary_rule?.duration) {
        duration = primary_rule.duration;
    } else if (secondary_rule?.duration) {
        duration = secondary_rule.duration;
    }

    if (duration) {
        validityDisplay += ` - ${duration}`;
    }

    generalInfoUpdate.maxValidity = validityDisplay || 'N/A';
    
    // Only add general_info if it has been updated.
    if (Object.keys(generalInfoUpdate).length > 0) {
      // We are creating a new object to avoid modifying the original country object directly
      partialInfo.general_info = generalInfoUpdate as GeneralInfo;
    }
    
    if (data.destination.embassy_url) {
        partialInfo.official_visa_link = data.destination.embassy_url;
    }

    return partialInfo;

  } catch (error) {
    console.error('Failed to fetch or process live visa data:', error);
    // Return a partial object with an error source to be displayed in the UI.
    return {
      data_source: 'Travel Buddy API (Error)',
    };
  }
};
