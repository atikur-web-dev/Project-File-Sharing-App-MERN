// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { AppFooter } from '../components/layout/AppFooter';
import { ROUTES } from '../lib/constants';

const FEATURES = [
  {
    icon: 'terminal',
    title: 'Easy Upload',
    description: 'Drag and drop files or browse from your device. Support for all common file types.',
    wide: true,
  },
  {
    icon: 'sync',
    title: 'Real-time Access',
    description: 'Access your files instantly from any device, anywhere in the world.',
    wide: false,
  },
  {
    icon: 'lock',
    title: 'Secure Storage',
    description: 'Your files are stored securely with controlled access and share links.',
    wide: false,
  },
  {
    icon: 'group',
    title: 'Share Instantly',
    description: 'Generate shareable links in one click. Track downloads with analytics.',
    wide: true,
  },
];

const PLANS = [
  { name: 'Free', price: '$0', features: ['5GB Storage', '10 Transfers / Day', 'Community Support'], cta: 'Get Started', highlight: false },
  { name: 'Pro', price: '$15', features: ['500GB Storage', 'Unlimited Transfers', 'Priority Support', 'API Access'], cta: 'Start Trial', highlight: true },
  { name: 'Enterprise', price: 'Custom', features: ['Unlimited Storage', 'SAML/SSO', 'Custom Contracts', '24/7 Support'], cta: 'Contact Sales', highlight: false },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const goAuth = (path: string) => navigate(isAuthenticated ? ROUTES.DASHBOARD : path);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-margin-desktop">
        <div className="flex items-center gap-xl">
          <span className="text-headline-md font-bold text-primary">DevShare</span>
          <nav className="hidden gap-lg md:flex">
            <a href="#features" className="border-b-2 border-secondary text-body-md font-bold text-primary">Features</a>
            <a href="#pricing" className="text-body-md text-on-surface-variant transition-colors hover:text-primary">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          {!isAuthenticated ? (
            <>
              <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="px-md py-sm text-body-md font-medium text-on-surface-variant hover:text-primary">
                Login
              </button>
              <button type="button" onClick={() => navigate(ROUTES.REGISTER)} className="rounded-lg bg-primary px-lg py-sm text-body-md font-medium text-on-primary hover:opacity-90">
                Get Started
              </button>
            </>
          ) : (
            <button type="button" onClick={() => navigate(ROUTES.DASHBOARD)} className="rounded-lg bg-primary px-lg py-sm text-body-md font-medium text-on-primary hover:opacity-90">
              Dashboard
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-margin-desktop pb-24 pt-32">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-lg inline-flex items-center gap-sm rounded-full border border-outline-variant bg-surface-container-low px-sm py-xs">
              <MaterialIcon name="verified_user" size={16} className="text-secondary" />
              <span className="font-mono text-label-md">Secure File Sharing Platform</span>
            </div>
            <h1 className="mx-auto mb-lg max-w-3xl text-display leading-tight tracking-tight text-primary">
              The developer&apos;s vault for secure file sharing.
            </h1>
            <p className="mx-auto mb-xl max-w-2xl text-body-lg text-on-surface-variant">
              Built for teams who treat their assets like their code. Upload, share, and track downloads with precision.
            </p>
            <div className="flex flex-col items-center justify-center gap-md md:flex-row">
              <button type="button" onClick={() => goAuth(ROUTES.REGISTER)} className="w-full rounded-lg bg-primary px-xl py-md font-bold text-on-primary transition-transform active:scale-95 md:w-auto">
                Start for free
              </button>
              <button type="button" onClick={() => goAuth(ROUTES.LOGIN)} className="w-full rounded-lg border border-outline-variant bg-surface-container-high px-xl py-md font-mono text-label-md md:w-auto">
                Sign in to your account
              </button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>
        </section>

        <section className="px-margin-desktop py-24" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="mb-xl">
              <h2 className="mb-sm text-headline-lg text-primary">Engineered for Precision</h2>
              <p className="text-body-md text-on-surface-variant">Everything you need, nothing you don&apos;t.</p>
            </div>
            <div className="grid grid-cols-12 gap-gutter">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className={`bento-item rounded-xl ${f.wide ? 'col-span-12 md:col-span-7' : 'col-span-12 md:col-span-5'} min-h-60 flex flex-col justify-center ${!f.wide ? 'bg-surface-container-low' : ''}`}
                >
                  <MaterialIcon name={f.icon} size={32} className="mb-md text-primary" />
                  <h3 className="mb-sm text-headline-md text-primary">{f.title}</h3>
                  <p className="text-on-surface-variant">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant bg-surface-container-low px-margin-desktop py-24" id="pricing">
          <div className="mx-auto max-w-7xl">
            <div className="mb-24 text-center">
              <h2 className="mb-md text-headline-lg text-primary">Simple, transparent pricing.</h2>
              <p className="text-on-surface-variant">No hidden fees. Scale as you grow.</p>
            </div>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`flex h-full flex-col rounded-xl border p-xl ${plan.highlight ? 'border-2 border-primary' : 'border-outline-variant bg-white'}`}
                >
                  <div className="mb-xl">
                    <h3 className="mb-sm text-headline-md text-primary">{plan.name}</h3>
                    <div className="flex items-baseline gap-xs">
                      <span className="text-display font-display">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-on-surface-variant">/mo</span>}
                    </div>
                  </div>
                  <ul className="mb-auto space-y-md pb-xl">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-sm text-body-md">
                        <MaterialIcon name="check" size={18} className="text-secondary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => goAuth(ROUTES.REGISTER)}
                    className={`w-full rounded-lg py-sm font-medium ${plan.highlight ? 'bg-primary text-on-primary hover:opacity-90' : 'border border-primary text-primary hover:bg-surface-container-low'}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary px-margin-desktop py-32 text-on-primary">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-lg text-display">Ready to secure your assets?</h2>
            <p className="mb-xl text-body-lg opacity-80">
              Join developers who trust DevShare for mission-critical file management.
            </p>
            <button type="button" onClick={() => goAuth(ROUTES.REGISTER)} className="rounded-lg bg-white px-xl py-md font-bold text-primary hover:bg-neutral-100">
              Create Free Account
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-highest px-margin-desktop">
        <AppFooter />
      </footer>
    </div>
  );
};

export default HomePage;
