import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import QuantitySelector from '../QuantitySelector';

describe('QuantitySelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial value', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
  });

  it('increments quantity when plus button is clicked', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} />);
    const plusButton = screen.getByRole('button', { name: 'Aumentar cantidad' });
    fireEvent.click(plusButton);
    expect(screen.getByRole('spinbutton')).toHaveValue(2);
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('decrements quantity when minus button is clicked', () => {
    render(<QuantitySelector value={2} onChange={mockOnChange} />);
    const minusButton = screen.getByRole('button', { name: 'Disminuir cantidad' });
    fireEvent.click(minusButton);
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('does not decrement below min value', () => {
    render(<QuantitySelector value={1} min={1} onChange={mockOnChange} />);
    const minusButton = screen.getByRole('button', { name: 'Disminuir cantidad' });
    fireEvent.click(minusButton);
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
    expect(mockOnChange).not.toHaveBeenCalled(); // Should not call onChange if value doesn't change
  });

  it('does not increment above max value', () => {
    render(<QuantitySelector value={3} max={3} onChange={mockOnChange} />);
    const plusButton = screen.getByRole('button', { name: 'Aumentar cantidad' });
    fireEvent.click(plusButton);
    expect(screen.getByRole('spinbutton')).toHaveValue(3);
    expect(mockOnChange).not.toHaveBeenCalled(); // Should not call onChange if value doesn't change
  });

  it('updates quantity on direct input change', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} />);
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '2' } });
    expect(quantityInput).toHaveValue(2);
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('handles invalid input by reverting to previous valid value', () => {
    render(<QuantitySelector value={1} onChange={mockOnChange} />);
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: 'abc' } });
    expect(quantityInput).toHaveValue(1); // Should revert to initial value
    expect(mockOnChange).toHaveBeenCalledWith(1); // onChange is called with the clamped value
  });

  it('disables minus button when at min value', () => {
    render(<QuantitySelector value={1} min={1} onChange={mockOnChange} />);
    const minusButton = screen.getByRole('button', { name: 'Disminuir cantidad' });
    expect(minusButton).toBeDisabled();
  });

  it('disables plus button when at max value', () => {
    render(<QuantitySelector value={3} max={3} onChange={mockOnChange} />);
    const plusButton = screen.getByRole('button', { name: 'Aumentar cantidad' });
    expect(plusButton).toBeDisabled();
  });

  it('renders with different sizes', () => {
    render(<QuantitySelector value={1} size="lg" onChange={mockOnChange} />);
    const container = screen.getByRole('spinbutton').closest('div');
    expect(container).toHaveClass('h-12');
  });

  it('renders with white variant', () => {
    render(<QuantitySelector value={1} variant="white" onChange={mockOnChange} />);
    const container = screen.getByRole('spinbutton').closest('div');
    expect(container).toHaveClass('bg-white');
  });

  it('is disabled when disabled prop is true', () => {
    render(<QuantitySelector value={1} disabled={true} onChange={mockOnChange} />);
    const quantityInput = screen.getByRole('spinbutton');
    const plusButton = screen.getByRole('button', { name: 'Aumentar cantidad' });
    const minusButton = screen.getByRole('button', { name: 'Disminuir cantidad' });

    expect(quantityInput).toBeDisabled();
    expect(plusButton).toBeDisabled();
    expect(minusButton).toBeDisabled();
  });
});
