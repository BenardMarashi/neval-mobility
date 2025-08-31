// src/pages/CarDetail.tsx - COMPLETE REDESIGN
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from '../services/firebase';
import { Car, CATEGORY_LABELS } from '../types/Car';
import { ChevronLeft, ChevronRight, MapPin, Calendar, CreditCard } from 'lucide-react';
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

  const nextImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="detail-error">
        <h2>Vehicle not found</h2>
        <Link to="/" className="error-back-btn">Back to Fleet</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      {/* Header */}
      <header className="detail-header">
        <Link to="/" className="header-back">
          <ChevronLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="header-actions">
          <button className="action-btn">Rent</button>
          <button className="action-btn">Buy</button>
          <button className="action-btn">Sell</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="detail-container">
        <div className="detail-grid">
          {/* Left Column - Car Info */}
          <div className="detail-left">
            <div className="car-title-section">
              <h1>{car.name}</h1>
              <p className="car-subtitle">{car.type}</p>
              {car.category && (
                <span className="category-tag">{CATEGORY_LABELS[car.category]}</span>
              )}
            </div>

            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="gallery-main">
                {car.images && car.images.length > 0 ? (
                  <>
                    <img 
                      src={car.images[currentImageIndex]} 
                      alt={`${car.name} view ${currentImageIndex + 1}`}
                      className="main-image"
                    />
                    {car.images.length > 1 && (
                      <>
                        <button className="gallery-nav prev" onClick={prevImage}>
                          <ChevronLeft size={24} />
                        </button>
                        <button className="gallery-nav next" onClick={nextImage}>
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="no-image">No images available</div>
                )}
              </div>
              {car.images && car.images.length > 1 && (
                <div className="gallery-dots">
                  {car.images.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Grid */}
            <div className="specs-cards">
              <div className="spec-card glass">
                <span className="spec-label">Range</span>
                <span className="spec-value">{car.range}</span>
              </div>
              <div className="spec-card glass">
                <span className="spec-label">0-100 km/h</span>
                <span className="spec-value">{car.acceleration}</span>
              </div>
              <div className="spec-card glass">
                <span className="spec-label">Top Speed</span>
                <span className="spec-value">{car.topSpeed}</span>
              </div>
              <div className="spec-card glass">
                <span className="spec-label">Battery</span>
                <span className="spec-value">{car.battery}</span>
              </div>
              <div className="spec-card glass">
                <span className="spec-label">Charging</span>
                <span className="spec-value">{car.charging}</span>
              </div>
              <div className="spec-card glass">
                <span className="spec-label">Seats</span>
                <span className="spec-value">{car.seats}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="detail-right">
            {/* AI Assistant Card */}
            <div className="assistant-card glass">
              <div className="assistant-header">
                <span>AI Assistant</span>
                <button className="close-btn">×</button>
              </div>
              <p className="assistant-text">How can I help you?</p>
            </div>

            {/* Booking Options */}
            <div className="booking-card glass">
              <div className="booking-option">
                <div className="option-icon">📅</div>
                <div className="option-content">
                  <span className="option-label">Book a rent</span>
                  <span className="option-time">5 min</span>
                </div>
              </div>

              <div className="booking-option">
                <div className="option-icon">🔍</div>
                <div className="option-content">
                  <span className="option-label">Analysis</span>
                  <span className="option-status">Available</span>
                </div>
              </div>

              <div className="booking-option">
                <div className="option-icon">🛡️</div>
                <div className="option-content">
                  <span className="option-label">Insurance</span>
                  <span className="option-action">Pick a Plan</span>
                </div>
              </div>

              <div className="booking-option">
                <div className="option-icon">💳</div>
                <div className="option-content">
                  <span className="option-label">Payment</span>
                  <span className="option-action">Calculate</span>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="price-card glass">
              <div className="price-label">Starting from</div>
              <div className="price-value">{car.price}</div>
              <button 
                className="request-pricing-btn"
                onClick={() => navigate(`/request-pricing?car=${car.id}`)}
              >
                Request Pricing
              </button>
            </div>

            {/* Features List */}
            {car.features && car.features.length > 0 && (
              <div className="features-card glass">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {car.features.slice(0, 5).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;