// src/pages/ContactUs.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: t('Email'),
      detail: 'info@nevalmobility.com',
      link: 'mailto:info@nevalmobility.com'
    },
    {
      icon: <Phone size={24} />,
      title: t('Phone'),
      detail: '+355 68 906 1430',
      link: 'tel:+355689061430'
    },
    {
      icon: <MapPin size={24} />,
      title: t('Location'),
      detail: 'Tirana, Albania',
      link: null
    },
    {
      icon: <Clock size={24} />,
      title: t('Business Hours'),
      detail: t('Mon - Fri: 9:00 AM - 6:00 PM'),
      link: null
    }
  ];

return (
    <div className="contact-page">
      {/* Header - Same as About */}
      <header className="contact-header">
        <nav className="contact-nav">
          <Link to="/" className="logo-link">
            <img src="/logo.jpg" alt="NEVAL" className="logo-img" />
          </Link>
          <ul className="nav-links">
            <li><Link to="/">{t('Home')}</Link></li>
            <li><Link to="/fleet">{t('Fleet')}</Link></li>
            <li><Link to="/technology/blade-battery">{t('Technology')}</Link></li>
            <li><Link to="/about">{t('About')}</Link></li>
            <li><Link to="/contact" className="active">{t('Contact')}</Link></li>
          </ul>
          <button 
            className="nav-cta"
            onClick={() => navigate('/request-pricing')}
          >
            {t('Request Pricing')}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="contact-hero">
        <motion.div 
          className="contact-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="contact-hero-title">
            {t('Get in')} <span className="highlight">{t('Touch')}</span>
          </h1>
          <p className="contact-hero-subtitle">
            {t('We\'re here to help you drive into the future')}
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="contact-container">
          <motion.div 
            className="info-cards-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                className="contact-info-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="info-icon-wrapper">
                  {info.icon}
                </div>
                <h3>{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="info-link">
                    {info.detail}
                  </a>
                ) : (
                  <p>{info.detail}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-container">
          <motion.div 
            className="form-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="form-header-text">
              <h2>{t('Send Us a Message')}</h2>
              <p>{t('Have questions about our electric vehicles? Want to schedule a test drive? We\'d love to hear from you. Fill out the form below and we\'ll get back to you within 24 hours.')}</p>
            </div>

            {success && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MessageSquare size={20} />
                {t('Message sent successfully! We\'ll get back to you soon.')}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('Full Name')} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('Email Address')} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t('Phone Number')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+355 XX XXX XXXX"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">{t('Subject')} *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">{t('Select a subject')}</option>
                    <option value="test-drive">{t('Schedule Test Drive')}</option>
                    <option value="pricing">{t('Pricing Information')}</option>
                    <option value="fleet">{t('Fleet Sales')}</option>
                    <option value="technical">{t('Technical Support')}</option>
                    <option value="general">{t('General Inquiry')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">{t('Message')} *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={t('Tell us how we can help you...')}
                  className="form-input"
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  t('Sending...')
                ) : (
                  <>
                    {t('Send Message')}
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>{t('Ready to Experience Electric?')}</h2>
          <p>
            {t('Schedule a test drive today and discover the perfect electric vehicle for your needs')}
          </p>
          <div className="cta-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate('/fleet')}
            >
              {t('View Our Fleet')}
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/request-pricing')}
            >
              {t('Request Pricing')}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer - Same as About */}
      <footer className="fleet-footer">
        <div className="fleet-footer-content">
          <p>&copy; 2025 Neval Mobility. {t('All rights reserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;