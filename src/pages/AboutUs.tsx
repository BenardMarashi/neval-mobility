// src/pages/AboutUs.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Leaf, TrendingUp, Users, Globe } from 'lucide-react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Leaf size={32} />,
      title: 'Sustainability',
      description: 'Every vehicle represents our commitment to cleaner air and a greener future.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Accessibility',
      description: 'Making electric mobility accessible through competitive pricing and direct ordering.'
    },
    {
      icon: <Users size={32} />,
      title: 'Customer Focus',
      description: 'From individual drivers to large corporations, we ensure everyone gets exactly what they need.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Vision',
      description: 'Accelerating sustainable mobility in Albania and beyond, making EVs the standard.'
    }
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <nav className="about-nav">
          <Link to="/" className="logo-link">
            <img src="/logo.jpg" alt="NEVAL" className="logo-img" />
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/fleet">Fleet</Link></li>
            <li><Link to="/technology/blade-battery">Technology</Link></li>
            <li><Link to="/about" className="active">About</Link></li>
          </ul>
          <button 
            className="nav-cta"
            onClick={() => navigate('/request-pricing')}
          >
            Request Pricing
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="about-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="about-hero-title">
            About <span className="highlight">NEVAL</span>
          </h1>
          <p className="about-hero-subtitle">
            Next Electric Vehicle Alternative
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="about-content">
        <div className="content-container">
          <motion.div 
            className="content-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Mobility in a New Light</h2>
            <p className="lead-text">
              At NEVAL, we see mobility in a new light. Our name — <strong>Next Electric Vehicle Alternative</strong> — 
              captures our vision of offering customers a smarter, greener, and more accessible way to drive.
            </p>
          </motion.div>

          <motion.div 
            className="content-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3>Our Approach</h3>
            <p>
              We bring BYD electric vehicles to the market through a direct order-based model, 
              ensuring that every client — from individual drivers to large corporations — 
              receives exactly the car they need at a highly competitive price.
            </p>
          </motion.div>

          <motion.div 
            className="mission-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Our Mission</h2>
            <p className="mission-text">
              To accelerate sustainable mobility in Albania and beyond. Every vehicle we deliver 
              represents more than transportation — it's a commitment to cleaner air, lower costs, 
              and a future where electric driving becomes the standard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Core Values
          </motion.h2>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Embrace the Future?</h2>
          <p>
            Whether you're choosing your first EV or expanding a corporate fleet, 
            NEVAL makes it seamless to order, own, and embrace the future of mobility.
          </p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate('/fleet')}
            >
              Explore Our Fleet
              <ChevronRight size={20} />
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/request-pricing')}
            >
              Request Pricing
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>Next Electric Vehicle Alternative</p>
            <p className="copyright">© 2025 NEVAL Mobility. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/fleet">Fleet</Link>
            <Link to="/technology/blade-battery">Technology</Link>
            <Link to="/request-pricing">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;