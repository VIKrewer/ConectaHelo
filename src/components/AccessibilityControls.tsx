import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AccessibilityControls = () => {
  const [fontSize, setFontSize] = useState(100);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("conectatea-font-size");
    if (saved) {
      const size = parseInt(saved);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }
  }, []);

  const changeFontSize = (increment: boolean) => {
    const newSize = increment 
      ? Math.min(fontSize + 10, 150) 
      : Math.max(fontSize - 10, 80);
    
    if (newSize === fontSize) {
      toast({
        title: increment ? "Tamanho máximo atingido" : "Tamanho mínimo atingido",
        description: increment 
          ? "A fonte já está no tamanho máximo (150%)" 
          : "A fonte já está no tamanho mínimo (80%)",
      });
      return;
    }

    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem("conectatea-font-size", newSize.toString());
    
    toast({
      title: "Tamanho da fonte ajustado",
      description: `Fonte agora está em ${newSize}% do tamanho padrão`,
    });
  };

  return (
    <div 
      className="fixed right-4 top-24 z-40 flex flex-col gap-2 bg-card border border-border rounded-lg p-2 shadow-medium"
      role="toolbar"
      aria-label="Controles de acessibilidade"
    >
      <Button
        size="sm"
        variant="outline"
        onClick={() => changeFontSize(true)}
        className="gap-1 hover-lift"
        aria-label="Aumentar tamanho da fonte"
        title="Aumentar fonte (máx 150%)"
      >
        <Type className="w-5 h-5" />
        <span className="text-lg font-bold">A+</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => changeFontSize(false)}
        className="gap-1 hover-lift"
        aria-label="Diminuir tamanho da fonte"
        title="Diminuir fonte (mín 80%)"
      >
        <Type className="w-3 h-3" />
        <span className="text-sm font-bold">A-</span>
      </Button>
      <div className="text-xs text-center text-muted-foreground mt-1 px-1">
        {fontSize}%
      </div>
    </div>
  );
};

export default AccessibilityControls;
