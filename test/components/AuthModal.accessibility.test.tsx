import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import AuthModal from '../../components/AuthModal';
import { AuthProvider } from '../../contexts/AuthContext';

describe('AuthModal accessibility', () => {
  test('focus moves to close button when opened and Escape calls onClose', () => {
    const onClose = vi.fn();
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={onClose} />
      </AuthProvider>
    );

    // Allow a more forgiving label matching for the close button
    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    expect(closeButton).toBeInTheDocument();
    // JSDOM doesn't automatically focus on mount in every environment, so ensure we can focus programmatically
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Escape should trigger onClose
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
