import React, { useEffect, useMemo, useState } from 'react';
import { getLevelDetails } from '../lib/levelDetails';
import LevelDetailsContent from './LevelDetailsContent';
import MMLevelsSection, { MMLevelId } from './MMLevelsSection';
import Tooltip from './Tooltip';
import InfoIcon from './InfoIcon';

type SupportLevelId = 'Base' | 'Advanced' | 'Premium' | 'Expert';

type SupportLevelsWithDetailsProps = {
  defaultLevel?: SupportLevelId;
  onLevelChange?: (level: SupportLevelId) => void;
};


export const SupportLevelsWithDetails: React.FC<SupportLevelsWithDetailsProps> = ({
  defaultLevel = 'Advanced',
  onLevelChange,
}) => {
  const [selected, setSelected] = useState<SupportLevelId>(defaultLevel);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    onLevelChange?.(selected);
  }, [selected, onLevelChange]);

  const levelData = useMemo(() => getLevelDetails(selected), [selected]);
  const panelTargetHeight = 600; // Фиксированная высота панели

  return (
    <section aria-label="Выбор уровня поддержки и детали" className="relative mx-auto w-full max-w-[1120px]">
      {/* Заголовки вне контура */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[27px] font-bold text-slate-900">
            Выберите уровень поддержки<br />
            медицинского маркетинга
          </h3>
          <Tooltip content="Уровень поддержки определяет количество сценариев, экспериментов, качество SLA и объем услуг. Чем выше уровень, тем больше возможностей и выше стоимость.">
            <InfoIcon />
          </Tooltip>
        </div>
        <div className="text-[12px] text-slate-600">
          Нажмите на карточку,<br />
          чтобы увидеть детали
        </div>
      </div>

      {/* Единый контур: обёртка для карточек + док-панели */}
      <div className="rounded-2xl border border-black/10 bg-white/60 shadow-xl backdrop-blur-md">
        {/* Внутренний контейнер без лишних паддингов, чтобы совпадала ширина */}
        <div className="px-0">
          {/* Грид карточек — без дополнительной обёртки для выбранной */}
          <MMLevelsSection
            selected={selected.toLowerCase() as MMLevelId}
            onLevelChange={(lvl) => {
              setSelected(lvl.charAt(0).toUpperCase() + lvl.slice(1) as SupportLevelId);
              setOpen(true);
              setTimeout(() => document.getElementById('details-dock')?.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            }}
          />

          {/* Док‑панель — верхние скругления сняты для ровного стыка */}
          <div
            className="relative overflow-hidden rounded-t-none rounded-b-2xl border-t border-black/10 bg-white/70 backdrop-blur-md transition-[max-height,opacity,transform] duration-250 ease-in-out"
            style={{
              maxHeight: open ? panelTargetHeight : 0,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(-6px)',
              willChange: 'max-height, opacity, transform',
            }}
          >
            <div
              id="details-dock"
              role="region"
              aria-live="polite"
              className="custom-scrollbar px-4 py-3"
              style={{ height: panelTargetHeight, overflowY: 'auto' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md border border-brand-orange/40 bg-brand-orange/10 px-2 py-0.5 text-[12px] font-semibold text-brand-orange">
                    {selected}
                  </span>
                  <span className="text-[14px] font-semibold text-slate-900">Детали уровня поддержки</span>
                </div>
              </div>

              {levelData && <LevelDetailsContent levelData={levelData} />}
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка оставить как есть (вне контура) */}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-900 hover:text-slate-950"
        >
          {open ? 'Свернуть детали' : 'Показать детали'}
        </button>
      </div>
    </section>
  );
};

export default SupportLevelsWithDetails;