import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext'; // ADD THIS
import './TechnologyPages.css';

const EPlatform: React.FC = () => {
  const { t } = useLanguage(); // ADD THIS

  return (
    <div className="tech-page e-platform">
      <nav className="tech-nav">
        <Link to="/" className="back-link">{t('← Back to Home')}</Link>
        <div className="tech-nav-links">
          <Link to="/technology/blade-battery">{t('Blade Battery')}</Link>
          <Link to="/technology/e-platform" className="active">{t('e-Platform 3.0')}</Link>
          <Link to="/technology/energy-management">{t('Energy Management')}</Link>
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
            {t('Revolutionary Integration')}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('e-Platform 3.0')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('8-in-1 integration that revolutionizes electric vehicle efficiency. 40% less volume, 23% less weight, and 10% higher efficiency than traditional EVs.')}
          </motion.p>
          
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero-stat">
              <span className="stat-number">{t('8-in-1')}</span>
              <span className="stat-text">{t('Power Module')}</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">89%</span>
              <span className="stat-text">{t('System Efficiency')}</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">-40%</span>
              <span className="stat-text">{t('Component Volume')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="tech-section integration">
        <div className="section-content">
          <h2>{t('Revolutionary Integration')}</h2>
          <div className="integration-showcase">
            <div className="before-after">
              <div className="before">
                <h3>{t('Traditional EV')}</h3>
                <div className="component-list">
                  <div className="component-item">{t('Separate Motor')}</div>
                  <div className="component-item">{t('Standalone Controller')}</div>
                  <div className="component-item">{t('Individual Transmission')}</div>
                  <div className="component-item">{t('Isolated Power Distribution')}</div>
                  <div className="component-item">{t('Multiple Cooling Systems')}</div>
                  <div className="component-item">{t('Complex Wiring')}</div>
                </div>
                <div className="stats">
                  <span>{t('Weight')}: 180kg</span>
                  <span>{t('Volume')}: 120L</span>
                  <span>{t('Efficiency')}: 82%</span>
                </div>
              </div>
              <div className="after">
                <h3>{t('e-Platform 3.0')}</h3>
                <div className="component-list integrated">
                  <div className="component-item">{t('8-in-1 Power Module')}</div>
                  <div className="component-item">{t('Integrated Cooling')}</div>
                  <div className="component-item">{t('Simplified Architecture')}</div>
                </div>
                <div className="stats">
                  <span>{t('Weight')}: 138kg (-23%)</span>
                  <span>{t('Volume')}: 72L (-40%)</span>
                  <span>{t('Efficiency')}: 89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="tech-section environmental">
        <div className="section-content">
          <h2>{t('Environmental Benefits')}</h2>
          <div className="benefit-cards">
            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3>{t('20% Less Raw Materials')}</h3>
              <p>
                {t('Integration eliminates redundant housings, connectors, and cooling systems. This means 20% less aluminum, copper, and rare earth materials per vehicle.')}
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>{t('10% Higher Efficiency')}</h3>
              <p>
                {t('Shorter power paths and optimized thermal management increase drivetrain efficiency from 82% to 89%, meaning 10% more range from the same battery.')}
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">♻️</div>
              <h3>{t('Easier Recycling')}</h3>
              <p>
                {t('Modular design allows entire power unit replacement and refurbishment. Components are easier to separate and recycle at end of life.')}
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏭</div>
              <h3>{t('Simplified Manufacturing')}</h3>
              <p>
                {t('40% fewer parts mean less factory equipment, lower energy consumption, and reduced manufacturing emissions per vehicle.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heat Pump System */}
      <section className="tech-section heat-pump">
        <div className="section-content">
          <h2>{t('Wide-Temperature Heat Pump')}</h2>
          <div className="heat-pump-info">
            <h3>{t('Energy Recovery System')}</h3>
            <p>
              {t('The integrated heat pump captures waste heat from the motor, inverter, and battery, using it for cabin heating. This revolutionary system works efficiently even at -30°C.')}
            </p>
            <div className="efficiency-stats">
              <div className="stat">
                <span className="stat-value">60%</span>
                <span className="stat-label">{t('Less Energy for Heating')}</span>
              </div>
              <div className="stat">
                <span className="stat-value">20%</span>
                <span className="stat-label">{t('Winter Range Improvement')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="tech-cta">
        <h2>{t('Engineering Excellence for Sustainability')}</h2>
        <p>{t('Every e-Platform 3.0 vehicle saves 2 tons of CO₂ in manufacturing')}</p>
        <Link to="/" className="cta-button">{t('Discover Our Technology')}</Link>
      </section>
    </div>
  );
};

export default EPlatform;