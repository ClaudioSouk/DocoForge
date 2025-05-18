
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DocumentType, Template, TemplateCategory } from '../types';
import { getTemplatesByCategory } from '../utils/templateManager';

interface TemplateSelectorProps {
  documentType: DocumentType;
  onSelectTemplate: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  documentType,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('general');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  const templates = getTemplatesByCategory(documentType, selectedCategory);
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onSelectTemplate(template);
    }
  };

  // Categories available for the current document type
  const availableCategories = Object.keys(
    templates.length ? { [selectedCategory]: true } : { general: true }
  ) as TemplateCategory[];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" onValueChange={(value) => setSelectedCategory(value as TemplateCategory)}>
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-5">
          {availableCategories.includes('general') && <TabsTrigger value="general">General</TabsTrigger>}
          {availableCategories.includes('tech') && <TabsTrigger value="tech">Tech</TabsTrigger>}
          {availableCategories.includes('legal') && <TabsTrigger value="legal">Legal</TabsTrigger>}
          {availableCategories.includes('healthcare') && <TabsTrigger value="healthcare">Healthcare</TabsTrigger>}
          {availableCategories.includes('freelance') && <TabsTrigger value="freelance">Freelance</TabsTrigger>}
          {availableCategories.includes('consulting') && <TabsTrigger value="consulting">Consulting</TabsTrigger>}
        </TabsList>
        
        {availableCategories.map(category => (
          <TabsContent key={category} value={category} className="pt-4">
            <RadioGroup value={selectedTemplateId} onValueChange={handleTemplateSelect}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getTemplatesByCategory(documentType, category).map(template => (
                  <div key={template.id} className="flex items-start space-x-2">
                    <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={template.id} className="flex flex-col">
                        <Card className={`cursor-pointer transition-all ${selectedTemplateId === template.id ? 'ring-2 ring-brand-500' : ''}`}>
                          <CardContent className="p-4">
                            <div className="font-medium">{template.name}</div>
                            <p className="text-sm text-gray-500">{template.description}</p>
                            <div className="text-xs text-gray-400 mt-1">Style: {template.style}</div>
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TemplateSelector;
