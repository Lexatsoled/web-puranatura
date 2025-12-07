import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '../../test/test-utils';
import {
  WishlistProvider,
  useWishlist,
} from '../../../contexts/WishlistContext';
import { DEFAULT_PRODUCT_IMAGE } from '@/src/constants/images';

const productWithoutImages = {
  id: 'no-img-1',
  name: 'No Image Product',
  price: 10.0,
  category: 'Test',
} as any;

const TestConsumer = () => {
  const { addToWishlist, wishlistItems } = useWishlist();

  return (
    <div>
      <button
        onClick={() => addToWishlist(productWithoutImages)}
        data-testid="add"
      >
        add
      </button>
      <div data-testid="first-image">{wishlistItems[0]?.image ?? ''}</div>
    </div>
  );
};

describe('WishlistContext', () => {
  it('uses DEFAULT_PRODUCT_IMAGE when product has no images', async () => {
    const { getByTestId, findByTestId } = render(
      <WishlistProvider>
        <TestConsumer />
      </WishlistProvider>
    );

    fireEvent.click(getByTestId('add'));

    // findByTestId will wait for the element text to be populated
    const firstImageDiv = await findByTestId('first-image');
    expect(firstImageDiv.textContent).toBe(DEFAULT_PRODUCT_IMAGE);
  });
});
