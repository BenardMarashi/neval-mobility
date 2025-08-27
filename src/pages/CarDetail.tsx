// src/pages/CarDetail.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CarDetail.css';

interface CarData {
  id: string;
  name: string;
  type: string;
  price: string;
  range: string;
  acceleration: string;
  topSpeed: string;
  battery: string;
  charging: string;
  seats: number;
  description: string;
  features: string[];
  images: string[];
}

const carDatabase: Record<string, CarData> = {
  'seal': {
    id: 'seal',
    name: 'BYD Seal',
    type: 'Premium Electric Sedan',
    price: '$65,000',
    range: '700km',
    acceleration: '3.8s',
    topSpeed: '180 km/h',
    battery: '82.5 kWh',
    charging: '10-80% in 26 min',
    seats: 5,
    description: 'The BYD Seal represents the pinnacle of electric sedan engineering, combining luxury, performance, and efficiency.',
    features: [
      'Blade Battery Technology',
      'Heat Pump System',
      'Advanced Driver Assistance',
      'Panoramic Sunroof',
      'Premium Audio System',
      'Wireless Phone Charging'
    ],
    images: ['/images/seal-1.jpg', '/images/seal-2.jpg', '/images/seal-3.jpg']
  },
  'atto3': {
    id: 'atto3',
    name: 'BYD Atto 3',
    type: 'Compact SUV',
    price: '$48,000',
    range: '420km',
    acceleration: '7.3s',
    topSpeed: '160 km/h',
    battery: '60.5 kWh',
    charging: '10-80% in 29 min',
    seats: 5,
    description: 'The perfect urban companion, combining SUV versatility with electric efficiency.',
    features: [
      'Rotating Touchscreen',
      '360° Camera System',
      'Electric Tailgate',
      'Ambient Lighting',
      'ADAS Level 2',
      'V2L Capability'
    ],
    images: ['/images/atto3-1.jpg', '/images/atto3-2.jpg', '/images/atto3-3.jpg']
  },
  'tang': {
    id: 'tang',
    name: 'BYD Tang',
    type: '7-Seater SUV',
    price: '$72,000',
    range: '500km',
    acceleration: '4.6s',
    topSpeed: '180 km/h',
    battery: '86.4 kWh',
    charging: '10-80% in 30 min',
    seats: 7,
    description: 'Spacious family SUV with commanding presence and cutting-edge technology.',
    features: [
      '7 Seats Configuration',
      'All-Wheel Drive',
      'Air Suspension',
      'Matrix LED Headlights',
      'Heads-Up Display',
      'Massage Seats'
    ],
    images: ['/images/tang-1.jpg', '/images/tang-2.jpg', '/images/tang-3.jpg']
  },
  'dolphin': {
    id: 'dolphin',
    name: 'BYD Dolphin',
    type: 'City Car',
    price: '$35,000',
    range: '405km',
    acceleration: '7.5s',
    topSpeed: '150 km/h',
    battery: '44.9 kWh',
    charging: '10-80% in 30 min',
    seats: 5,
    description: 'Agile city car perfect for urban mobility with playful character.',
    features: [
      'Compact Design',
      'Tight Turning Circle',
      'Smart Connectivity',
      'Parking Sensors',
      'Keyless Entry',
      'Climate Control'
    ],
    images: ['/images/dolphin-1.jpg', '/images/dolphin-2.jpg', '/images/dolphin-3.jpg']
  },
  'han': {
    id: 'han',
    name: 'BYD Han',
    type: 'Executive Sedan',
    price: '$78,000',
    range: '605km',
    acceleration: '3.9s',
    topSpeed: '185 km/h',
    battery: '85.4 kWh',
    charging: '10-80% in 25 min',
    seats: 5,
    description: 'Executive sedan offering unparalleled luxury and performance.',
    features: [
      'Premium Leather Interior',
      'Adaptive Air Suspension',
      'Premium Sound System',
      'Ventilated Seats',
      'Night Vision',
      'Autonomous Parking'
    ],
    images: ['/images/han-1.jpg', '/images/han-2.jpg', '/images/han-3.jpg']
  }
};

const CarDetail: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const car = carDatabase[carId || ''];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    message: ''
  });

  if (!car) {
    return (
      <div className="car-detail-error">
        <h2>Car not found</h2>
        <Link to="/vehicles">Back to vehicles</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Test drive request:', formData);
    alert('Test drive request submitted! We will contact you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          <img src={car.images[0]} alt={car.name} />
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
          {car.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="test-drive-form">
        <h2>Book a Test Drive</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              <option value="vienna">Vienna</option>
              <option value="salzburg">Salzburg</option>
              <option value="graz">Graz</option>
            </select>
          </div>
          <div className="form-row">
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="Additional message (optional)"
            value={formData.message}
            onChange={handleChange}
            rows={4}
          />
          <button type="submit" className="submit-btn">
            Book Test Drive for {car.name}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CarDetail;