import React from 'react';
import { render } from '@testing-library/react';
import ProductGridSkeleton from './ProductGridSkeleton';

describe('ProductGridSkeleton Component', () => {
  it('renders default 8 skeleton items', () => {
    const { container } = render(<ProductGridSkeleton />);
    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('grid');
    expect(gridDiv.children).toHaveLength(8);
  });

  it('renders custom count of items', () => {
    const { container } = render(<ProductGridSkeleton count={4} />);
    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv.children).toHaveLength(4);
  });

  it('renders with custom className', () => {
    const { container } = render(<ProductGridSkeleton className="custom-grid" />);
    const gridDiv = container.firstChild as HTMLElement;
    expect(gridDiv).toHaveClass('custom-grid');
  });

  it('renders items with custom itemClassName', () => {
    const { container } = render(<ProductGridSkeleton itemClassName="custom-item" />);
    // Check if inner divs have the class
    const items = container.querySelectorAll('.custom-item');
    // Each skeleton item has 3 inner divs with the class
    expect(items.length).toBe(8 * 3);
  });
});
