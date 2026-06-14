import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

describe('Stats', () => {
  it('renders the section with correct id', () => {
    render(<Stats />);
    expect(document.getElementById('stats')).toBeInTheDocument();
  });

  it('renders the "Live Statistics" badge', () => {
    render(<Stats />);
    expect(screen.getByText(/Live Statistics/i)).toBeInTheDocument();
  });

  it('renders the "Our Growing Impact" heading', () => {
    render(<Stats />);
    expect(screen.getByText(/Our Growing Impact/i)).toBeInTheDocument();
  });

  it('renders all four stat card labels', () => {
    render(<Stats />);
    expect(screen.getByText('Meals Served')).toBeInTheDocument();
    expect(screen.getByText('Volunteers')).toBeInTheDocument();
    expect(screen.getByText('Active Cities')).toBeInTheDocument();
    expect(screen.getByText('Donors')).toBeInTheDocument();
  });

  it('renders the financial transparency section', () => {
    render(<Stats />);
    expect(screen.getByText(/Financial Transparency/i)).toBeInTheDocument();
    expect(screen.getByText('100% Transparent Operation')).toBeInTheDocument();
  });

  it('renders the finance breakdown items', () => {
    render(<Stats />);
    expect(screen.getByText('Food & Distribution')).toBeInTheDocument();
    expect(screen.getByText('Logistics')).toBeInTheDocument();
    expect(screen.getByText('Admin & Tech')).toBeInTheDocument();
  });

  it('shows correct percentages for finance data', () => {
    render(<Stats />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
  });
});
