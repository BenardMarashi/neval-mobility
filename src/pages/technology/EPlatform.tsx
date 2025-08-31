// src/pages/technology/EPlatform.tsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import './TechnologyPages.css';

const EPlatform: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="tech-page e-platform" ref={containerRef}>
      <nav className="tech-nav">
        <Link to="/" className="back-link">← Back to Home</Link>
        <div className="tech-nav-links">
          <Link to="/technology/blade-battery">Blade Battery</Link>
          <Link to="/technology/e-platform" className="active">e-Platform 3.0</Link>
          <Link to="/technology/energy-management">Energy Management</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="tech-hero platform-hero">
        <motion.div 
          className="platform-visual"
          style={{ rotate }}
        >
          <div className="platform-core">
            <div className="component motor">Motor</div>
            <div className="component controller">Controller</div>
            <div className="component transmission">Transmission</div>
            <div className="component pdu">PDU</div>
            <div className="component dc-dc">DC-DC</div>
            <div className="component obc">OBC</div>
            <div className="component vcu">VCU</div>
            <div className="component bms">BMS</div>
          </div>
        </motion.div>
        
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            e-Platform 3.0
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            8-in-1 integration that revolutionizes electric vehicle efficiency
          </motion.p>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="tech-section integration">
        <div className="section-content">
          <h2>Revolutionary Integration</h2>
          <div className="integration-showcase">
            <div className="before-after">
              <div className="before">
                <h3>Traditional EV</h3>
                <div className="component-list">
                  <div className="component-item">Separate Motor</div>
                  <div className="component-item">Standalone Controller</div>
                  <div className="component-item">Individual Transmission</div>
                  <div className="component-item">Isolated Power Distribution</div>
                  <div className="component-item">Multiple Cooling Systems</div>
                  <div className="component-item">Complex Wiring</div>
                </div>
                <div className="stats">
                  <span>Weight: 180kg</span>
                  <span>Volume: 120L</span>
                  <span>Efficiency: 82%</span>
                </div>
              </div>
              <div className="after">
                <h3>e-Platform 3.0</h3>
                <div className="component-list integrated">
                  <div className="component-item">8-in-1 Power Module</div>
                  <div className="component-item">Integrated Cooling</div>
                  <div className="component-item">Simplified Architecture</div>
                </div>
                <div className="stats">
                  <span>Weight: 138kg (-23%)</span>
                  <span>Volume: 72L (-40%)</span>
                  <span>Efficiency: 89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="tech-section environmental">
        <div className="section-content">
          <h2>Environmental Benefits</h2>
          <div className="benefit-cards">
            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3>20% Less Raw Materials</h3>
              <p>
                Integration eliminates redundant housings, connectors, and cooling systems. This means 
                20% less aluminum, copper, and rare earth materials per vehicle.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>10% Higher Efficiency</h3>
              <p>
                Shorter power paths and optimized thermal management increase drivetrain efficiency from 
                82% to 89%, meaning 10% more range from the same battery.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">♻️</div>
              <h3>Easier Recycling</h3>
              <p>
                Modular design allows entire power unit replacement and refurbishment. Components are 
                easier to separate and recycle at end of life.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏭</div>
              <h3>Simplified Manufacturing</h3>
              <p>
                40% fewer parts mean less factory equipment, lower energy consumption, and reduced 
                manufacturing emissions per vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heat Pump System */}
      <section className="tech-section heat-pump">
        <div className="section-content">
          <h2>Wide-Temperature Heat Pump</h2>
          <div className="heat-pump-grid">
            <div className="heat-pump-visual">
              <motion.div 
                className="heat-flow"
                animate={{ 
                  background: [
                    "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                    "linear-gradient(45deg, #4ecdc4, #ff6b6b)",
                    "linear-gradient(45deg, #ff6b6b, #4ecdc4)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <div className="heat-pump-info">
              <h3>Energy Recovery System</h3>
              <p>
                The integrated heat pump captures waste heat from the motor, inverter, and battery, 
                using it for cabin heating. This revolutionary system works efficiently even at -30°C.
              </p>
              <div className="efficiency-stats">
                <div className="stat">
                  <span className="stat-value">60%</span>
                  <span className="stat-label">Less Energy for Heating</span>
                </div>
                <div className="stat">
                  <span className="stat-value">20%</span>
                  <span className="stat-label">Winter Range Improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="tech-cta">
        <h2>Engineering Excellence for Sustainability</h2>
        <p>Every e-Platform 3.0 vehicle saves 2 tons of CO₂ in manufacturing</p>
        <Link to="/" className="cta-button">Discover Our Technology</Link>
      </section>
    </div>
  );
};

export default EPlatform;