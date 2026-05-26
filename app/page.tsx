export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to br, #0f0f0f, #1a1a2e, #16213e)' }}>
      <header style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.3)', background: 'rgba(31, 31, 31, 0.5)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#00d4ff', marginBottom: '1rem' }}>
            Existon 1.0
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#a0a0a0', maxWidth: '42rem' }}>
            Information-Theoretic Analysis with AI Reasoning
          </p>
          <p style={{ fontSize: '0.875rem', color: '#808080', marginTop: '1rem' }}>
            Gaia-Vedic-Akasha-SOL-001 • Lily Code Architecture
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#00ff00', marginBottom: '1.5rem' }}>
                Doctoral-Level Analysis
              </h2>
              <p style={{ color: '#d0d0d0', marginBottom: '1rem', lineHeight: '1.6' }}>
                Existon 1.0 combines deterministic state transitions with information-theoretic analysis to measure entropy dissipation, mutual information, and system complexity.
              </p>
              <p style={{ color: '#a0a0a0', marginBottom: '2rem', fontSize: '0.875rem' }}>
                No API costs • Open-source AI models • Complete transparency • Lily Code compatible
              </p>
              <a
                href="/dashboard"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  background: '#00d4ff',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
              >
                Open Dashboard →
              </a>
            </div>

            <div style={{ background: '#1a1a1a', borderRadius: '0.5rem', border: '1px solid rgba(0, 212, 255, 0.3)', padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: '📊', title: 'Entropy Analysis', desc: 'Shannon entropy, dissipation rate, complexity classification' },
                  { icon: '🔗', title: 'Correlation Networks', desc: 'Mutual information, transfer entropy, correlation length' },
                  { icon: '🎯', title: 'Information Bottlenecks', desc: 'Critical node identification, compression efficiency' },
                  { icon: '🤖', title: 'AI Reasoning', desc: 'Deepseek-R1, Qwen2.5, Gemma 2 • Local inference' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', color: '#00d4ff' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {[
            { title: 'Zero API Costs', desc: 'All AI models run locally on Render. No OpenAI, Claude, or Anthropic charges.' },
            { title: 'Complete Transparency', desc: 'Open-source code, open-source models, full control over your data and infrastructure.' },
            { title: 'Production-Ready', desc: 'Deployed on Vercel + Render. Real-time analysis, auto-scaling, persistent storage.' },
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#1a1a1a', borderRadius: '0.5rem', border: '1px solid #444', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#00ff00', marginBottom: '1rem' }}>
                {item.title}
              </h3>
              <p style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '0.5rem', border: '1px solid rgba(0, 212, 255, 0.3)', padding: '3rem', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4ff', marginBottom: '2rem' }}>
            Architecture
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: '🌐', title: 'Frontend (Vercel)', desc: 'Next.js 15 • Real-time dashboards • Interactive visualizations' },
              { icon: '⚙️', title: 'Backend (Render)', desc: 'Ollama • Docker • Persistent storage • Auto-scaling' },
              { icon: '🧠', title: 'AI Models', desc: 'Deepseek-R1 (70B) • Qwen2.5 (72B) • Gemma 2 (27B)' },
              { icon: '📊', title: 'Analysis Engine', desc: 'Shannon entropy • Mutual information • Information bottlenecks' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 'bold', color: '#00ff00' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#a0a0a0' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#00d4ff', marginBottom: '1.5rem' }}>
            Ready to Analyze?
          </h2>
          <a
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: '#00d4ff',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              transition: 'background 0.3s',
            }}
          >
            Open Dashboard →
          </a>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #444', marginTop: '5rem', padding: '2rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center', color: '#808080', fontSize: '0.875rem' }}>
          <p>
            Existon 1.0 • Gaia-Vedic-Akasha-SOL-001 • Lily Code Architecture
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <a
              href="https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001"
              style={{ color: '#00d4ff', textDecoration: 'none' }}
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
