import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import FilterSidebar from '../FilterSidebar';
import { includesText } from '../../test/utils/text';

// Mock the UI store
vi.mock('../../store/uiStore', () => ({
  useUIStore: vi.fn(() => ({
    productFilters: {
      categories: [],
      priceRange: [0, 10000],
      sortBy: 'default',
      searchTerm: '',
      inStock: false,
      onSale: false,
      tags: [],
    },
    isFilterOpen: false,
    toggleCategory: vi.fn(),
    setPriceRange: vi.fn(),
    setSortBy: vi.fn(),
    toggleInStock: vi.fn(),
    toggleOnSale: vi.fn(),
    addTag: vi.fn(),
    removeTag: vi.fn(),
    resetFilters: vi.fn(),
    setIsFilterOpen: vi.fn(),
  })),
}));

describe('FilterSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FilterSidebar />);

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Ordenar por')).toBeInTheDocument();
    expect(screen.getByText(includesText('Categorías'))).toBeInTheDocument();
    expect(screen.getByText('Rango de Precio')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
    expect(screen.getByText('Etiquetas')).toBeInTheDocument();
  });

  it('displays sort options', () => {
    render(<FilterSidebar />);

    const sortSelect = screen.getByLabelText('Ordenar productos por');
    expect(sortSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Relevancia' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Nombre A-Z' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Precio menor a mayor' })).toBeInTheDocument();
  });

  it('displays category checkboxes', () => {
    render(<FilterSidebar />);

    expect(screen.getByText('Suplementos')).toBeInTheDocument();
    expect(screen.getByText('Vitaminas')).toBeInTheDocument();
    expect(screen.getByText('Hierbas Medicinales')).toBeInTheDocument();
    expect(screen.getByText('Aceites Esenciales')).toBeInTheDocument();
  });

  it('displays price range inputs', () => {
    render(<FilterSidebar />);

    const minInput = screen.getByPlaceholderText(includesText('Mín'));
    const maxInput = screen.getByPlaceholderText(includesText('Máx'));

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
  });

  it('displays availability checkboxes', () => {
    render(<FilterSidebar />);

    expect(screen.getByText('Solo en stock')).toBeInTheDocument();
    expect(screen.getByText('En oferta')).toBeInTheDocument();
  });

  it('displays tags section', () => {
    render(<FilterSidebar />);

    expect(screen.getByPlaceholderText(includesText('Añadir etiqueta'))).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('displays clear filters button', () => {
    render(<FilterSidebar />);

    expect(screen.getByText('Limpiar')).toBeInTheDocument();
  });

  it('displays close button on mobile', () => {
    render(<FilterSidebar />);

    // The close button should be present but hidden on desktop
    const closeButton = screen.getByLabelText('Cerrar panel de filtros');
    expect(closeButton).toBeInTheDocument();
  });
});

