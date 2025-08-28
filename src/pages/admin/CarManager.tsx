// src/pages/admin/CarManager.tsx
import React, { useState } from 'react';
import { db, addDoc, collection, updateDoc, doc, serverTimestamp } from '../../services/firebase';
import { Car } from '../../types/Car';
import './CarManager.css';

interface CarManagerProps {
  cars: Car[];
  onDelete: (carId: string) => void;
  onToggleActive: (car: Car) => void;
}

const CarManager: React.FC<CarManagerProps> = ({ cars, onDelete, onToggleActive }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    type: '',
    price: '',
    range: '',
    acceleration: '',
    topSpeed: '',
    battery: '',
    charging: '',
    seats: 5,
    description: '',
    features: [],
    images: [],
    isActive: true
  });
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      price: '',
      range: '',
      acceleration: '',
      topSpeed: '',
      battery: '',
      charging: '',
      seats: 5,
      description: '',
      features: [],
      images: [],
      isActive: true
    });
    setFeatureInput('');
    setImageInput('');
    setEditingCar(null);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData(car);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCar && editingCar.id) {
        // Update existing car
        await updateDoc(doc(db, 'cars', editingCar.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new car
        await addDoc(collection(db, 'cars'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Failed to save car');
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index)
    });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageInput.trim()]
      });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="car-manager">
      <div className="manager-header">
        <h2>Manage Cars</h2>
        <button 
          className="btn-add"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          + Add New Car
        </button>
      </div>

      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className={`car-card ${!car.isActive ? 'inactive' : ''}`}>
            <div className="car-card-header">
              <h3>{car.name}</h3>
              <span className={`status-badge ${car.isActive ? 'active' : 'inactive'}`}>
                {car.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="car-card-details">
              <p><strong>Type:</strong> {car.type}</p>
              <p><strong>Price:</strong> {car.price}</p>
              <p><strong>Range:</strong> {car.range}</p>
              <p><strong>Seats:</strong> {car.seats}</p>
            </div>
            
            <div className="car-card-actions">
              <button onClick={() => handleEdit(car)} className="btn-edit">
                Edit
              </button>
              <button 
                onClick={() => onToggleActive(car)} 
                className="btn-toggle"
              >
                {car.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => car.id && onDelete(car.id)} 
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
            
            <form onSubmit={handleSubmit} className="car-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Type*</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Premium Electric Sedan"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Price*</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $65,000"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Range*</label>
                  <input
                    type="text"
                    value={formData.range}
                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                    placeholder="e.g., 700km"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>0-100 km/h*</label>
                  <input
                    type="text"
                    value={formData.acceleration}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                    placeholder="e.g., 3.8s"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Top Speed*</label>
                  <input
                    type="text"
                    value={formData.topSpeed}
                    onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                    placeholder="e.g., 180 km/h"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Battery*</label>
                  <input
                    type="text"
                    value={formData.battery}
                    onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                    placeholder="e.g., 82.5 kWh"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Charging*</label>
                  <input
                    type="text"
                    value={formData.charging}
                    onChange={(e) => setFormData({ ...formData, charging: e.target.value })}
                    placeholder="e.g., 10-80% in 26 min"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Seats*</label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    min="2"
                    max="9"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Features</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button type="button" onClick={handleAddFeature}>Add</button>
                </div>
                <div className="tags">
                  {formData.features?.map((feature, index) => (
                    <span key={index} className="tag">
                      {feature}
                      <button type="button" onClick={() => handleRemoveFeature(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Image URLs</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Add image URL"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button type="button" onClick={handleAddImage}>Add</button>
                </div>
                <div className="image-list">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="image-item">
                      <span>{image}</span>
                      <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCar ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManager;