// src/components/AnimatedFeatures.tsx - UPDATED VERSION
import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Gauge, Zap } from 'lucide-react';
import './AnimatedFeatures.css';
import { Link } from 'react-router-dom';

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
    color: 'var(--primary)',
    link: '/technology/blade-battery'  // ADDED
  },
  {
    id: 'driving',
    title: 'e-Platform 3.0',  // CHANGED to match actual page
    description: '8-in-1 integrated platform with revolutionary efficiency. Simplified architecture for maximum performance.',  // UPDATED
    icon: <Gauge size={60} />,
    stats: [
      { value: '8-in-1', label: 'Integration' },  // UPDATED
      { value: '89%', label: 'Efficiency' },      // UPDATED
      { value: '-40%', label: 'Volume' }          // UPDATED
    ],
    color: 'var(--accent)',
    link: '/technology/e-platform'  // ADDED
  },
  {
    id: 'charging',
    title: 'Energy Management',  // CHANGED to match actual page
    description: 'Intelligent energy optimization with regenerative braking and V2G capability. Smart grid integration.',  // UPDATED
    icon: <Zap size={60} />,
    stats: [
      { value: '90%', label: 'Energy Recovery' },  // UPDATED
      { value: 'V2G', label: 'Grid Support' },     // UPDATED
      { value: '+30%', label: 'City Range' }       // UPDATED
    ],
    color: 'var(--secondary)',
    link: '/technology/energy-management'  // ADDED
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
          <p className="features-subtitle">Click to explore our revolutionary innovations</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <Link 
              key={feature.id} 
              to={feature.link}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                className="feature-card"
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ cursor: 'pointer' }}  // ADDED
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
                
                <div className="feature-link" style={{ 
                  marginTop: '20px', 
                  color: feature.color,
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Learn More →
                </div>
              </motion.div>
            </Link>
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