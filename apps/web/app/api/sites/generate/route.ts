import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { SimpleBlueprintSchema, adaptSimpleBlueprint, BlueprintSchema } from '@noro/types/blueprint';

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let counter = 1;
  
  while (true) {
    const { data } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (!data) break;
    
    slug = `${slugify(base)}-${counter}`;
    counter++;
  }
  
  return slug;
}

function buildPrompt(params: {
  language: string;
  market: string;
  positioning: string;
  services: string[];
  vibe?: string;
}): string {
  const servicesText = params.services.map(s => `"${s}"`).join(', ');
  const vibeInstruction = params.vibe 
    ? `IMPORTANT: The client specifically requested a "${params.vibe}" vibe. Ensure all design choices (copy, colors, variants) matches this style.`
    : `PICK A VIBE that matches the positioning (e.g., Luxury -> 'elegant', Adventure -> 'bold')`;
  
  return `You are a world-class digital strategist and copywriter specialized in creating high-converting tourism websites.

Your task: Generate a COMPLETE, PROFESSIONAL website blueprint that will WOW the client.

Business Details:
- Language: ${params.language}
- Market: ${params.market}
- Business Type: Travel Agency / Tourism
- Unique Value Proposition: ${params.positioning}
- Core Services: ${servicesText}
${params.vibe ? `- REQUESTED VIBE: ${params.vibe}` : ''}

CRITICAL SUCCESS FACTORS:
1. Use PERSUASIVE, emotion-driven copy that makes people want to book NOW
2. Include SPECIFIC Unsplash image URLs for every visual element
3. Create a PREMIUM feel - this should look like a $10k+ website
4. Focus heavily on CONVERSION - every section should guide to contact
5. Use the PRIMARY COLOR strategically for CTAs and highlights

Required JSON Structure (version 1.0):

{
  "version": "1.0",
  "meta": {
    "language": "${params.language}",
    "title": "string - compelling, under 60 chars, keyword-rich",
    "description": "string - persuasive, under 160 chars, benefit-focused"
  },
  "theme": {
    "primaryColor": "#HEXCOLOR - choose a vibrant, trustworthy color (blues, oranges, teals work well)",
    "fontFamily": "Inter",
    "vibe": "${params.vibe || "SELECT ONE: 'modern', 'minimal', 'bold', 'elegant', 'playful', 'startup'"}" 
  },
  "navigation": [
    { "label": "Início", "sectionId": "#hero" },
    { "label": "Serviços", "sectionId": "#services" },
    { "label": "Sobre", "sectionId": "#about" },
    { "label": "Contato", "sectionId": "#contact" }
  ],
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "config": {
        "title": "Powerful headline that promises transformation (max 80 chars)",
        "subtitle": "Supporting text that builds desire and credibility (max 150 chars)",
        "ctaText": "Action-oriented CTA (e.g., 'Planejar Minha Viagem', 'Começar Agora')",
        "backgroundImage": "https://images.unsplash.com/photo-XXXXXXX - find a stunning, relevant travel photo",
        "variant": "${params.vibe ? `SELECT ONE compatible with '${params.vibe}' vibe` : "SELECT ONE based on vibe: 'centered' (classic), 'split' (dynamic, text+image), 'immersive' (clean, image background)"}"
      }
    },
    {
      "id": "services",
      "type": "services",
      "config": {
        "title": "Section title that highlights value",
        "subtitle": "Brief explanation of what makes these services special",
        "items": [
          "Service 1 - benefit-focused phrasing",
          "Service 2 - benefit-focused phrasing", 
          "Service 3 - benefit-focused phrasing",
          "Service 4 - benefit-focused phrasing",
          "Service 5 - benefit-focused phrasing"
        ],
        "variant": "${params.vibe ? `SELECT ONE compatible with '${params.vibe}' vibe` : "SELECT ONE based on vibe: 'grid' (classic cards), 'list' (detailed list), 'bento' (modern bold grid)"}"
      }
    },
    {
      "id": "about",
      "type": "about",
      "config": {
        "title": "Why choose us section title",
        "text": "Rich, compelling story about expertise, experience, and unique approach. Include specific numbers (years, clients, destinations) to build credibility. Write 3-5 short paragraphs that build trust. Max 1500 chars."
      }
    },
    {
      "id": "cta",
      "type": "cta",
      "config": {
        "title": "Urgent, action-focused headline that creates FOMO",
        "description": "Brief text that reinforces the benefit of taking action now",
        "buttonText": "Strong CTA verb phrase",
        "backgroundColor": "use the primary color here"
      }
    },
    {
      "id": "contact",
      "type": "contact",
      "config": {
        "headline": "Inviting contact section title",
        "description": "Friendly text encouraging them to reach out via WhatsApp",
        "contactMethod": "whatsapp"
      }
    }
  ],
  "footer": {
    "text": "© 2026 [Business Name]. Todos os direitos reservados."
  }
}

CRITICAL RULES:
- ALL text must be in ${params.language}
- Use ACTIVE voice, not passive
- Focus on BENEFITS, not features
- Create URGENCY without being pushy
- Be SPECIFIC - avoid generic phrases
- Make it SCANNABLE - use short sentences
- Every image URL must be a real Unsplash photo (format: https://images.unsplash.com/photo-[id])
- Choose colors that convey trust + excitement
- contactMethod MUST be exactly "whatsapp" (lowercase)
- ${vibeInstruction}
- VARY THE SECTIONS: Don't always use default variants.
 
Return ONLY the JSON. NO markdown, NO explanations, NO code blocks.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      agencyName, 
      email, 
      language, 
      market, 
      positioning, 
      services,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      whatsapp,
      vibe
    } = body;

    if (!agencyName || !email || !language || !market || !positioning || !Array.isArray(services)) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    console.log('[GENERATE] Received wizard data:', {
      agencyName,
      email,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      whatsapp,
      vibe
    });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a senior digital strategist specialized in tourism businesses. Generate ONLY valid JSON, no markdown, no explanations.',
        },
        {
          role: 'user',
          content: buildPrompt({ language, market, positioning, services, vibe }),
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const rawOutput = completion.choices[0].message.content;
    if (!rawOutput) {
      throw new Error('AI returned empty response');
    }

    // Parse and validate
    const aiJson = JSON.parse(rawOutput);
    const simpleBlueprint = SimpleBlueprintSchema.parse(aiJson);
    const fullBlueprint = adaptSimpleBlueprint(simpleBlueprint);
    BlueprintSchema.parse(fullBlueprint);

    // Override AI theme with user-selected colors
    const customTheme = {
      ...fullBlueprint.theme,
      primaryColor: primaryColor || fullBlueprint.theme.primaryColor,
      secondaryColor: secondaryColor || undefined,
      accentColor: accentColor || undefined,
      logo: logoUrl ? { url: logoUrl, alt: agencyName } : undefined,
    };

    console.log('[GENERATE] Custom theme:', customTheme);

    // Generate slug from agency name
    const slug = await generateUniqueSlug(agencyName);

    // Save to Supabase
    // TODO: Get real tenant_id from auth context when implementing multi-tenant auth
    // For now, using a placeholder UUID - update this when auth is implemented
    const TEMP_TENANT_ID = '00000000-0000-0000-0000-000000000001';
    
    const { data: site, error } = await supabase
      .from('sites')
      .insert({
        tenant_id: TEMP_TENANT_ID,
        slug,
        name: agencyName,
        blueprint_data: {
          ...fullBlueprint,
          theme: customTheme,
        },
        theme: customTheme,
        status: 'published',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Erro ao salvar site no banco de dados');
    }

    return NextResponse.json({
      site_id: site.id,
      slug: site.slug,
      public_url: `http://localhost:3001/${site.slug}`,
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar site' },
      { status: 500 }
    );
  }
}
