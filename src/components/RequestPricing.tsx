// src/components/RequestPricing.tsx
import React, { useState } from 'react';
import { db, addDoc, collection, serverTimestamp } from '../services/firebase';
import { PricingRequest } from '../types/PricingRequest';
import './RequestPricing.css';

interface RequestPricingProps {
  carId: string;
  carName: string;
}

const RequestPricing: React.FC<RequestPricingProps> = ({ carId, carName }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const pricingData: Omit<PricingRequest, 'id'> = {
        carId,
        carName,
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp() as any
      };
      
      await addDoc(collection(db, 'pricingRequests'), pricingData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        location: '',
        message: ''
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError('Failed to submit pricing request. Please try again.');
      console.error('Error submitting pricing request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="request-pricing-form">
      <h2>Request Pricing</h2>
      <p className="form-subtitle">Get personalized pricing for your {carName}</p>
      
      {success && (
        <div className="success-message">
          ✓ Your pricing request has been submitted successfully! We'll contact you within 24 hours.
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="customerName"
            placeholder="Your Name *"
            value={formData.customerName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Location *</option>
            <option value="vienna">Vienna</option>
            <option value="salzburg">Salzburg</option>
            <option value="graz">Graz</option>
            <option value="linz">Linz</option>
            <option value="innsbruck">Innsbruck</option>
          </select>
        </div>
        
        <div className="form-row">
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
            disabled={loading}
            min={new Date().toISOString().split('T')[0]}
          />
          <select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Preferred Contact Time *</option>
            <option value="morning">Morning (9AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 5PM)</option>
            <option value="evening">Evening (5PM - 8PM)</option>
          </select>
        </div>
        
        <textarea
          name="message"
          placeholder="Additional information or special requirements (optional)"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          disabled={loading}
        />
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : `Request Pricing for ${carName}`}
        </button>
      </form>
    </section>
  );
};

export default RequestPricing;