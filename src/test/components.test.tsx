import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../components/common/Toast';
import { PromptCard } from '../components/gallery/PromptCard';
import { App } from '../App';
import { PromptRecord } from '../types/prompt';

describe('Prompt Master UI Components & Workflow', () => {
  const samplePrompt: PromptRecord = {
    id: '01',
    title: 'Haute Couture Crystalline Coat',
    slug: 'haute-couture-crystalline-coat',
    prompt: 'High fashion editorial studio portrait of an elegant model',
    image: '/images/01.jpg',
    thumbnail: '/images/thumbnails/01.jpg',
    category: 'fashion',
    tags: ['fashion', 'haute-couture'],
    alt: 'High fashion model in crystal coat',
    status: 'published',
    featured: true,
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
  };

  it('renders PromptCard with permanent ID badge and title', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <PromptCard prompt={samplePrompt} />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('#01')).toBeInTheDocument();
    expect(screen.getByText('Haute Couture Crystalline Coat')).toBeInTheDocument();
    expect(screen.getByText('fashion')).toBeInTheDocument();
  });

  it('triggers clipboard copy when Copy Prompt button is clicked', async () => {
    const clipboardSpy = vi.spyOn(navigator.clipboard, 'writeText');

    render(
      <MemoryRouter>
        <ToastProvider>
          <PromptCard prompt={samplePrompt} />
        </ToastProvider>
      </MemoryRouter>
    );

    const copyBtn = screen.getByRole('button', { name: /copy exact generation prompt/i });
    fireEvent.click(copyBtn);

    expect(clipboardSpy).toHaveBeenCalledWith(samplePrompt.prompt);
    await waitFor(() => {
      expect(screen.getByText(/prompt copied to clipboard/i)).toBeInTheDocument();
    });
  });

  it('renders HomePage with hero headline and explore CTA', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/discover the prompt behind the image/i);
    expect(screen.getByRole('link', { name: /explore prompts/i })).toBeInTheDocument();
  });

  it('renders the admin studio outside the public gallery layout', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ToastProvider><App /></ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /admin studio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to public gallery/i })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('renders individual PromptDetailPage at /p/01', () => {
    render(
      <MemoryRouter initialEntries={['/p/01']}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/prompt #01/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy prompt/i })).toBeInTheDocument();
  });

  it('renders 404 page when unknown prompt ID is requested', () => {
    render(
      <MemoryRouter initialEntries={['/p/999999']}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/prompt not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse gallery/i })).toBeInTheDocument();
  });
});
