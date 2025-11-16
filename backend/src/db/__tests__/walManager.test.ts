import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WALManager } from '../walManager.js';

describe('WALManager', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ejecuta checkpoint con el modo indicado', () => {
    const pragma = vi.fn().mockReturnValue('ok');
    const manager = new WALManager({ pragma } as unknown as any);

    manager.checkpoint('FULL');

    expect(pragma).toHaveBeenCalledWith('wal_checkpoint(FULL)');
  });

  it('inicia y detiene checkpoints automaticos', () => {
    const pragma = vi.fn().mockReturnValue('ok');
    const manager = new WALManager({ pragma } as unknown as any);
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    manager.startAutoCheckpoint(1000);
    vi.advanceTimersByTime(2000);
    manager.stopAutoCheckpoint();
    process.env.NODE_ENV = originalEnv;

    expect(pragma).toHaveBeenCalledWith('wal_checkpoint(PASSIVE)');
  });

  it('retorna informacion del estado WAL', () => {
    const pragma = vi
      .fn()
      .mockReturnValueOnce('wal')
      .mockReturnValueOnce([{ busy: 0 }])
      .mockReturnValueOnce(1000);
    const manager = new WALManager({ pragma } as unknown as any);

    const info = manager.getWALInfo();

    expect(info.journalMode).toBe('wal');
    expect(info.walCheckpoint).toEqual([{ busy: 0 }]);
    expect(info.walAutoCheckpoint).toBe(1000);
  });
});
