import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, BookOpen } from "lucide-react";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

const NewsArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Usando NewsAPI com termo "autism" em português e inglês
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=autismo+OR+autism+OR+TEA&language=pt&sortBy=publishedAt&pageSize=20&apiKey=YOUR_API_KEY_HERE`
        );
        
        if (!response.ok) throw new Error("Falha ao carregar notícias");
        
        const data = await response.json();
        setArticles(data.articles || []);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        setError(true);
        setLoading(false);
        
        // Fallback: artigos mocados
        setArticles([
          {
            title: "Avanços na Compreensão do Autismo",
            description: "Novas pesquisas revelam importantes descobertas sobre o desenvolvimento cognitivo em pessoas autistas.",
            url: "#",
            urlToImage: "",
            publishedAt: new Date().toISOString(),
            source: { name: "Exemplo" }
          },
          {
            title: "Tecnologia e Inclusão no TEA",
            description: "Aplicativos e ferramentas digitais estão transformando a forma como pessoas autistas se comunicam.",
            url: "#",
            urlToImage: "",
            publishedAt: new Date().toISOString(),
            source: { name: "Exemplo" }
          }
        ]);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notícias sobre Autismo
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30" aria-labelledby="news-heading">
      <div className="container-custom">
        <div className="text-center mb-12 animate-slide-up">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 id="news-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Notícias sobre Autismo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fique por dentro das últimas novidades, pesquisas e histórias sobre o espectro autista
          </p>
        </div>

        {error && (
          <div className="text-center mb-8 p-4 bg-warning/10 border border-warning rounded-lg max-w-2xl mx-auto">
            <p className="text-warning-foreground">
              ⚠️ Não foi possível carregar notícias em tempo real. Exibindo conteúdo de exemplo.
              <br />
              <span className="text-sm">Para usar a API real, adicione sua chave da NewsAPI.org no código.</span>
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.slice(0, visibleCount).map((article, index) => (
            <Card 
              key={index} 
              className="hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.description || "Sem descrição disponível"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    asChild
                    className="gap-1"
                  >
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={`Ler mais sobre: ${article.title}`}
                    >
                      Ler mais
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleCount < articles.length && (
          <div className="text-center">
            <Button 
              onClick={() => setVisibleCount(prev => Math.min(prev + 6, articles.length))}
              variant="outline"
              size="lg"
              className="hover-lift"
            >
              Carregar mais notícias
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsArticles;
