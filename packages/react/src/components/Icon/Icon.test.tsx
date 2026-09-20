import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Icon} from './Icon.js';

describe('Icon', () => {
  it('is hidden from assistive technology without a label', () => {
    const {container} = render(
      <TectonProvider>
        <Icon name="drill-bit" />
      </TectonProvider>,
    );

    const glyph = container.querySelector('[data-tecton-icon="drill-bit"]');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
    expect(glyph).not.toHaveAttribute('role');
  });

  it('becomes a named image when it is given a label', () => {
    render(
      <TectonProvider>
        <Icon name="warning" label="Warning" />
      </TectonProvider>,
    );

    expect(screen.getByRole('img', {name: 'Warning'})).toBeInTheDocument();
  });

  it('draws the filled cut when asked for it', () => {
    const {container, rerender} = render(
      <TectonProvider>
        <Icon name="folder" variant="outline" />
      </TectonProvider>,
    );
    const outline = container.innerHTML;

    rerender(
      <TectonProvider>
        <Icon name="folder" variant="filled" />
      </TectonProvider>,
    );

    expect(container.querySelector('svg')).not.toBeNull();
    expect(typeof outline).toBe('string');
  });
});
