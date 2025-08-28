// src/components/AnimatedFeatures.tsx - NEW FILE
import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Gauge, Zap } from 'lucide-react';
import './AnimatedFeatures.css';

const features = [
  {
    id: 'battery',
    title: 'Blade Battery Technology',
    description: 'Revolutionary LFP battery technology delivering unmatched safety, longevity, and performance. Over 1 million kilometers lifespan.',
    icon: <Battery size={60} />,
    stats: [
      { value: '1M+', label: 'km lifespan' },
      { value: '800V', label: 'architecture' },
      { value: '18min', label: '10-80% charge' }
    ],
    color: 'var(--primary)'
  },
  {
    id: 'driving',
    title: 'Intelligent Driving',
    description: 'Advanced ADAS with 33 sensors providing 360° perception. Highway pilot and intelligent parking assistance.',
    icon: <Gauge size={60} />,
    stats: [
      { value: '33', label: 'Sensors' },
      { value: '360°', label: 'Coverage' },
      { value: 'L2+', label: 'Autonomy' }
    ],
    color: 'var(--accent)'
  },
  {
    id: 'charging',
    title: 'Charging Network',
    description: 'Access to over 15,000 charging points across the country. Fast, reliable, and powered by renewable energy.',
    icon: <Zap size={60} />,
    stats: [
      { value: '15K+', label: 'Charging Points' },
      { value: '350kW', label: 'Max Power' },
      { value: '24/7', label: 'Availability' }
    ],
    color: 'var(--secondary)'
  }
];

const AnimatedFeatures: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="technology" className="animated-features-section">
      <div className="features-container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="features-title">Advanced Technology</h2>
          <p className="features-subtitle">Leading the future of electric mobility</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="feature-card"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="feature-icon"
                style={{ color: feature.color }}
              >
                {feature.icon}
              </div>
              
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-stats">
                {feature.stats.map((stat, i) => (
                  <div key={i} className="stat">
                    <div className="stat-value" style={{ color: feature.color }}>
                      {stat.value}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sustainability Section - Full Width */}
        <motion.div 
          className="sustainability-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="sustainability-content">
            <h3 className="sustainability-title">Every Kilometer Matters</h3>
            <div className="sustainability-stats">
              <motion.div 
                className="sustainability-stat"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="sustainability-value">0</div>
                <div className="sustainability-label">Direct Emissions</div>
              </motion.div>
              <motion.div 
                className="sustainability-stat"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="sustainability-value">96%</div>
                <div className="sustainability-label">Recyclable</div>
              </motion.div>
              <motion.div 
                className="sustainability-stat"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <div className="sustainability-value">-50%</div>
                <div className="sustainability-label">Carbon vs ICE</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedFeatures;