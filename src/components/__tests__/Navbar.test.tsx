import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('Roti Bank Bettiah Trust')).toBeInTheDocument();
  });

  it('renders the registration info', () => {
    render(<Navbar />);
    expect(screen.getByText(/5071\/2023/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);

    const navLinks = ['Gallery', 'About', 'Location', 'Achievements', 'Branches', 'Internship', 'Activities', 'Notice', 'Causes', 'News'];
    for (const link of navLinks) {
      // There may be multiple instances (desktop + mobile), so use getAllByText
      const elements = screen.getAllByText(link);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders the Donate Now link on desktop', () => {
    render(<Navbar />);
    const donateLinks = screen.getAllByText(/Donate Now/i);
    expect(donateLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('has a mobile menu toggle button', () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText('Toggle menu');
    expect(toggle).toBeInTheDocument();
  });

  it('renders contact info in the mobile menu', () => {
    render(<Navbar />);
    expect(screen.getByText('+91 9473228888')).toBeInTheDocument();
    expect(screen.getByText('rotibankbettiah@gmail.com')).toBeInTheDocument();
  });

  it('has correct navbar id', () => {
    render(<Navbar />);
    expect(document.getElementById('navbar')).toBeInTheDocument();
  });

  it('has correct mobile menu toggle id', () => {
    render(<Navbar />);
    expect(document.getElementById('mobile-menu-toggle')).toBeInTheDocument();
  });

  it('has correct donate button id on desktop', () => {
    render(<Navbar />);
    expect(document.getElementById('nav-donate-btn')).toBeInTheDocument();
  });
});
