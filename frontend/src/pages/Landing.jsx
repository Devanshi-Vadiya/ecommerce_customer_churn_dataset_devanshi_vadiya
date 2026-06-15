import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Users, Zap, Activity } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <div className={`glass-panel animate-fade-in ${delay}`} style={{ padding: '2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h3>
    <p className="text-muted" style={{ lineHeight: '1.7', margin: 0 }}>{description}</p>
  </div>
);

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Navbar */}
      <nav className="animate-fade-in" style={{ padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5, 5, 5, 0.6)', backdropFilter: 'blur(24px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
            <Activity size={20} />
          </div>
          E-Analytics
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.6rem 1.5rem' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem', textAlign: 'center', position: 'relative' }}>
        
        {/* Floating Background Elements */}
        <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>
        <div className="animate-float delay-200" style={{ position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }}></div>

        <div className="animate-fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '100px', fontSize: '0.875rem', fontWeight: '500', marginBottom: '2.5rem', backdropFilter: 'blur(10px)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 10px var(--accent-success)' }}></span>
          v2.0 UI/UX Overhaul Live
        </div>
        
        <h1 className="animate-fade-in delay-100" style={{ maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>
          Stop Guessing. Start <span className="text-gradient-primary">Predicting</span> Churn.
        </h1>
        
        <p className="text-muted animate-fade-in delay-200" style={{ fontSize: '1.35rem', maxWidth: '650px', margin: '0 auto 3.5rem auto', lineHeight: '1.6' }}>
          Harness the power of AI-driven analytics to understand your customers, track behavioral patterns, and boost lifetime value before they ever think of leaving.
        </p>
        
        <div className="animate-fade-in delay-300" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Start Free Trial <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            View Live Demo
          </Link>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '8rem auto 0 auto', width: '100%' }}>
          <FeatureCard 
            delay="delay-100"
            icon={<BarChart2 size={28} strokeWidth={1.5} />}
            title="Deep Analytics"
            description="Visualize complex data sets instantly. Identify trends, drops, and retention metrics through intuitive, real-time dashboards that don't overwhelm."
          />
          <FeatureCard 
            delay="delay-200"
            icon={<Users size={28} strokeWidth={1.5} />}
            title="Smart Segmentation"
            description="Automatically group users based on their engagement, lifetime value, and churn risk to target them effectively with zero manual effort."
          />
          <FeatureCard 
            delay="delay-300"
            icon={<Zap size={28} strokeWidth={1.5} />}
            title="Predictive AI"
            description="Stay ahead of the curve. Use advanced behavioral modeling to spot at-risk customers before they actually abandon their shopping carts."
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'transparent' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} E-Analytics Platform. Designed with precision.</p>
      </footer>
    </div>
  );
};

export default Landing;
