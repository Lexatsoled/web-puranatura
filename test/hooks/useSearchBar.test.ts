import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useSearchBar, { SearchResult } from '../../src/hooks/useSearchBar';

describe('useSearchBar', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('performs search and sets results when query length >= minQueryLength', async () => {
    vi.useFakeTimers();

    const fakeResults: SearchResult[] = [
      { id: '1', type: 'product', title: 'Banana', url: '/product/1' },
    ];

    const onSearch = vi.fn().mockResolvedValue(fakeResults);
    const { result } = renderHook(() => useSearchBar({ onSearch }));

    act(() => {
      result.current.handleSearchChange('ban');
    });

    // advance debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // wait next microtask for async resolution
    await act(async () => Promise.resolve());

    expect(onSearch).toHaveBeenCalledWith('ban');
    expect(result.current.results).toEqual(fakeResults);
    expect(result.current.isOpen).toBe(true);

    vi.useRealTimers();
  });

  it('navigates results with keyboard and triggers onResultClick on Enter', async () => {
    vi.useFakeTimers();

    const fakeResults: SearchResult[] = [
      { id: '1', type: 'product', title: 'Banana', url: '/product/1' },
      { id: '2', type: 'product', title: 'Manzana', url: '/product/2' },
    ];

    const onSearch = vi.fn().mockResolvedValue(fakeResults);
    const onResultClick = vi.fn();

    const { result } = renderHook(() =>
      useSearchBar({ onSearch, onResultClick })
    );

    // trigger search
    act(() => {
      result.current.handleSearchChange('man');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await act(async () => Promise.resolve());

    expect(result.current.results.length).toBe(2);

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: () => {},
      });
    });
    expect(result.current.activeIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({
        key: 'ArrowDown',
        preventDefault: () => {},
      });
    });
    expect(result.current.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({ key: 'Enter', preventDefault: () => {} });
    });

    expect(onResultClick).toHaveBeenCalled();
    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);

    vi.useRealTimers();
  });
});
