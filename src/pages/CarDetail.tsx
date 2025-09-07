// src/pages/CarDetail.tsx - FIXED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from '../services/firebase';
import { Car } from '../types/Car';
import { useLanguage } from '../contexts/LanguageContext';
import './CarDetail.css';

const CarDetail: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailTrackRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const MAX_VISIBLE_THUMBNAILS = 12;
  const THUMBNAIL_WIDTH = windowWidth <= 1024 ? 80 : 90; // Responsive width

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    
    // Auto-scroll to selected thumbnail if it's out of view
    if (thumbnailTrackRef.current && car?.images) {
      const visibleStart = scrollPosition;
      const visibleEnd = scrollPosition + MAX_VISIBLE_THUMBNAILS - 1;
      
      if (index < visibleStart) {
        scrollToPosition(index);
      } else if (index > visibleEnd) {
        scrollToPosition(Math.max(0, index - MAX_VISIBLE_THUMBNAILS + 1));
      }
    }
  };

  const scrollToPosition = (position: number) => {
    if (!car?.images) return;
    const maxScroll = Math.max(0, car.images.length - MAX_VISIBLE_THUMBNAILS);
    const newPosition = Math.max(0, Math.min(position, maxScroll));
    setScrollPosition(newPosition);
    
    if (thumbnailTrackRef.current) {
      thumbnailTrackRef.current.style.transform = `translateX(-${newPosition * THUMBNAIL_WIDTH}px)`;
    }
  };

  const scrollLeft = () => {
    scrollToPosition(scrollPosition - 1);
  };

  const scrollRight = () => {
    scrollToPosition(scrollPosition + 1);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = car?.images ? scrollPosition < car.images.length - MAX_VISIBLE_THUMBNAILS : false;
  const showArrows = car?.images && car.images.length > MAX_VISIBLE_THUMBNAILS && windowWidth > 768;

  // Touch handlers for mobile swipe on main image
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && car?.images && currentImageIndex < car.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
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
        <h2>{t('Vehicle not found')}</h2>
        <Link to="/" className="error-back-btn-minimal">{t('Back to Fleet')}</Link>
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
          {t('Request Pricing')}
        </button>
      </header>

      {/* Main Hero Section */}
      <section className="hero-section-minimal">
        {/* Main Car Display */}
        <div className="main-car-display">
          {/* Image Container with Auto-Fit Frame */}
          <div 
            className="car-image-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {car.images && car.images.length > 0 ? (
              <img 
                src={car.images[currentImageIndex]} 
                alt={car.name}
                className="hero-car-image-autofit"
              />
            ) : (
              <div className="no-image-placeholder">{t('No image available')}</div>
            )}
          </div>
        </div>

        {/* Image Thumbnails with Single-Slide Navigation */}
        {car.images && car.images.length > 1 && (
          <div className="image-thumbnails-wrapper">
            {/* Desktop Navigation Arrows */}
            {showArrows && (
              <button 
                className={`thumbnail-arrow thumbnail-arrow-prev ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                aria-label={t('Previous image')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Thumbnails Container */}
            <div 
              className="image-thumbnails"
              ref={thumbnailContainerRef}
              style={{ 
                width: windowWidth <= 768 
                  ? '100%' // Mobile: full width for scrolling
                  : car.images.length < MAX_VISIBLE_THUMBNAILS 
                    ? windowWidth <= 1024 
                      ? `${car.images.length * 80 - 10}px`  // Tablet
                      : `${car.images.length * 90 - 10}px`  // Desktop
                    : windowWidth <= 1024 
                      ? '950px'  // Tablet: 12 visible
                      : '1070px' // Desktop: 12 visible
              }}
            >
              <div 
                className="thumbnails-track"
                ref={thumbnailTrackRef}
              >
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => selectImage(index)}
                    aria-label={`${t('View image')} ${index + 1}`}
                  >
                    <img src={image} alt={`${t('View')} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Navigation Arrows */}
            {showArrows && (
              <button 
                className={`thumbnail-arrow thumbnail-arrow-next ${!canScrollRight ? 'disabled' : ''}`}
                onClick={scrollRight}
                disabled={!canScrollRight}
                aria-label={t('Next image')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Progress Indicator Dots */}
        {car.images && car.images.length > 1 && (
          <div className="image-progress-dots">
            {car.images.map((_, index) => (
              <span 
                key={index}
                className={`progress-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => selectImage(index)}
              />
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
          <h2>{t('Overview')}</h2>
          <p className="car-description">{car.description}</p>
        </div>
      </section>

      {/* Editions Section */}
      {car.features && car.features.length > 0 && (
        <section className="editions-section">
          <h2 className="editions-title">{t('Available Editions')}</h2>
          <div className="editions-grid">
            {car.features.map((edition, index) => {
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
          <p>&copy; 2025 Neval Mobility. {t('All rights reserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarDetail;