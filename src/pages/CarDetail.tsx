// Update src/pages/CarDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../services/firebase';
import { Car } from '../types/Car';
import BookQuotation from '../components/BookQuotation';
import './CarDetail.css';

const CarDetail: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="car-detail-page">
      <nav className="detail-nav">
        <Link to="/" className="back-link">← Back to Fleet</Link>
      </nav>

      <section className="car-hero">
        <div className="car-hero-content">
          <h1>{car.name}</h1>
          <p className="car-type">{car.type}</p>
          <p className="car-price">Starting from {car.price}</p>
        </div>
        <div className="car-hero-image">
          {car.images && car.images[0] && (
            <img src={car.images[0]} alt={car.name} />
          )}
        </div>
      </section>

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

      <section className="car-features">
        <h2>Key Features</h2>
        <ul className="features-list">
          {car.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>

      {/* Replace test drive form with BookQuotation */}
      <BookQuotation carId={car.id || ''} carName={car.name} />
    </div>
  );
};

export default CarDetail;