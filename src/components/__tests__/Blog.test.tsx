import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Blog from '../Blog';
import { BlogItem } from '../../types';

// Mock framer-motion to render static elements instantly and bypass JSDOM transition/animation locks
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => {
      // Remove framer-motion specific props to prevent DOM warnings
      const { layout, initial, animate, exit, transition, ...cleanProps } = props;
      return <div {...cleanProps}>{children}</div>;
    },
    p: ({ children, ...props }: any) => {
      const { layout, initial, animate, exit, transition, ...cleanProps } = props;
      return <p {...cleanProps}>{children}</p>;
    },
    article: ({ children, ...props }: any) => {
      const { layout, initial, animate, exit, transition, ...cleanProps } = props;
      return <article {...cleanProps}>{children}</article>;
    }
  },
  MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const mockBlogs: BlogItem[] = [
  {
    id: 'test-blog-1',
    title: 'Test Title One',
    created_at: '2026-07-10T12:00:00Z',
    content: `# Test Title One\nThis is a body paragraph with **bold** text and [link](http://test.com).\n\n## Section 1\n* List item 1\n* List item 2\n\n[CTA: 100]`
  }
];

describe('Blog Component', () => {
  it('renders nothing if blogs array is empty', () => {
    const { container } = render(<Blog blogs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders blog items correctly', () => {
    render(<Blog blogs={mockBlogs} />);
    expect(screen.getByText('Test Title One')).toBeInTheDocument();
    expect(screen.getByText(/10 Min Read/i)).toBeInTheDocument();
  });

  it('displays the preview text in collapsed state, cleaning up markdown markup', () => {
    render(<Blog blogs={mockBlogs} />);
    // The preview text should have headers, lists, CTA, and bold formatting cleaned up
    const previewElement = screen.getByText(/This is a body paragraph with bold text and link/i);
    expect(previewElement).toBeInTheDocument();
    
    // Check that headers and lists aren't in the preview
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
    expect(screen.queryByText('List item 1')).not.toBeInTheDocument();
  });

  it('expands when clicking Read Full Guide and shows markdown elements', async () => {
    render(<Blog blogs={mockBlogs} />);
    
    const readMoreBtn = screen.getByText(/Read Full Guide/i);
    fireEvent.click(readMoreBtn);
    
    // After expanding, check for headings, lists, and bold elements rendered by the parser
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
    expect(screen.getByText('Make a Difference Instantly')).toBeInTheDocument();
    expect(screen.getByText(/While you build your local kitchen/i)).toBeInTheDocument();
    expect(screen.getByText(/Donate ₹100 Now/i)).toBeInTheDocument();
  });

  it('dispatches select-donation-amount CustomEvent when clicking CTA button', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    
    render(<Blog blogs={mockBlogs} />);
    
    // Expand article
    fireEvent.click(screen.getByText(/Read Full Guide/i));
    
    // Click CTA
    const ctaButton = screen.getByText(/Donate ₹100 Now/i);
    fireEvent.click(ctaButton);
    
    expect(dispatchSpy).toHaveBeenCalled();
    const lastCallArg = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0] as CustomEvent;
    expect(lastCallArg.type).toBe('select-donation-amount');
    expect(lastCallArg.detail).toEqual({ amount: 100 });
    
    dispatchSpy.mockRestore();
  });
});
