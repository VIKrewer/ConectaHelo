export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  content?: string;
}

const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    title: "Avanços no diagnóstico precoce do TEA",
    description: "Novas tecnologias e métodos estão tornando possível identificar sinais de autismo em crianças cada vez mais cedo, permitindo intervenções mais eficazes.",
    url: "https://www.autismspeaks.org/early-signs-autism",
    source: "Autism Speaks",
    publishedAt: new Date().toISOString(),
    category: "Diagnóstico",
  },
  {
    title: "Terapias baseadas em jogos para autistas",
    description: "Estudos mostram que jogos terapêuticos podem auxiliar significativamente no desenvolvimento de habilidades sociais e cognitivas.",
    url: "https://www.autismspeaks.org/gaming-autism",
    source: "Autism Speaks",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    category: "Terapias",
  },
];

export const fetchAutismNews = async (): Promise<NewsArticle[]> => {
  try {
    // Tentando buscar artigos reais sobre autismo
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/Autism`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    
    // Criar artigo a partir do Wikipedia
    const wikiArticle: NewsArticle = {
      title: "Entendendo o Transtorno do Espectro Autista",
      description: data.extract || "Informações atualizadas sobre o Transtorno do Espectro Autista.",
      url: data.content_urls?.desktop?.page || "https://pt.wikipedia.org/wiki/Transtorno_do_espectro_autista",
      source: "Wikipedia",
      publishedAt: new Date().toISOString(),
      category: "Informação Geral",
      content: data.extract,
    };

    return [wikiArticle, ...FALLBACK_ARTICLES];
  } catch (error) {
    console.error("Error fetching autism news:", error);
    return FALLBACK_ARTICLES;
  }
};

export const translateText = async (text: string, targetLang: string = "pt"): Promise<string> => {
  try {
    // Usando LibreTranslate API gratuita (requer instalação local ou serviço público)
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Retorna texto original se falhar
  }
};
