// src/pages/admin/CarManager.tsx - COMPLETE UPDATED FILE
import React, { useState } from 'react';
import { db, addDoc, collection, updateDoc, doc, serverTimestamp } from '../../services/firebase';
import { Car, CarCategory, CAR_CATEGORIES, CATEGORY_LABELS } from '../../types/Car';
import { useLanguage } from '../../contexts/LanguageContext';
import './CarManager.css';

interface CarManagerProps {
  cars: Car[];
  onDelete: (carId: string) => void;
  onToggleActive: (car: Car) => void;
}

const CarManager: React.FC<CarManagerProps> = ({ cars, onDelete, onToggleActive }) => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    type: '',
    category: 'ocean network' as CarCategory,
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
    isActive: true,
    published: true
  });
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      category: 'ocean network' as CarCategory,
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
      isActive: true,
      published: true
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
        <h2>{t('Manage Cars')}</h2>
        <button 
          className="btn-add"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          + {t('Add New Car')}
        </button>
      </div>

      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className={`car-card ${!car.isActive ? 'inactive' : ''}`}>
            <div className="car-card-header">
              <h3>{car.name}</h3>
              <span className={`status-badge ${car.isActive ? 'active' : 'inactive'}`}>
                {car.isActive ? t('Active') : t('Inactive')}
              </span>
            </div>
            
            <div className="car-card-details">
              <p><strong>{t('Category')}:</strong> {car.category ? CATEGORY_LABELS[car.category] : t('Uncategorized')}</p>
              <p><strong>{t('Type')}:</strong> {car.type}</p>
              <p><strong>{t('Price')}:</strong> {car.price}</p>
              <p><strong>{t('Range')}:</strong> {car.range}</p>
              <p><strong>{t('Seats')}:</strong> {car.seats}</p>
            </div>
            
            <div className="car-card-actions">
              <button onClick={() => handleEdit(car)} className="btn-edit">
                {t('Edit')}
              </button>
              <button 
                onClick={() => onToggleActive(car)} 
                className="btn-toggle"
              >
                {car.isActive ? t('Deactivate') : t('Activate')}
              </button>
              <button 
                onClick={() => car.id && onDelete(car.id)} 
                className="btn-delete"
              >
                {t('Delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCar ? t('Edit Car') : t('Add New Car')}</h2>
            
            <form onSubmit={handleSubmit} className="car-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('Name')}*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('Category')}*</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CarCategory })}
                    required
                  >
                    {CAR_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>{t('Type')}*</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder={t('e.g., Premium Electric Sedan')}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{t('Published')}</label>
                  <select
                    value={formData.published ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value === 'true' })}
                  >
                    <option value="true">{t('Published')}</option>
                    <option value="false">{t('Draft')}</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>{t('Description')}*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>{t('Editions')}</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder={t('Add a feature')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button type="button" onClick={handleAddFeature}>{t('Add')}</button>
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
                <label>{t('Image URLs')}</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder={t('Add image URL')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button type="button" onClick={handleAddImage}>{t('Add')}</button>
                </div>
                <div className="image-list">
                {formData.images?.map((image, index) => (
                    <div key={index} className="image-item">
                    <span>{image}</span>
                    <button type="button" onClick={() => handleRemoveImage(index)}>{t('Remove')}</button>
                    </div>
                ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  {t('Cancel')}
                </button>
                <button type="submit" className="btn-primary">
                  {editingCar ? t('Update Car') : t('Add Car')}
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