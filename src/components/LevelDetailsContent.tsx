import React from 'react';
import { LevelDetails } from '../lib/levelDetails';

interface LevelDetailsContentProps {
  levelData: LevelDetails;
}

export const LevelDetailsContent: React.FC<LevelDetailsContentProps> = ({
  levelData,
}) => {
  const sections = Object.values(levelData);

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div
          key={section.id}
          className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {section.title}
          </h4>

          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
            {section.content.description}
          </p>

          {section.content.total && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Всего:
              </span>
              <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {section.content.total}
              </span>
            </div>
          )}

          {section.content.byCategory &&
            section.content.byCategory.length > 0 && (
              <div className="mb-3">
                <span className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  Категории:
                </span>
                <div className="flex flex-wrap gap-1">
                  {section.content.byCategory.map(
                    (category: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {category}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {section.content.features && section.content.features.length > 0 && (
            <div>
              <span className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Включает:
              </span>
              <ul className="space-y-1">
                {section.content.features.map(
                  (feature: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-1 h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LevelDetailsContent;
