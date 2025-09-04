// src/pages/CarDetail.tsx - SIMPLIFIED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from '../services/firebase';
import { Car } from '../types/Car';
import './CarDetail.css';

const CarDetail: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setLoading(false);
        return;
      }

      try {
        const carDoc = await getDoc(doc(db, 'cars', carId));
        if (carDoc.exists()) {
          const carData = { id: carDoc.id, ...carDoc.data() } as Car;
          setCar(carData);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="detail-loading-minimal">
        <div className="loading-spinner-minimal"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="detail-error-minimal">
        <h2>Vehicle not found</h2>
        <Link to="/" className="error-back-btn-minimal">Back to Fleet</Link>
      </div>
    );
  }

  return (
    <div className="detail-page-minimal">
      {/* Minimal Header */}
      <header className="detail-header-minimal">
        <div className="header-logo">
          <Link to="/">
            <img src="/logo.jpg" alt="Neval" className="brand-logo" />
          </Link>
        </div>

        <button 
          className="request-pricing-header-btn" 
          onClick={() => navigate('/request-pricing?car=' + car.id)}
        >
          Request Pricing
        </button>
      </header>

      {/* Main Hero Section */}
      <section className="hero-section-minimal">
        {/* Main Car Display */}
        <div className="main-car-display">
          {/* Image Container with Auto-Fit Frame */}
          <div className="car-image-container">
            {car.images && car.images.length > 0 ? (
              <img 
                src={car.images[currentImageIndex]} 
                alt={car.name}
                className="hero-car-image-autofit"
              />
            ) : (
              <div className="no-image-placeholder">No image available</div>
            )}
          </div>
        </div>

        {/* Image Thumbnails */}
        {car.images && car.images.length > 1 && (
          <div className="image-thumbnails">
            {car.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => selectImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt={`View ${index + 1}`} />
              </button>
            ))}
          </div>
        )}

        {/* Car Info Bar */}
        <div className="car-info-bar">
          <h1 className="car-model-name">{car.name}</h1>
        </div>
      </section>

      {/* Description Section with Single CTA */}
      <section className="description-section-minimal">
        <div className="description-container">
          <h2>Overview</h2>
          <p className="car-description">{car.description}</p>
        </div>
      </section>

      {/* Editions Section - Add this after the Overview section */}
      {car.features && car.features.length > 0 && (
        <section className="editions-section">
          <h2 className="editions-title">Available Editions</h2>
          <div className="editions-grid">
            {car.features.map((edition, index) => {
              // Parse edition name to extract type
              const isSmartDrive = edition.toLowerCase().includes('smart drive');
              const is4WD = edition.includes('4WD');
              const isPro = edition.toLowerCase().includes('pro');
              const isMax = edition.toLowerCase().includes('max');
              const isUltra = edition.toLowerCase().includes('ultra');
              
              
              return (
                <div key={index} className="edition-card">
                  <h3 className="edition-name">{edition}</h3>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {/* Footer */}
      <footer className="fleet-footer">
        <div className="fleet-footer-content">
          <p>&copy; 2025 Neval Mobility. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarDetail;