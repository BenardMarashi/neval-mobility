import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext'; // ADD THIS
import './TechnologyPages.css';

const EnergyManagement: React.FC = () => {
  const { t } = useLanguage(); // ADD THIS
  const [activeMode, setActiveMode] = useState<'eco' | 'normal' | 'sport'>('normal');

  return (
    <div className="tech-page energy-management">
      <nav className="tech-nav">
        <Link to="/" className="back-link">{t('← Back to Home')}</Link>
        <div className="tech-nav-links">
          <Link to="/technology/blade-battery">{t('Blade Battery')}</Link>
          <Link to="/technology/e-platform">{t('e-Platform 3.0')}</Link>
          <Link to="/technology/energy-management" className="active">{t('Energy Management')}</Link>
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
            {t('Intelligent Optimization')}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('Energy Management System')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('AI-powered system that maximizes efficiency and minimizes environmental impact. Smart regeneration, V2G capability, and adaptive driving modes.')}
          </motion.p>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero-stat">
              <span className="stat-number">90%</span>
              <span className="stat-text">{t('Energy Recovery')}</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">V2G</span>
              <span className="stat-text">{t('Grid Support')}</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">+30%</span>
              <span className="stat-text">{t('City Range')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Driving Modes */}
      <section className="tech-section driving-modes">
        <div className="section-content">
          <h2>{t('Adaptive Driving Modes')}</h2>
          <div className="mode-selector">
            {(['eco', 'normal', 'sport'] as const).map(mode => (
              <button
                key={mode}
                className={`mode-btn ${activeMode === mode ? 'active' : ''}`}
                onClick={() => setActiveMode(mode)}
              >
                {t(mode.charAt(0).toUpperCase() + mode.slice(1))}
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
                    <h3>{t('ECO Mode - Maximum Efficiency')}</h3>
                    <p>{t('Optimizes every joule of energy for maximum range')}</p>
                    <div className="mode-stats">
                      <div className="stat">
                        <span className="value">+20%</span>
                        <span className="label">{t('Range Extension')}</span>
                      </div>
                      <div className="stat">
                        <span className="value">-30%</span>
                        <span className="label">{t('Power Consumption')}</span>
                      </div>
                      <div className="stat">
                        <span className="value">100%</span>
                        <span className="label">{t('Regeneration')}</span>
                      </div>
                    </div>
                  </>
                )}
                {activeMode === 'normal' && (
                  <>
                    <h3>{t('Normal Mode - Balanced Performance')}</h3>
                    <p>{t('Intelligent balance between efficiency and responsiveness')}</p>
                    <div className="mode-stats">
                      <div className="stat">
                        <span className="value">{t('Optimal')}</span>
                        <span className="label">{t('Daily Driving')}</span>
                      </div>
                      <div className="stat">
                        <span className="value">{t('Smart')}</span>
                        <span className="label">{t('Power Delivery')}</span>
                      </div>
                      <div className="stat">
                        <span className="value">70%</span>
                        <span className="label">{t('Regeneration')}</span>
                      </div>
                    </div>
                  </>
                )}
                {activeMode === 'sport' && (
                  <>
                    <h3>{t('Sport Mode - Peak Performance')}</h3>
                    <p>{t('Maximum power delivery for spirited driving')}</p>
                    <div className="mode-stats">
                      <div className="stat">
                        <span className="value">100%</span>
                        <span className="label">{t('Power Available')}</span>
                      </div>
                      <div className="stat">
                        <span className="value">{t('Enhanced')}</span>
                        <span className="label">{t('Throttle Response')}</span>
                      </div>
                      <div className="stat">
                        <span className="value">50%</span>
                        <span className="label">{t('Regeneration')}</span>
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
          <h2>{t('Regenerative Braking System')}</h2>
          <div className="regen-explanation">
            <h3>{t('Energy Recovery Technology')}</h3>
            <p>
              {t('Our advanced regenerative braking system captures up to 90% of kinetic energy during deceleration, converting it back into electricity to charge the battery. This recovered energy would otherwise be lost as heat in traditional friction brakes.')}
            </p>
            <div className="regen-benefits">
              <div className="benefit">
                <strong>30%</strong>
                <span>{t('Range increase in city driving')}</span>
              </div>
              <div className="benefit">
                <strong>70%</strong>
                <span>{t('Less brake pad wear')}</span>
              </div>
              <div className="benefit">
                <strong>5 {t('tons')}</strong>
                <span>{t('CO₂ saved per year')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Grid Integration */}
      <section className="tech-section grid-integration">
        <div className="section-content">
          <h2>{t('Vehicle-to-Grid (V2G) Technology')}</h2>
          <div className="v2g-info">
            <h3>{t('Your Car as a Power Station')}</h3>
            <p>
              {t('With V2G technology, your vehicle becomes a mobile energy storage unit. During peak renewable energy production, charge your car with clean energy. During peak demand, sell energy back to the grid or power your home during outages.')}
            </p>
            <div className="v2g-stats">
              <div className="stat">
                <span className="value">$2,000</span>
                <span className="label">{t('Annual earnings potential')}</span>
              </div>
              <div className="stat">
                <span className="value">3 {t('days')}</span>
                <span className="label">{t('Home backup power')}</span>
              </div>
              <div className="stat">
                <span className="value">100%</span>
                <span className="label">{t('Renewable integration')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="tech-cta">
        <h2>{t('Smart Energy for a Sustainable Future')}</h2>
        <p>{t('Our intelligent systems reduce grid strain and maximize renewable energy use')}</p>
        <Link to="/" className="cta-button">{t('Experience Smart Driving')}</Link>
      </section>
    </div>
  );
};

export default EnergyManagement;