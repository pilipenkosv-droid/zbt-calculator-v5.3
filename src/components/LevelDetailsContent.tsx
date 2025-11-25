import React, { useState } from 'react';
import { LevelDetails } from '../lib/levelDetails';

interface LevelDetailsContentProps {
  levelData: LevelDetails;
}

export const LevelDetailsContent: React.FC<LevelDetailsContentProps> = ({
  levelData,
}) => {
  const sections = Object.values(levelData);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const shouldShowAccordion = (section: any) => {
    const features = section.content.features || [];
    const categories = section.content.byCategory || [];
    // Показываем аккордеон для всех секций с функциями или категориями, кроме "Сценарии"
    return (features.length > 0 || categories.length > 0) && section.id !== 'scenarios';
  };

  return (
    <div className="space-y-4">
      {sections.map(section => {
        const isExpanded = expandedSections.has(section.id);
        const showAccordion = shouldShowAccordion(section);
        
        return (
          <div
            key={section.id}
            className={`rounded-lg border border-slate-200 bg-slate-50 p-4 ${showAccordion ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
            onClick={() => showAccordion && toggleSection(section.id)}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">
                {section.title}
              </h4>
              {showAccordion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(section.id);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span>{isExpanded ? 'Свернуть' : 'Развернуть'}</span>
                  <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
              )}
            </div>

            <p className="mb-3 text-sm text-slate-600">
              {section.content.description}
            </p>

            {/* Полные детали - показываем только если развернуто или не нужен аккордеон, или это Сценарии */}
            {(!showAccordion || isExpanded || section.id === 'scenarios') && (
              <>
                {section.content.total && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      На сопровождении:
                    </span>
                    <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">
                      {section.content.total}
                    </span>
                  </div>
                )}

                {section.id === 'scenarios' && section.content.features && section.content.features.length > 0 && (
                  <div className="mb-3">
                    <span className="mb-2 block text-xs font-medium text-slate-500">
                      Рекомендуемое распределение сценариев:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {section.content.features.map(
                        (feature: string, index: number) => (
                          <span
                            key={index}
                            className={`rounded-full px-2 py-1 text-xs ${
                              feature.startsWith('+') 
                                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {feature}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {section.id !== 'scenarios' && section.content.byCategory &&
                  section.content.byCategory.length > 0 && (
                    <div className="mb-3">
                      <span className="mb-2 block text-xs font-medium text-slate-500">
                        Рекомендуемые категории:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {section.content.byCategory.map(
                          (category: string, index: number) => (
                            <span
                              key={index}
                              className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600"
                            >
                              {category}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {section.id !== 'scenarios' && section.content.features && section.content.features.length > 0 && (
                  <div>
                    <span className="mb-2 block text-xs font-medium text-slate-500">
                      Включает:
                    </span>
                    <ul className="space-y-1">
                      {section.content.features.map(
                        (feature: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs text-slate-600"
                          >
                            <span className="mt-1 h-1 w-1 rounded-full bg-slate-400" />
                            {feature}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LevelDetailsContent;
