// src/pages/Fleet.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { db, collection, getDocs, query, where } from '../services/firebase';
import { Car as CarType, CarCategory } from '../types/Car';
import CategoryFilter from '../components/CategoryFilter';
import { useLanguage } from '../contexts/LanguageContext';
import './Fleet.css';

interface FleetCar {
  id: string;
  title: string;
  type: string;
  price: string;
  range: string;
  image: string;
  category: CarCategory;
  link: string;
}

const Fleet: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const [allCars, setAllCars] = useState<FleetCar[]>([]);
  const [filteredCars, setFilteredCars] = useState<FleetCar[]>([]);
  const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<CarCategory | 'all'>(
    (searchParams.get('category') as CarCategory | 'all') || 'all'
    );
    const [categoryCounts, setCategoryCounts] = useState<Record<CarCategory | 'all', number>>({
    'all': 0,
    'ocean network': 0,
    'dynasty network': 0,
    'denza': 0,
    'leopard': 0
    });
  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        if (!db) {
          console.warn('Firebase not configured');
          // Use default data if needed
          setLoading(false);
          return;
        }

        const carsQuery = query(
          collection(db, 'cars'),
          where('isActive', '==', true)
        );
        
        const snapshot = await getDocs(carsQuery);
        
        const carsData: FleetCar[] = [];
        const counts: Record<CarCategory | 'all', number> = {
        'all': 0,
        'ocean network': 0,
        'dynasty network': 0,
        'denza': 0,
        'leopard': 0
        };
        counts['all']++;
        snapshot.forEach(doc => {
          const data = doc.data() as CarType;
          
          carsData.push({
            id: doc.id,
            title: data.name || 'Unnamed Car',
            type: data.type || 'Electric Vehicle',
            price: data.price || 'Contact for pricing',
            range: data.range || 'N/A',
            image: data.images && data.images.length > 0 ? data.images[0] : '/placeholder-car.jpg',
            category: data.category || 'ocean network',
            link: `/car/${doc.id}`
          });
          
          if (data.category) {
            counts[data.category]++;
          }
        });
        
        setAllCars(carsData);
        setCategoryCounts(counts);
        
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  // Filter cars by category
    useEffect(() => {
    if (selectedCategory === 'all') {
        setFilteredCars(allCars);
    } else {
        const filtered = allCars.filter(car => car.category === selectedCategory);
        setFilteredCars(filtered);
    }
    }, [selectedCategory, allCars]);

    const handleCategoryChange = (category: CarCategory | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
        searchParams.delete('category');
    } else {
        searchParams.set('category', category);
    }
    setSearchParams(searchParams);
    };

  const handleRequestPricing = (carId: string) => {
    navigate(`/request-pricing?car=${carId}`);
  };

return (
    <div className="fleet-page">
      {/* Header */}
      <header className="fleet-header">
        <nav className="fleet-nav">
          <Link to="/" className="fleet-logo">
            <img src="/logo.jpg" alt="Neval" className="logo-img" />
          </Link>
          <ul className="fleet-nav-links">
            <li><Link to="/">{t('Home')}</Link></li>
            <li><Link to="/fleet" className="active">{t('Fleet')}</Link></li>
            <li><Link to="/technology/blade-battery">{t('Technology')}</Link></li>
            <li><Link to="#about">{t('About')}</Link></li>
          </ul>
          <button 
            className="fleet-nav-cta"
            onClick={() => navigate('/request-pricing')}
          >
            {t('REQUEST PRICING')}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="fleet-hero">
        <h1 className="fleet-title">{t('Our Fleet')}</h1>
        <p className="fleet-subtitle">
        {filteredCars.length} {selectedCategory === 'all' ? t('models') : t(selectedCategory)}. {t('Zero emissions')}.
        </p>
      </section>

      {/* Category Filter */}
      <section className="fleet-filter-section">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          counts={categoryCounts}
        />
      </section>

      {/* Cars Grid */}
      <section className="fleet-grid-section">
        <div className="fleet-container">
          {loading ? (
            <div className="fleet-loading">
              <div className="loading-spinner"></div>
              <p>{t('Loading vehicles...')}</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="fleet-grid">
              {filteredCars.map((car) => (
                <div key={car.id} className="fleet-car-card">
                  <Link to={car.link} className="fleet-car-link">
                    <div className="fleet-car-image-container">
                      <img 
                        src={car.image} 
                        alt={car.title}
                        className="fleet-car-image"
                        loading="lazy"
                      />
                      <div className="fleet-car-overlay">
                        <span className="view-details">{t('View Details')}</span>
                      </div>
                    </div>
                    <div className="fleet-car-content">
                      <h3 className="fleet-car-title">{car.title}</h3>
                      <div className="fleet-car-specs">
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="fleet-empty">
              <p>{t('No vehicles available in this category.')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="fleet-footer">
        <div className="fleet-footer-content">
          <p>&copy; 2025 Neval Mobility. {t('All rights reserved')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default Fleet;