// src/pages/technology/EnergyManagement.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './TechnologyPages.css';

const EnergyManagement: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'eco' | 'normal' | 'sport'>('normal');

  return (
    <div className="tech-page energy-management">
      <nav className="tech-nav">
        <Link to="/" className="back-link">← Back to Home</Link>
        <div className="tech-nav-links">
          <Link to="/technology/blade-battery">Blade Battery</Link>
          <Link to="/technology/e-platform">e-Platform 3.0</Link>
          <Link to="/technology/energy-management" className="active">Energy Management</Link>
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
            Intelligent Optimization
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Energy Management System
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered system that maximizes efficiency and minimizes environmental impact. 
            Smart regeneration, V2G capability, and adaptive driving modes.
          </motion.p>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero-stat">
              <span className="stat-number">90%</span>
              <span className="stat-text">Energy Recovery</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">V2G</span>
              <span className="stat-text">Grid Support</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">+30%</span>
              <span className="stat-text">City Range</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Driving Modes */}
      <section className="tech-section driving-modes">
        <div className="section-content">
          <h2>Adaptive Driving Modes</h2>
          <div className="mode-selector">
            {(['eco', 'normal', 'sport'] as const).map(mode => (
              <button
                key={mode}
                className={`mode-btn ${activeMode === mode ? 'active' : ''}`}
                onClick={() => setActiveMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="mode-details">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mode-info"
              >
                {activeMode === 'eco' && (
                  <>
                    <h3>ECO Mode - Maximum Efficiency</h3>
                    <p>Optimizes every joule of energy for maximum range</p>
                    <div className="mode-stats">
                      <div className="stat">
                        <span className="value">+20%</span>
                        <span className="label">Range Extension</span>
                      </div>
                      <div className="stat">
                        <span className="value">-30%</span>
                        <span className="label">Power Consumption</span>
                      </div>
                      <div className="stat">
                        <span className="value">100%</span>
                        <span className="label">Regeneration</span>
                      </div>
                    </div>
                  </>
                )}
                {activeMode === 'normal' && (
                  <>
                    <h3>Normal Mode - Balanced Performance</h3>
                    <p>Intelligent balance between efficiency and responsiveness</p>
                    <div className="mode-stats">
                      <div className="stat">
                        <span className="value">Optimal</span>
                        <span className="label">Daily Driving</span>
                      </div>
                      <div className="stat">
                        <span className="value">Smart</span>
                        <span className="label">Power Delivery</span>
                      </div>
                      <div className="stat">
                        <span className="value">70%</span>
                        <span className="label">Regeneration</span>
                      </div>
                    </div>
                  </>
                )}
                {activeMode === 'sport' && (
                  <>
                    <h3>Sport Mode - Peak Performance</h3>
                    <p>Maximum power delivery for spirited driving</p>
                    <div className="mode-stats">
                      <div className="stat">
                        <span className="value">100%</span>
                        <span className="label">Power Available</span>
                      </div>
                      <div className="stat">
                        <span className="value">Enhanced</span>
                        <span className="label">Throttle Response</span>
                      </div>
                      <div className="stat">
                        <span className="value">50%</span>
                        <span className="label">Regeneration</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Regenerative Braking */}
      <section className="tech-section regeneration">
        <div className="section-content">
          <h2>Regenerative Braking System</h2>
          <div className="regen-explanation">
            <h3>Energy Recovery Technology</h3>
            <p>
              Our advanced regenerative braking system captures up to 90% of kinetic energy during 
              deceleration, converting it back into electricity to charge the battery. This recovered 
              energy would otherwise be lost as heat in traditional friction brakes.
            </p>
            <div className="regen-benefits">
              <div className="benefit">
                <strong>30%</strong>
                <span>Range increase in city driving</span>
              </div>
              <div className="benefit">
                <strong>70%</strong>
                <span>Less brake pad wear</span>
              </div>
              <div className="benefit">
                <strong>5 tons</strong>
                <span>CO₂ saved per year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Grid Integration */}
      <section className="tech-section grid-integration">
        <div className="section-content">
          <h2>Vehicle-to-Grid (V2G) Technology</h2>
          <div className="v2g-info">
            <h3>Your Car as a Power Station</h3>
            <p>
              With V2G technology, your vehicle becomes a mobile energy storage unit. During peak 
              renewable energy production, charge your car with clean energy. During peak demand, 
              sell energy back to the grid or power your home during outages.
            </p>
            <div className="v2g-stats">
              <div className="stat">
                <span className="value">$2,000</span>
                <span className="label">Annual earnings potential</span>
              </div>
              <div className="stat">
                <span className="value">3 days</span>
                <span className="label">Home backup power</span>
              </div>
              <div className="stat">
                <span className="value">100%</span>
                <span className="label">Renewable integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="tech-cta">
        <h2>Smart Energy for a Sustainable Future</h2>
        <p>Our intelligent systems reduce grid strain and maximize renewable energy use</p>
        <Link to="/" className="cta-button">Experience Smart Driving</Link>
      </section>
    </div>
  );
};

export default EnergyManagement;