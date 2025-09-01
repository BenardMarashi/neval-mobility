// src/components/ImprovedCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

interface CarItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string;
  price?: string;
  type?: string;
}

interface ImprovedCarouselProps {
  items: CarItem[];
  onRequestPricing?: (carId: string) => void;
}

const ImprovedCarousel: React.FC<ImprovedCarouselProps> = ({ 
  items, 
  onRequestPricing 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Handle orientation change
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Touch/Swipe handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

    if (isLeftSwipe && currentIndex < maxIndex) {
      handleNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      handlePrevious();
    }
  };

  const getImageUrl = (item: CarItem): string => {
    // If item has an image property, use it
    if (item.image) return item.image;
    
    // Otherwise use a placeholder or default image
    return '/placeholder-car.jpg';
  };

  return (
    <div className="improved-carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">Our Fleet</h2>
        <div className="carousel-controls">
          <button 
            className={`carousel-nav-btn ${currentIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className={`carousel-nav-btn ${currentIndex >= maxIndex ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="carousel-viewport">
        <div 
          className="carousel-track-improved"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            transition: isAnimating ? 'transform 0.3s ease' : 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item) => (
            <div 
              key={item.id}
              className="car-card-improved"
              style={{
                width: `${100 / itemsPerView}%`
              }}
            >
              <Link to={item.link} className="car-card-link">
                <div className="car-card-image-container">
                  <img 
                    src={getImageUrl(item)} 
                    alt={item.title}
                    className="car-card-image"
                    loading="lazy"
                  />
                  <div className="car-card-overlay">
                    <span className="view-details">View Details</span>
                  </div>
                </div>
                <div className="car-card-content">
                  <h3 className="car-card-title">{item.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="carousel-pagination">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImprovedCarousel;