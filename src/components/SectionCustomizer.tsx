
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Template, CustomSection, TemplateSection } from '../types';
import { GripVertical, X, Plus } from 'lucide-react';

interface SectionCustomizerProps {
  template: Template;
  onChange: (sections: CustomSection[]) => void;
  initialSections?: CustomSection[];
}

const SectionCustomizer: React.FC<SectionCustomizerProps> = ({
  template,
  onChange,
  initialSections = [],
}) => {
  const [sections, setSections] = useState<Array<TemplateSection & { content: string; isActive: boolean }>>([]);

  // Initialize sections based on template
  useEffect(() => {
    if (template) {
      // Map template sections with content from initialSections if available
      const mappedSections = template.sections.map(section => {
        const initialSection = initialSections.find(s => s.id === section.id);
        return {
          ...section,
          content: initialSection?.content || '',
          isActive: section.required || !!initialSection
        };
      });
      
      setSections(mappedSections);
    }
  }, [template, initialSections]);

  // When sections change, notify parent component
  useEffect(() => {
    const activeSections = sections
      .filter(section => section.isActive)
      .map(({ id, content }) => ({ id, content }));
    
    onChange(activeSections);
  }, [sections, onChange]);

  const handleContentChange = (id: string, content: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, content } : section
      )
    );
  };

  const toggleSectionActive = (id: string) => {
    setSections(prev => 
      prev.map(section => {
        if (section.id === id && !section.required) {
          return { ...section, isActive: !section.isActive };
        }
        return section;
      })
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSections(items);
  };

  const addCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    setSections([
      ...sections, 
      { 
        id: newId, 
        name: 'Custom Section', 
        required: false, 
        content: '', 
        isActive: true 
      }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Customize Sections</h3>
        <Button 
          onClick={addCustomSection} 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef} 
              className="space-y-3"
            >
              {sections.map((section, index) => (
                <Draggable 
                  key={section.id} 
                  draggableId={section.id} 
                  index={index}
                  isDragDisabled={section.required}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border rounded-lg ${section.isActive ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="p-3 flex justify-between items-center border-b">
                        <div className="flex items-center">
                          <div 
                            {...provided.dragHandleProps} 
                            className="cursor-grab mr-2 p-1"
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                          <h4 className="font-medium">
                            {section.name}
                            {section.required && (
                              <span className="ml-2 text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                                Required
                              </span>
                            )}
                          </h4>
                        </div>
                        {!section.required && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSectionActive(section.id)}
                          >
                            {section.isActive ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      
                      {section.isActive && (
                        <div className="p-3">
                          <Textarea
                            placeholder={`Enter content for ${section.name}...`}
                            value={section.content}
                            onChange={(e) => handleContentChange(section.id, e.target.value)}
                            className="min-h-32 resize-y"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SectionCustomizer;
