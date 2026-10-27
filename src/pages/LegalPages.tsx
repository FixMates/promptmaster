import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { siteConfig } from '../config/siteConfig';
import { Shield, Mail, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export const AboutPage: React.FC = () => (
  <>
    <SEOHead title="About Prompt Master Gallery" path="/about" />
    <div className="max-w-3xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'About Us' }]} />
      <h1 className="text-3xl font-extrabold text-white mt-4 mb-4">About Prompt Master Gallery</h1>
      <div className="prose prose-invert space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          <strong>Prompt Master Gallery</strong> was founded with a singular purpose: <em>"Discover the Prompt Behind the Image."</em>
        </p>
        <p>
          As generative artificial intelligence transforms digital art, prompt craft has become an essential new artistic discipline. However, creators across Instagram, Facebook, and Discord frequently encounter striking visual artwork without knowing how to reproduce the aesthetics, lighting, or compositional mastery.
        </p>
        <p>
          We curate high-fidelity, verified generation prompts across fashion, anime, dark fantasy, cyberpunk, 3D architecture, and ultra-high-resolution wallpapers. Every prompt in our library is indexed with a permanent, permanent identifier (such as <code>/p/01</code>) and complete generation tokens.
        </p>
        <h2 className="text-xl font-bold text-white pt-4">Our Core Philosophy</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Direct & Free Access:</strong> Copy exact prompts instantly without survey gates, forced downloads, or locked paywalls.</li>
          <li><strong>Engine Attribution:</strong> Clear model markers (Midjourney, Flux, Stable Diffusion, DALL-E).</li>
          <li><strong>Clean Monetization:</strong> Transparent, non-deceptive advertising through Adsterra to keep the directory free for creators worldwide.</li>
        </ul>
      </div>
    </div>
  </>
);

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Message sent! We will get back to you shortly.', 'success');
  };

  return (
    <>
      <SEOHead title="Contact Support — Prompt Master Gallery" path="/contact" />
      <div className="max-w-2xl mx-auto py-8">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <h1 className="text-3xl font-extrabold text-white mt-4 mb-2">Contact & Inquiries</h1>
        <p className="text-sm text-slate-400 mb-8">
          Have a question, submission request, or advertising inquiry? Reach out to our team.
        </p>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Message Received</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              Thank you for reaching out. We usually review all inquiries within 24 to 48 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs font-semibold text-slate-200"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-4 shadow-xl">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Creator"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-750 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="creator@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-750 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your inquiry or question here..."
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-750 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-glow-sm"
            >
              Send Message
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Direct inquiries: <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-400 underline">{siteConfig.contactEmail}</a>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export const PrivacyPage: React.FC = () => (
  <>
    <SEOHead title="Privacy Policy — Prompt Master Gallery" path="/privacy" />
    <div className="max-w-3xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <h1 className="text-3xl font-extrabold text-white mt-4 mb-4">Privacy Policy</h1>
      <div className="prose prose-invert space-y-4 text-slate-300 text-sm leading-relaxed">
        <p className="text-xs text-slate-400 font-mono">Effective Date: October 2026</p>
        <p>
          Prompt Master Gallery ("we", "our", or "us") respects your privacy. This Privacy Policy details how information is handled when you visit our website.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">1. Information We Do Not Collect</h2>
        <p>
          We do not require user accounts, passwords, or personal profile registrations for public visitors. You are free to explore prompts anonymously.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">2. Local Browser Storage</h2>
        <p>
          Our application uses client-side <code>localStorage</code> solely to remember local preferences (such as your search filters or administrative editing sessions if you are an authorized publisher). No personal identifying information is stored.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">3. Advertising & Cookies (Adsterra)</h2>
        <p>
          We may display third-party advertisements served by advertising partners such as Adsterra. These third-party vendors may use cookies, web beacons, or similar technologies to serve non-personalized or personalized ads based on your visit to this or other websites. You may consult Adsterra's official privacy policies and adjust your browser's cookie settings at any time.
        </p>

        <h2 className="text-lg font-bold text-white pt-2">4. Contact Inquiries</h2>
        <p>
          If you contact us via email, your email address is used solely to respond to your specific request and is never sold or shared with third-party marketers.
        </p>
      </div>
    </div>
  </>
);

export const TermsPage: React.FC = () => (
  <>
    <SEOHead title="Terms of Service — Prompt Master Gallery" path="/terms" />
    <div className="max-w-3xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
      <h1 className="text-3xl font-extrabold text-white mt-4 mb-4">Terms of Service</h1>
      <div className="prose prose-invert space-y-4 text-slate-300 text-sm leading-relaxed">
        <p className="text-xs text-slate-400 font-mono">Effective Date: October 2026</p>
        <p>
          By accessing Prompt Master Gallery, you agree to these Terms of Service.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">1. Nature of AI Content</h2>
        <p>
          Images displayed on this website are generated using third-party artificial intelligence models (such as Midjourney, Flux, Stable Diffusion, and DALL-E). Prompt Master Gallery curates and demonstrates these generation parameters for educational and creative reference.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">2. Prompt Usage License</h2>
        <p>
          The text prompts published on Prompt Master Gallery are provided on a non-exclusive basis for visitors to study, adapt, and run in their generative tools of choice for both personal and commercial experimentation, subject to the terms of the respective AI model providers.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">3. Acceptable Use</h2>
        <p>
          Visitors agree not to engage in malicious activity, automated denial of service attacks, or unauthorized scraping that disrupts service for other creators.
        </p>
      </div>
    </div>
  </>
);

export const CopyrightPage: React.FC = () => (
  <>
    <SEOHead title="Copyright & DMCA Takedown — Prompt Master Gallery" path="/copyright" />
    <div className="max-w-3xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Copyright & DMCA' }]} />
      <h1 className="text-3xl font-extrabold text-white mt-4 mb-4">Copyright & Takedown Policy</h1>
      <div className="prose prose-invert space-y-4 text-slate-300 text-sm leading-relaxed">
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex items-start gap-3 my-4">
          <Shield className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300">
            Prompt Master respects intellectual property rights. If you believe your copyrighted artwork or registered trademark has been improperly depicted or referenced, we provide a prompt and transparent takedown process.
          </p>
        </div>

        <h2 className="text-lg font-bold text-white pt-2">Submitting a Takedown Notice</h2>
        <p>
          To file a formal DMCA notice or copyright inquiry, please send an email to <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand-400 underline">{siteConfig.contactEmail}</a> with the following details:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>The exact Prompt Master URL (e.g. <code>https://promptmastergallery.pages.dev/p/01</code>).</li>
          <li>Your contact information (name, email address, and relationship to the copyright holder).</li>
          <li>A statement made in good faith that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
        </ul>
        <p className="pt-2">
          Upon receiving a valid inquiry, we will review and remove or modify the specified content within 48 business hours.
        </p>
      </div>
    </div>
  </>
);

export const AdvertisingPage: React.FC = () => (
  <>
    <SEOHead title="Advertising Disclosure — Prompt Master Gallery" path="/advertising" />
    <div className="max-w-3xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Advertising Disclosure' }]} />
      <h1 className="text-3xl font-extrabold text-white mt-4 mb-4">Advertising Disclosure</h1>
      <div className="prose prose-invert space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          Prompt Master Gallery is supported through advertising partnerships, including <strong>Adsterra</strong>. This advertising revenue allows us to maintain our server infrastructure, index generation prompts, and keep all prompt pages 100% free for visitors.
        </p>
        <h2 className="text-lg font-bold text-white pt-2">Our Advertising Standards</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Zero Disguised Ads:</strong> Advertisements are clearly designated with an "Advertisement" or "Sponsored" tag and never formatted to mimic image prompt cards.</li>
          <li><strong>No Deceptive Actions:</strong> Ad units are positioned safely away from Copy Prompt buttons and download links to prevent accidental clicks.</li>
          <li><strong>No Survey Walls or Forced Unlocks:</strong> You will never be forced to click an advertisement or complete an offer to copy or view any prompt.</li>
          <li><strong>Safe Browsing:</strong> Popunders and disruptive full-screen takeovers are disabled by default.</li>
        </ul>
      </div>
    </div>
  </>
);
