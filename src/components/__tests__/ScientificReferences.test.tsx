import { render, screen } from '@testing-library/react';
import ScientificReferences from '../ScientificReferences';
import { Product } from '@/types/product';
import { includesText } from '../../test/utils/text';

describe('ScientificReferences', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'A product for testing',
    price: 10,
    images: [],
    categories: [],
    scientificReferences: [
      {
        title: 'Study C',
        year: 2020,
        relevance: 'media',
        studyType: 'estudio-observacional',
        authors: 'Author C',
        journal: 'Journal C',
        summary: 'Summary C',
      },
      {
        title: 'Study A',
        year: 2022,
        relevance: 'alta',
        studyType: 'ensayo-clinico',
        authors: 'Author A',
        journal: 'Journal A',
        summary: 'Summary A',
      },
      {
        title: 'Study B',
        year: 2021,
        relevance: 'baja',
        studyType: 'revision-sistematica',
        authors: 'Author B',
        journal: 'Journal B',
        summary: 'Summary B',
      },
    ],
  };

  it('renders without crashing', () => {
    render(<ScientificReferences product={mockProduct} />);
    expect(
      screen.getByRole('heading', { name: includesText('Referencias Científicas') })
    ).toBeInTheDocument();
  });

  it('displays scientific references when provided', () => {
    render(<ScientificReferences product={mockProduct} />);
    expect(screen.getByText('Study A')).toBeInTheDocument();
    expect(screen.getByText('Study B')).toBeInTheDocument();
    expect(screen.getByText('Study C')).toBeInTheDocument();
  });

  it('sorts references by relevance (alta > media > baja) and then by year descending', () => {
    render(<ScientificReferences product={mockProduct} />);
    const titles = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent);
    // Expected order: Study A (alta, 2022), Study C (media, 2020), Study B (baja, 2021)
    expect(titles).toEqual(['Study A', 'Study C', 'Study B']);
  });

  it('does not render if no scientific references are provided', () => {
    const productWithoutRefs: Product = { ...mockProduct, scientificReferences: [] };
    const { container } = render(<ScientificReferences product={productWithoutRefs} />);
    expect(container).toBeEmptyDOMElement();
  });
});
