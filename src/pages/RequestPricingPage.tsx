// src/pages/RequestPricingPage.tsx - NEW PAGE
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db, collection, getDocs, addDoc, serverTimestamp, query, where } from '../services/firebase';
import { Car } from '../types/Car';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './RequestPricingPage.css';

const EUROPEAN_COUNTRIES = [
  'Albania',
  'Andorra',
  'Armenia',
  'Austria',
  'Azerbaijan',
  'Belarus',
  'Belgium',
  'Bosnia and Herzegovina',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Kazakhstan', // European part
  'Kosovo',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Moldova',
  'Monaco',
  'Montenegro',
  'Netherlands',
  'North Macedonia',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Russia', // European part
  'San Marino',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey', // European part
  'Ukraine',
  'United Kingdom',
  'Vatican City'
].sort();

const RequestPricingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const preselectedCarId = searchParams.get('car');
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    carId: preselectedCarId || '',
    additionalInfo: ''
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsQuery = query(
          collection(db, 'cars'),
          where('isActive', '==', true)
        );
        const snapshot = await getDocs(carsQuery);
        const carsData: Car[] = [];
        snapshot.forEach(doc => {
          carsData.push({ id: doc.id, ...doc.data() } as Car);
        });
        setCars(carsData.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedCar = cars.find(car => car.id === formData.carId);
      
      await addDoc(collection(db, 'pricingRequests'), {
        ...formData,
        carName: selectedCar?.name || 'Unknown',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="pricing-page">
        <div className="success-container glass">
          <div className="success-icon">✓</div>
          <h2>{t('Request Submitted Successfully!')}</h2>
          <p>{t('We\'ll contact you within 24 hours with your personalized pricing.')}</p>
          <p className="redirect-text">{t('Redirecting to homepage...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-page">
      {/* Header */}
      <header className="pricing-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ChevronLeft size={20} />
          <span>{t('Back')}</span>
        </button>
        <h1>{t('Request Pricing')}</h1>
      </header>

      {/* Form Container */}
      <div className="pricing-container">
        <div className="pricing-form-card glass">
          <div className="form-header">
            <h2>{t('Get Your Personalized Quote')}</h2>
            <p>{t('Fill in your details and we\'ll send you a tailored pricing offer')}</p>
          </div>

          <form onSubmit={handleSubmit} className="pricing-form">
            <div className="form-grid">
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
                  className="glass-input"
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
                  className="glass-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('Phone Number')} *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+43 123 456 7890"
                  className="glass-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">{t('Country')} *</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="glass-input"
                >
                  <option value="">{t('Select your country')}</option>
                  {EUROPEAN_COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="carId">{t('Select Vehicle')} *</label>
                <select
                  id="carId"
                  name="carId"
                  value={formData.carId}
                  onChange={handleChange}
                  required
                  className="glass-input"
                >
                  <option value="">{t('Choose a vehicle')}</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.name} - {car.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="additionalInfo">{t('Additional Information')}</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t('Tell us about your specific requirements, preferred payment options, or any questions...')}
                  className="glass-input"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? t('Submitting...') : t('Submit Request')}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card glass">
            <div className="info-icon">🚗</div>
            <h3>{t('Wide Selection')}</h3>
            <p>{t('Choose from our extensive fleet of premium electric vehicles')}</p>
          </div>
          <div className="info-card glass">
            <div className="info-icon">💰</div>
            <h3>{t('Best Prices')}</h3>
            <p>{t('Competitive pricing with flexible payment options')}</p>
          </div>
          <div className="info-card glass">
            <div className="info-icon">⚡</div>
            <h3>{t('Fast Response')}</h3>
            <p>{t('Get your personalized quote within 24 hours')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPricingPage;