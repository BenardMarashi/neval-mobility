// src/pages/CarDetail.tsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../services/firebase';
import { Car, CATEGORY_LABELS, normalizeCarImages } from '../types/Car';
import BookQuotation from '../components/BookQuotation';
import './CarDetail.css';

const CarDetail: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setLoading(false);
        return;
      }

      try {
        const carDoc = await getDoc(doc(db, 'cars', carId));
        if (carDoc.exists()) {
          setCar({ id: carDoc.id, ...carDoc.data() } as Car);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (!car) {
    return (
      <div className="car-detail-error">
        <h2>Car not found</h2>
        <Link to="/">Back to fleet</Link>
      </div>
    );
  }

  // Normalize images to handle both string and CarImage types
  const images = car.images ? normalizeCarImages(car.images) : [];
  const currentImage = images[selectedImageIndex]?.url || '/placeholder-car.jpg';

  return (
    <div className="car-detail-page">
      <nav className="detail-nav">
        <Link to="/" className="back-link">← Back to Fleet</Link>
      </nav>

      {/* Hero Section with Name and Description */}
      <section className="car-hero-section">
        <div className="car-header">
          <div className="car-info">
            <h1 className="car-name">{car.name}</h1>
            {car.category && (
              <span className="category-badge">
                {CATEGORY_LABELS[car.category]}
              </span>
            )}
            <p className="car-description">{car.description}</p>
            <div className="car-meta">
              <span className="car-type">{car.type}</span>
              <span className="car-price">Starting from {car.price}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={currentImage} 
              alt={`${car.name} - View ${selectedImageIndex + 1}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
              }}
            />
          </div>
          
          {images.length > 1 && (
            <div className="thumbnail-strip">
              <div className="thumbnails-container">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={img.url} 
                      alt={`${car.name} thumbnail ${index + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-car.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Specifications Grid */}
      <section className="car-specs">
        <h2>Specifications</h2>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Range</span>
            <span className="spec-value">{car.range}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">0-100 km/h</span>
            <span className="spec-value">{car.acceleration}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Top Speed</span>
            <span className="spec-value">{car.topSpeed}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Battery</span>
            <span className="spec-value">{car.battery}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Fast Charging</span>
            <span className="spec-value">{car.charging}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Seats</span>
            <span className="spec-value">{car.seats}</span>
          </div>
        </div>
      </section>

      {/* Features List */}
      {car.features && car.features.length > 0 && (
        <section className="car-features">
          <h2>Key Features</h2>
          <ul className="features-list">
            {car.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Book Quotation Form */}
      <BookQuotation carId={car.id || ''} carName={car.name} />
    </div>
  );
};

export default CarDetail;