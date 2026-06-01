'use client';

import { useState } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    message: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend lead capture
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you soon.');
    setFormData({ name: '', email: '', businessName: '', message: '' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'linear-gradient(to br, #0A0F2C, #0F1438)', color: '#FFFFFF', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid rgba(127, 255, 212, 0.3)', background: 'rgba(15, 20, 56, 0.7)', backdropFilter: 'blur(10px)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#FFFFFF' }}>
            Caramel Digital Studio
          </h1>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button onClick={() => scrollToSection('services')} style={{ background: 'none', border: 'none', color: '#7FFFD4', cursor: 'pointer', fontSize: '1rem' }}>Services</button>
            <button onClick={() => scrollToSection('portfolio')} style={{ background: 'none', border: 'none', color: '#7FFFD4', cursor: 'pointer', fontSize: '1rem' }}>Portfolio</button>
            <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', color: '#7FFFD4', cursor: 'pointer', fontSize: '1rem' }}>Contact</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05), rgba(0, 255, 255, 0.05))' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#FFFFFF' }}>
            Your Business Deserves a Digital Presence That Feels Alive
          </h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#7FFFD4' }}>
            We craft harmonically designed websites for local small businesses. R1750 upfront for Next.js branding and styling. Tiered monthly hosting from R89.
          </p>
          <button
            onClick={() => scrollToSection('contact')}
            style={{
              backgroundColor: '#FF00FF',
              color: '#0A0F2C',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.opacity = '0.9';
              el.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.opacity = '1';
              el.style.transform = 'scale(1)';
            }}
          >
            Start Your Site Today
          </button>
        </div>
      </section>

      {/* Service Tiers Section */}
      <section id="services" style={{ padding: '6rem 2rem', background: '#0F1438' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.8rem', marginBottom: '3rem', textAlign: 'center', color: '#FFFFFF' }}>
            Fibonacci-Scaled Pricing for Everyone
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Seed', price: 'R89', features: ['Starter website', '5GB storage', 'Basic support', 'Monthly updates'], color: '#7FFFD4' },
              { name: 'Sprout', price: 'R144', features: ['Enhanced website', '20GB storage', 'Priority support', 'Analytics dashboard', 'SEO optimization'], color: '#FF00FF', popular: true },
              { name: 'Bloom', price: 'R233', features: ['Premium website', '50GB storage', '24/7 support', 'Advanced analytics', 'Email marketing'], color: '#3CB371' },
            ].map((tier) => (
              <div
                key={tier.name}
                style={{
                  backgroundColor: '#0A0F2C',
                  border: `2px solid ${tier.color}`,
                  padding: '2rem',
                  borderRadius: '12px',
                  transform: tier.popular ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: tier.popular ? `0 0 30px ${tier.color}44` : 'none',
                }}
              >
                {tier.popular && <div style={{ color: tier.color, fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>⭐ POPULAR</div>}
                <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: tier.color }}>{tier.name}</h4>
                <p style={{ fontSize: '2.25rem', color: tier.color, marginBottom: '1rem', fontWeight: 'bold' }}>{tier.price}<span style={{ fontSize: '1rem', color: '#888' }}>/month</span></p>
                <ul style={{ fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#D0D0D0' }}>
                  {tier.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <button
                  style={{
                    width: '100%',
                    backgroundColor: tier.color,
                    color: '#0A0F2C',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 150ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.opacity = '1';
                  }}
                >
                  Choose {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.8rem', marginBottom: '3rem', textAlign: 'center', color: '#FFFFFF' }}>
            Portfolio Showcase
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Artisan Bakery Co.', type: 'Food & Beverage', desc: 'E-commerce with online ordering and menu showcase', color: '#FF00FF' },
              { title: 'Luminous Hair Studio', type: 'Beauty & Wellness', desc: 'Booking system with stylist profiles and reviews', color: '#00FFFF' },
              { title: 'Strategic Growth Consulting', type: 'Professional Services', desc: 'Portfolio showcase with case studies and lead capture', color: '#7FFFD4' },
              { title: 'Zenith Fitness Hub', type: 'Health & Fitness', desc: 'Class scheduling and membership tier management', color: '#3CB371' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: '#0F1438',
                  border: `1px solid ${item.color}`,
                  borderRadius: '12px',
                  padding: '2rem',
                  transition: 'all 300ms ease-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-8px)';
                  el.style.boxShadow = `0 8px 25px ${item.color}44`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{ width: '100%', height: '150px', backgroundColor: `${item.color}15`, borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${item.color}30` }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: item.color, marginBottom: '0.5rem' }}>{item.title[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Website Preview</div>
                  </div>
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: item.color }}>{item.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1rem' }}>{item.type}</p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>{item.desc}</p>
                <button
                  style={{
                    width: '100%',
                    backgroundColor: item.color,
                    color: '#0A0F2C',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  View Case Study
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Upsells Section */}
      <section style={{ padding: '6rem 2rem', background: '#0F1438' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.8rem', marginBottom: '3rem', textAlign: 'center', color: '#FFFFFF' }}>
            Premium AI-Powered Add-Ons
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {[
              { name: 'FLA Agentic Swarm', icon: '⚙️', price: 'R499', desc: 'Financial, Legal & Advisory Intelligence', color: '#FF00FF' },
              { name: 'Harmonic Render App', icon: '🎨', price: 'R299', desc: 'Sacred Geometry Visualization Engine', color: '#00FFFF' },
              { name: 'Marine App', icon: '🌊', price: 'R199', desc: 'Oceanic Data & Sustainability Insights', color: '#7FFFD4' },
              { name: 'Predictive I-Ching Chess', icon: '♟️', price: 'R349', desc: 'Ancient Wisdom Meets Strategic Analysis', color: '#3CB371' },
            ].map((product) => (
              <div
                key={product.name}
                style={{
                  backgroundColor: '#0A0F2C',
                  border: `2px solid ${product.color}`,
                  borderRadius: '12px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{product.icon}</div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: product.color }}>{product.name}</h4>
                <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1rem' }}>{product.desc}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: product.color, marginBottom: '1rem' }}>{product.price}/month</p>
                <button
                  style={{
                    width: '100%',
                    backgroundColor: product.color,
                    color: '#0A0F2C',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Add to Your Site
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2.8rem', marginBottom: '3rem', textAlign: 'center', color: '#FFFFFF' }}>
            Get Your Site Built
          </h3>

          <form
            onSubmit={handleFormSubmit}
            style={{
              backgroundColor: '#0F1438',
              padding: '2rem',
              borderRadius: '12px',
              border: `1px solid rgba(127, 255, 212, 0.3)`,
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7FFFD4' }}>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Your name"
                style={{
                  width: '100%',
                  backgroundColor: '#0A0F2C',
                  color: '#FFFFFF',
                  border: `1px solid rgba(127, 255, 212, 0.3)`,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7FFFD4' }}>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  backgroundColor: '#0A0F2C',
                  color: '#FFFFFF',
                  border: `1px solid rgba(127, 255, 212, 0.3)`,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7FFFD4' }}>Business Name</label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleFormChange}
                placeholder="Your business name"
                style={{
                  width: '100%',
                  backgroundColor: '#0A0F2C',
                  color: '#FFFFFF',
                  border: `1px solid rgba(127, 255, 212, 0.3)`,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#7FFFD4' }}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Tell us about your business..."
                style={{
                  width: '100%',
                  backgroundColor: '#0A0F2C',
                  color: '#FFFFFF',
                  border: `1px solid rgba(127, 255, 212, 0.3)`,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  minHeight: '120px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#FF00FF',
                color: '#0A0F2C',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 150ms ease-out',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.opacity = '1';
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Funding/Sponsorship Section */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05), rgba(0, 255, 255, 0.05))' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.8rem', marginBottom: '2rem', color: '#FFFFFF' }}>
            Funding & Sponsorship Opportunity
          </h3>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#D0D0D0', lineHeight: '1.8' }}>
            Caramel Digital Studio is building the future of harmonically designed, sacred-geometry-infused websites for local small businesses. We're seeking funding and sponsorship to scale our impact and bring affordable, beautiful digital presence to underserved communities.
          </p>
          <button
            style={{
              backgroundColor: '#00FFFF',
              color: '#0A0F2C',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.opacity = '1';
            }}
          >
            Discuss Sponsorship
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(127, 255, 212, 0.3)', padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.875rem' }}>
        <p>© 2026 Caramel Digital Studio. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>Crafted with harmonic precision and sacred geometry.</p>
      </footer>
    </div>
  );
}
