// src/pages/technology/BladeBattery.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './TechnologyPages.css';

const BladeBattery: React.FC = () => {
  return (
    <div className="tech-page blade-battery">
      <nav className="tech-nav">
        <Link to="/" className="back-link">← Back to Home</Link>
        <div className="tech-nav-links">
          <Link to="/technology/blade-battery" className="active">Blade Battery</Link>
          <Link to="/technology/e-platform">e-Platform 3.0</Link>
          <Link to="/technology/energy-management">Energy Management</Link>
        </div>
      </nav>

      {/* Simplified Hero Section */}
      <section className="tech-hero-simple">
        <div className="hero-content-simple">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            Revolutionary LFP Technology
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Blade Battery Technology
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The safest battery technology ever developed. Zero thermal runaway risk, 
            1 million kilometer lifespan, and 96% recyclable materials.
          </motion.p>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero-stat">
              <span className="stat-number">0</span>
              <span className="stat-text">Cobalt Required</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">5000+</span>
              <span className="stat-text">Charge Cycles</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">-45%</span>
              <span className="stat-text">CO₂ Emissions</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="tech-section how-it-works">
        <div className="section-content">
          <h2>How Blade Battery Works</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="card-icon">🔋</div>
              <h3>Cell-to-Pack Design</h3>
              <p>
                Traditional battery packs use cylindrical cells with wasted space. Blade Battery's elongated cells 
                are arranged directly into the pack, increasing space utilization by 50% while serving as 
                structural components.
              </p>
            </div>
            <div className="tech-card">
              <div className="card-icon">🧪</div>
              <h3>LFP Chemistry</h3>
              <p>
                Lithium Iron Phosphate (LFP) chemistry eliminates cobalt and nickel, using abundant iron and 
                phosphate. This makes batteries cheaper, safer, and more environmentally friendly without 
                toxic heavy metals.
              </p>
            </div>
            <div className="tech-card">
              <div className="card-icon">🔥</div>
              <h3>Thermal Stability</h3>
              <p>
                LFP chemistry is inherently stable, requiring temperatures above 500°C to decompose. Even when 
                punctured, crushed, or overcharged, Blade Battery doesn't catch fire or explode.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="tech-section environmental">
        <div className="section-content">
          <h2>Environmental Benefits</h2>
          <div className="impact-grid">
            <motion.div 
              className="impact-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="impact-number">0</div>
              <div className="impact-label">Cobalt Required</div>
              <p>No child labor or conflict minerals from cobalt mining in the Democratic Republic of Congo</p>
            </motion.div>
            <motion.div 
              className="impact-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="impact-number">1M+</div>
              <div className="impact-label">Kilometer Lifespan</div>
              <p>Lasts 3-4x longer than traditional batteries, reducing replacement waste and resource consumption</p>
            </motion.div>
            <motion.div 
              className="impact-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="impact-number">96%</div>
              <div className="impact-label">Recyclable Materials</div>
              <p>Iron, phosphate, and lithium can be recovered and reused in new batteries or other industries</p>
            </motion.div>
            <motion.div 
              className="impact-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="impact-number">-45%</div>
              <div className="impact-label">Manufacturing Emissions</div>
              <p>Simpler chemistry and abundant materials reduce production CO₂ compared to NMC batteries</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="tech-section specs">
        <div className="section-content">
          <h2>Technical Specifications</h2>
          <div className="specs-table">
            <div className="spec-row">
              <span className="spec-label">Energy Density</span>
              <span className="spec-value">150 Wh/kg</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Cycle Life</span>
              <span className="spec-value">5,000+ cycles to 80% capacity</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Operating Temperature</span>
              <span className="spec-value">-35°C to 55°C</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Charge Rate</span>
              <span className="spec-value">10-80% in 30 minutes</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Thermal Runaway</span>
              <span className="spec-value">No propagation even when penetrated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="tech-cta">
        <h2>Experience the Future of Battery Technology</h2>
        <p>Every Blade Battery vehicle reduces lifetime emissions by 40 tons of CO₂</p>
        <Link to="/" className="cta-button">Explore Our Fleet</Link>
      </section>
    </div>
  );
};

export default BladeBattery;