import React from 'react';
import { render } from '@testing-library/react';
import ProductGridSkeleton from './ProductGridSkeleton';

describe('ProductGridSkeleton Component', () => {
  it('renders 8 skeleton items', () => {
    const { container } = render(<ProductGridSkeleton />);

    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('grid');
    expect(gridDiv.children).toHaveLength(8);
  });
});
