"use client";

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQProps {
  items: FAQItem[];
}

/**
 * Componente de Perguntas Frequentes (FAQ)
 * 
 * @description Exibe perguntas e respostas organizadas por categoria
 * usando o componente Accordion do shadcn/ui
 */
export function FAQ({ items }: FAQProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Agrupar por categoria
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Perguntas Frequentes</h1>
      </div>

      <div className="grid gap-6">
        {Object.entries(categories).map(([category, questions]) => (
          <Card key={category} className="p-6">
            <h2 className="text-lg font-semibold mb-4">{category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {questions.map((item, index) => {
                const itemId = `${category}-${index}`;
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger 
                      className="text-left"
                      open={openItems[itemId] || false}
                      onClick={() => toggleItem(itemId)}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Card>
        ))}
      </div>
    </div>
  );
}