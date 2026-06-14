import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingDonateButton from '../FloatingDonateButton';

// The component hides itself when scrollY <= 600. We need to simulate scrolling.
function simulateScroll(scrollY: number) {
  Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
  fireEvent.scroll(window);
}

describe('FloatingDonateButton', () => {
  it('does not render when page is not scrolled', () => {
    const onClick = vi.fn();
    const { container } = render(<FloatingDonateButton onDonateClick={onClick} />);
    // scrollY defaults to 0, so the button should be hidden
    expect(container.querySelector('.floating-donate')).toBeNull();
  });

  it('renders the donate button after scrolling past 600px', async () => {
    const onClick = vi.fn();
    render(<FloatingDonateButton onDonateClick={onClick} />);

    simulateScroll(700);

    // Button should now be visible
    const button = screen.getByRole('button', { name: /donate now/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onDonateClick when button is clicked', () => {
    const onClick = vi.fn();
    render(<FloatingDonateButton onDonateClick={onClick} />);

    simulateScroll(700);

    const button = screen.getByRole('button', { name: /donate now/i });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has the correct aria-label for accessibility', () => {
    const onClick = vi.fn();
    render(<FloatingDonateButton onDonateClick={onClick} />);
    simulateScroll(700);

    const button = screen.getByRole('button', { name: /donate now/i });
    expect(button).toHaveAttribute('aria-label', 'Donate Now');
  });

  it('has the correct id for targeting', () => {
    const onClick = vi.fn();
    render(<FloatingDonateButton onDonateClick={onClick} />);
    simulateScroll(700);

    const button = document.getElementById('floating-donate-btn');
    expect(button).toBeInTheDocument();
  });

  it('displays meals served counter', () => {
    const onClick = vi.fn();
    render(<FloatingDonateButton onDonateClick={onClick} />);
    simulateScroll(700);

    expect(screen.getByText(/meals served/i)).toBeInTheDocument();
  });
});
