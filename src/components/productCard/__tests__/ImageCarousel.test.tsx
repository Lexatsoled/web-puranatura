import { describe, it, expect } from 'vitest';
import { render } from '../../../../src/test/test-utils';
import { ImageCarousel } from '../ImageCarousel';
import { DEFAULT_PRODUCT_IMAGE } from '@/src/constants/images';

// Use unique names per test so queries can't accidentally match elements from another test
const productNameBase = 'My Product';

describe('ImageCarousel', () => {
  it('renders full image when present', () => {
    const images = [
      { full: 'full-1.jpg', thumbnail: 'thumb-1.jpg' },
      { full: 'full-2.jpg', thumbnail: 'thumb-2.jpg' },
    ];

    const { getAllByAltText } = render(
      <ImageCarousel
        images={images as any}
        productName={`${productNameBase} - full`}
        currentImageIndex={0}
        onSelectImage={() => {}}
        isHovered={false}
        priority={false}
      />
    );

    const imgs = getAllByAltText(`${productNameBase} - full`);
    // find the visible image (the carousel renders all images but only one is visible — it uses a class 'opacity-100' when visible)
    const visible = imgs.find((img) => !!img.closest('.opacity-100'));
    expect(visible).toBeDefined();
    expect(visible).toHaveAttribute('src', images[0].full);
  });

  it('falls back to thumbnail when full is missing', () => {
    const images = [{ thumbnail: 'only-thumb.jpg' }];

    const { getAllByAltText } = render(
      <ImageCarousel
        images={images as any}
        productName={`${productNameBase} - thumb`}
        currentImageIndex={0}
        onSelectImage={() => {}}
        isHovered={false}
        priority={false}
      />
    );

    const imgs = getAllByAltText(`${productNameBase} - thumb`);
    const visible = imgs.find((img) => !!img.closest('.opacity-100'));
    expect(visible).toBeDefined();
    expect(visible).toHaveAttribute('src', images[0].thumbnail);
  });

  it('uses DEFAULT_PRODUCT_IMAGE when both full and thumbnail are missing', () => {
    const images = [{}];

    const { getAllByAltText } = render(
      <ImageCarousel
        images={images as any}
        productName={`${productNameBase} - default`}
        currentImageIndex={0}
        onSelectImage={() => {}}
        isHovered={false}
        priority={false}
      />
    );

    const imgs = getAllByAltText(`${productNameBase} - default`);
    const visible = imgs.find((img) => !!img.closest('.opacity-100'));
    expect(visible).toBeDefined();
    expect(visible).toHaveAttribute('src', DEFAULT_PRODUCT_IMAGE);
  });
});
