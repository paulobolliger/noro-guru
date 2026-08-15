// ═══════════════════════════════════════════════════════════════════════════
// tripadvisorService.ts — Serviço TripAdvisor Content API (Prova Social, Ratings & Reviews)
// ═══════════════════════════════════════════════════════════════════════════

export interface TripAdvisorLocation {
  locationId: string;
  name: string;
  rating?: number; // Ex: 4.5
  numReviews?: number; // Ex: 1420
  ratingImageUrl?: string; // URL das bolinhas verdes oficiais do TripAdvisor
  webUrl?: string; // Link oficial do TripAdvisor
  rankingString?: string; // Ex: "#5 de 320 hotéis em Paris"
  address?: {
    street1?: string;
    city?: string;
    country?: string;
  };
}

export interface TripAdvisorReview {
  id: string;
  title: string;
  text: string;
  rating: number;
  publishedDate: string;
  user: {
    username: string;
    userLocation?: string;
  };
}

export class TripAdvisorService {
  private apiKey: string;
  private baseUrl = 'https://api.content.tripadvisor.com/api/v1';

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.TRIPADVISOR_API_KEY ||
      'f6abb31a-7b05-4d04-bc27-21aa63507efa';
  }

  /**
   * Pesquisa um local (hotel, atração ou restaurante) no TripAdvisor pelo nome ou cidade.
   */
  async searchLocation(searchQuery: string, category: 'hotels' | 'attractions' | 'geos' = 'hotels'): Promise<TripAdvisorLocation[]> {
    try {
      const url = `${this.baseUrl}/location/search?key=${this.apiKey}&searchQuery=${encodeURIComponent(searchQuery)}&category=${category}&language=pt_BR`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      if (!res.ok) return [];

      const data = await res.json();
      return (data.data || []).map((item: any) => ({
        locationId: String(item.location_id),
        name: item.name,
        address: {
          street1: item.address_obj?.street1,
          city: item.address_obj?.city,
          country: item.address_obj?.country,
        },
      }));
    } catch (e) {
      console.error('[tripadvisorService] Erro ao pesquisar local:', e);
      return [];
    }
  }

  /**
   * Obtém os detalhes completos, nota de bolinhas verdes (rating) e ranking de um local pelo LocationID.
   */
  async getLocationDetails(locationId: string): Promise<TripAdvisorLocation | null> {
    try {
      const url = `${this.baseUrl}/location/${locationId}/details?key=${this.apiKey}&language=pt_BR&currency=BRL`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      if (!res.ok) return null;

      const item = await res.json();
      return {
        locationId: String(item.location_id),
        name: item.name,
        rating: item.rating ? parseFloat(item.rating) : undefined,
        numReviews: item.num_reviews ? parseInt(item.num_reviews, 10) : undefined,
        ratingImageUrl: item.rating_image_url,
        webUrl: item.web_url,
        rankingString: item.ranking_data?.ranking_string,
        address: {
          street1: item.address_obj?.street1,
          city: item.address_obj?.city,
          country: item.address_obj?.country,
        },
      };
    } catch (e) {
      console.error('[tripadvisorService] Erro ao obter detalhes:', e);
      return null;
    }
  }

  /**
   * Obtém as últimas avaliações de viajantes (Reviews) para exibir como Prova Social no checkout/detalhes.
   */
  async getLocationReviews(locationId: string, limit = 5): Promise<TripAdvisorReview[]> {
    try {
      const url = `${this.baseUrl}/location/${locationId}/reviews?key=${this.apiKey}&language=pt_BR&limit=${limit}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      if (!res.ok) return [];

      const data = await res.json();
      return (data.data || []).map((rev: any) => ({
        id: String(rev.id),
        title: rev.title || '',
        text: rev.text || '',
        rating: rev.rating ? parseInt(rev.rating, 10) : 5,
        publishedDate: rev.published_date || '',
        user: {
          username: rev.user?.username || 'Viajante TripAdvisor',
          userLocation: rev.user?.user_location?.name,
        },
      }));
    } catch (e) {
      console.error('[tripadvisorService] Erro ao obter reviews:', e);
      return [];
    }
  }
}
