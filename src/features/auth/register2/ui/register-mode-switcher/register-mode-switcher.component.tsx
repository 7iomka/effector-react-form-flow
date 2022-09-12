/* eslint-disable @typescript-eslint/no-shadow */
import { Button } from '@mantine/core';
import clsx from 'clsx';
import { createView } from '@/shared/lib/view';
import { modes, $mode, modeChanged } from '../../register.model';

interface RegisterModeSwitcherProps {
  className?: string;
}

const RegisterModeSwitcher = createView<RegisterModeSwitcherProps>()
  .displayName('RegisterModeSwitcher')
  .static({ modes })
  .units({
    activeMode: $mode,
    handleModeChange: modeChanged,
  })
  .memo()
  .view(({ className, modes, activeMode, handleModeChange }) => (
    <div className={clsx(className, 'flex flex-col')}>
      <div className="row g-8 items-center justify-center">
        {modes.map((mode) => (
          <div className="col-12 xsm:col-6" key={mode.value}>
            <Button
              variant={mode.value === activeMode ? 'filled' : 'outline'}
              radius="md"
              size="sm"
              compact
              fullWidth
              px={8}
              sx={{
                height: 30,
                '&': mode.value === activeMode && {
                  pointerEvents: 'none',
                  cursor: 'default',
                },
                '&:not(:hover)': mode.value !== activeMode && {
                  color: `rgba(var(--root-color-rgb), 0.4)`,
                  borderColor: `rgba(var(--root-color-rgb), 0.2)`,
                  backgroundColor: `var(--root-background)`,
                },
              }}
              onClick={() => handleModeChange(mode.value)}
            >
              {mode.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )).Memo;

export type { RegisterModeSwitcherProps };
export { RegisterModeSwitcher };
