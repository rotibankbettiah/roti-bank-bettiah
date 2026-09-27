import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VolunteerForm, { GOOGLE_FORM_URL, GOOGLE_FORM_EMBED_URL } from '../VolunteerForm';

describe('VolunteerForm', () => {
  it('renders official volunteer application heading and information', () => {
    render(<VolunteerForm />);

    expect(screen.getByText(/Official Volunteer Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Join Our Volunteer Family/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fill out the official Google Form below or open directly in Google Forms/i)
    ).toBeInTheDocument();
  });

  it('renders direct link to the Google Form with target _blank', () => {
    render(<VolunteerForm />);

    const openBtn = screen.getByRole('link', { name: /Open Google Form/i });
    expect(openBtn).toBeInTheDocument();
    expect(openBtn).toHaveAttribute('href', GOOGLE_FORM_URL);
    expect(openBtn).toHaveAttribute('target', '_blank');
    expect(openBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders embedded Google Form iframe with correct source URL', () => {
    render(<VolunteerForm />);

    const iframe = screen.getByTitle(/Official Roti Bank Bettiah Volunteer Google Form/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', GOOGLE_FORM_EMBED_URL);
  });

  it('renders modal close button and triggers onClose when clicked in modal mode', () => {
    const handleClose = vi.fn();
    render(<VolunteerForm isModal={true} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /Close form/i });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
