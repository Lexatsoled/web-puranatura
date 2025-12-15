import React, { useRef } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useFocusTrap } from '../useFocusTrap';

// Test component to use the hook
const TestComponent = ({
  isActive = true,
  onEscape,
  hasInitialFocus = false,
}: {
  isActive?: boolean;
  onEscape?: () => void;
  hasInitialFocus?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialRef = useRef<HTMLInputElement>(null);

  useFocusTrap(containerRef, {
    isActive,
    onEscape,
    initialFocusRef: hasInitialFocus ? initialRef : undefined,
  });

  return (
    <div>
      <button>Outside</button>
      <div ref={containerRef} data-testid="trap-container">
        <input data-testid="input-1" />
        <button data-testid="button-1">Button 1</button>
        <div tabIndex={0} data-testid="focusable-div">
          Div
        </div>
        <input
          data-testid="initial-input"
          ref={initialRef}
          defaultValue="Initial"
        />
        <a href="#" data-testid="link-1">
          Link
        </a>
      </div>
      <button>Outside 2</button>
    </div>
  );
};

describe('useFocusTrap', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should focus the first focusable element when active', () => {
    render(<TestComponent isActive={true} />);
    expect(screen.getByTestId('input-1')).toHaveFocus();
  });

  it('should focus the initialFocusRef if provided', () => {
    render(<TestComponent isActive={true} hasInitialFocus={true} />);
    expect(screen.getByTestId('initial-input')).toHaveFocus();
  });

  it('should not trap focus if isActive is false', () => {
    // Focus something else first
    const { unmount } = render(<TestComponent isActive={false} />);
    // Since it's not active, it shouldn't force focus anywhere specific on mount logic of the trap,
    // but the test runner might focus body.
    // Let's just check it didn't steal focus to input-1 immediately
    expect(screen.getByTestId('input-1')).not.toHaveFocus();
    unmount();
  });

  it('should cycle focus on Tab (Last -> First)', async () => {
    const user = userEvent.setup();
    render(<TestComponent isActive={true} />);

    const first = screen.getByTestId('input-1');
    const last = screen.getByTestId('link-1');

    // Move focus to last element
    last.focus();
    expect(last).toHaveFocus();

    // Press Tab
    await user.tab();

    // Should wrap around to first
    expect(first).toHaveFocus();
  });

  it('should cycle focus on Shift+Tab (First -> Last)', async () => {
    const user = userEvent.setup();
    render(<TestComponent isActive={true} />);

    const first = screen.getByTestId('input-1');
    const last = screen.getByTestId('link-1');

    // Focus first
    first.focus();
    expect(first).toHaveFocus();

    // Press Shift+Tab
    await user.tab({ shift: true });

    // Should wrap around to last
    expect(last).toHaveFocus();
  });

  it('should call onEscape when Escape key is pressed', async () => {
    const onEscape = vi.fn();
    const user = userEvent.setup();
    render(<TestComponent isActive={true} onEscape={onEscape} />);

    // Ensure focus is inside
    screen.getByTestId('input-1').focus();

    await user.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  // Fixed test case below

  it('should restore focus correctly', async () => {
    // Create a wrapper to control mounting
    const Wrapper = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div>
          <button data-testid="external-btn" onClick={() => setIsOpen(true)}>
            Open
          </button>
          {isOpen && (
            <TestComponent
              isActive={true}
              onEscape={() => setIsOpen(false)} // Allow closing to trigger unmount/deactivation logic if we were testing manual close
            />
          )}
          {/* Add a button to close it from outside if needed, or simple toggle */}
          <button data-testid="close-btn" onClick={() => setIsOpen(false)}>
            Close
          </button>
        </div>
      );
    };

    const user = userEvent.setup();
    render(<Wrapper />);

    const btn = screen.getByTestId('external-btn');
    const closeBtn = screen.getByTestId('close-btn');

    // 1. Focus the trigger button
    btn.focus();
    expect(btn).toHaveFocus();

    // 2. Open trap (mounts TestComponent)
    await user.click(btn);

    // 3. Trap should be active now, focus inside
    expect(screen.getByTestId('input-1')).toHaveFocus();

    // 4. Close trap (unmounts TestComponent)
    await user.click(closeBtn);

    // 5. Focus should be restored to the trigger button
    expect(btn).toHaveFocus();
  });
});
