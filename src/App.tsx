import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CategoryPage } from './pages/CategoryPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { AdminPage } from './pages/AdminPage';
import {
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  CopyrightPage,
  AdvertisingPage,
} from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/*" element={<Layout><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/categories/:categorySlug" element={<CategoryPage />} />
        <Route path="/p/:id" element={<PromptDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/copyright" element={<CopyrightPage />} />
        <Route path="/advertising" element={<AdvertisingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes></Layout>} />
    </Routes>
  );
};
