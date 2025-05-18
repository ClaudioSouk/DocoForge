
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { templateStyles } from '../utils/templateManager';
import { TemplateStyle } from '../types';

interface StyleCustomizerProps {
  initialStyle: TemplateStyle;
  onChange: (style: TemplateStyle, customCSS: string) => void;
}

const StyleCustomizer: React.FC<StyleCustomizerProps> = ({ 
  initialStyle, 
  onChange 
}) => {
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle>(initialStyle);
  const [customCSS, setCustomCSS] = useState<string>('');
  const [customProperties, setCustomProperties] = useState({
    fontFamily: templateStyles[initialStyle].fontFamily,
    headingFont: templateStyles[initialStyle].headingFont,
    primaryColor: templateStyles[initialStyle].primaryColor,
    secondaryColor: templateStyles[initialStyle].secondaryColor,
    accentColor: templateStyles[initialStyle].accentColor,
    backgroundColor: templateStyles[initialStyle].backgroundColor,
  });

  useEffect(() => {
    // Reset custom properties when style changes
    setCustomProperties({
      fontFamily: templateStyles[selectedStyle].fontFamily,
      headingFont: templateStyles[selectedStyle].headingFont,
      primaryColor: templateStyles[selectedStyle].primaryColor,
      secondaryColor: templateStyles[selectedStyle].secondaryColor,
      accentColor: templateStyles[selectedStyle].accentColor,
      backgroundColor: templateStyles[selectedStyle].backgroundColor,
    });
  }, [selectedStyle]);

  useEffect(() => {
    onChange(selectedStyle, customCSS);
  }, [selectedStyle, customCSS, onChange]);

  const handleStyleChange = (style: TemplateStyle) => {
    setSelectedStyle(style);
  };

  const handlePropertyChange = (property: string, value: string) => {
    setCustomProperties(prev => ({
      ...prev,
      [property]: value
    }));
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="preset" className="w-full">
        <TabsList className="grid grid-cols-2 w-48 mb-4">
          <TabsTrigger value="preset">Preset Styles</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preset">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(templateStyles).map((style) => (
              <Card 
                key={style} 
                className={`cursor-pointer transition-all ${
                  selectedStyle === style ? 'ring-2 ring-brand-500' : ''
                }`}
                onClick={() => handleStyleChange(style as TemplateStyle)}
              >
                <CardContent className="p-4">
                  <div 
                    className="h-8 w-full mb-2 rounded" 
                    style={{ backgroundColor: templateStyles[style as TemplateStyle].primaryColor }}
                  ></div>
                  <div className="font-medium capitalize">{style}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {templateStyles[style as TemplateStyle].fontFamily.split(',')[0].replace(/'/g, '')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fontFamily">Main Font</Label>
                  <Select 
                    value={customProperties.fontFamily} 
                    onValueChange={(value) => handlePropertyChange('fontFamily', value)}
                  >
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="'Arial', sans-serif">Arial</SelectItem>
                      <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                      <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                      <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                      <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                      <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Georgia', serif">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Select 
                    value={customProperties.headingFont}
                    onValueChange={(value) => handlePropertyChange('headingFont', value)}
                  >
                    <SelectTrigger id="headingFont">
                      <SelectValue placeholder="Select a heading font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="'Arial', sans-serif">Arial</SelectItem>
                      <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                      <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                      <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                      <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                      <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Georgia', serif">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="backgroundColorPicker"
                      value={customProperties.backgroundColor}
                      onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      id="backgroundColor"
                      value={customProperties.backgroundColor}
                      onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="primaryColorPicker"
                      value={customProperties.primaryColor}
                      onChange={(e) => handlePropertyChange('primaryColor', e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      id="primaryColor"
                      value={customProperties.primaryColor}
                      onChange={(e) => handlePropertyChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="secondaryColorPicker"
                      value={customProperties.secondaryColor}
                      onChange={(e) => handlePropertyChange('secondaryColor', e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      id="secondaryColor"
                      value={customProperties.secondaryColor}
                      onChange={(e) => handlePropertyChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="accentColorPicker"
                      value={customProperties.accentColor}
                      onChange={(e) => handlePropertyChange('accentColor', e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      id="accentColor"
                      value={customProperties.accentColor}
                      onChange={(e) => handlePropertyChange('accentColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="customCSS">Custom CSS (Advanced)</Label>
              <Textarea
                id="customCSS"
                placeholder="Add custom CSS styles here..."
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                className="font-mono text-sm"
                rows={10}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleCustomizer;
