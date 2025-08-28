// src/App.tsx - WITH CATEGORIES
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import Hyperspeed from './components/HyperSpeed';
import Carousel from './components/Carousel';
import AnimatedFeatures from './components/AnimatedFeatures';
import CategoryFilter from './components/CategoryFilter';
import CarDetail from './pages/CarDetail';
import { Car } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { db, collection, getDocs, query, where, signOutAdmin } from './services/firebase';
import { Car as CarType, CarCategory } from './types/Car';

// Lazy load admin dashboard
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Default vehicles as fallback
const DEFAULT_VEHICLES = [
  {
    id: 'seal',
    title: "BYD Seal",
    description: "Premium electric sedan. 700km range. From $65,000",
    link: "/car/seal",
    icon: <Car className="h-4 w-4 text-white" />,
    category: 'ocean network' as CarCategory
  },
  {
    id: 'atto3',
    title: "BYD Atto 3",
    description: "Compact SUV. 420km range. From $48,000",
    link: "/car/atto3",
    icon: <Car className="h-4 w-4 text-white" />,
    category: 'dynasty network' as CarCategory
  },
  {
    id: 'tang',
    title: "BYD Tang",
    description: "7-seater SUV. 500km range. From $72,000",
    link: "/car/tang",
    icon: <Car className="h-4 w-4 text-white" />,
    category: 'dynasty network' as CarCategory
  },
  {
    id: 'dolphin',
    title: "BYD Dolphin",
    description: "City car. 405km range. From $35,000",
    link: "/car/dolphin",
    icon: <Car className="h-4 w-4 text-white" />,
    category: 'ocean network' as CarCategory
  },
  {
    id: 'han',
    title: "BYD Han",
    description: "Executive sedan. 605km range. From $78,000",
    link: "/car/han",
    icon: <Car className="h-4 w-4 text-white" />,
    category: 'dynasty network' as CarCategory
  },
];

const AppContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<any[]>(DEFAULT_VEHICLES);
  const [allVehicles, setAllVehicles] = useState<any[]>(DEFAULT_VEHICLES);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
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
  
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Load cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      console.log('Attempting to fetch cars from Firestore...');
      
      try {
        // Check if Firebase is configured
        if (!db) {
          console.warn('Firebase not configured. Using default vehicles.');
          setLoading(false);
          return;
        }

        // Get all active cars
        const allCarsQuery = query(
          collection(db, 'cars'),
          where('isActive', '==', true)
        );
        
        const snapshot = await getDocs(allCarsQuery);
        console.log(`Found ${snapshot.size} total cars in Firestore`);
        
        if (snapshot.empty) {
          console.log('No cars in Firestore, using defaults');
          setAllVehicles(DEFAULT_VEHICLES);
        } else {
          const carsData = snapshot.docs.map(doc => {
            const data = doc.data() as CarType;
            return {
              id: doc.id,
              title: data.name || 'Unnamed Car',
              description: `${data.type || 'Electric Vehicle'}. ${data.range || 'N/A'} range. From ${data.price || 'Contact Us'}`,
              link: `/car/${doc.id}`,
              icon: <Car className="h-4 w-4 text-white" />,
              category: data.category || 'ocean network' as CarCategory
            };
          });
          
          console.log('Cars loaded from Firestore:', carsData);
          setAllVehicles(carsData);
          setFirebaseConnected(true);
        }
        
        // Calculate category counts
        const counts: Record<CarCategory | 'all', number> = {
          'all': 0,
          'ocean network': 0,
          'dynasty network': 0,
          'denza': 0,
          'leopard': 0
        };
        
        snapshot.forEach(doc => {
          const data = doc.data() as CarType;
          counts['all']++;
          if (data.category) {
            counts[data.category]++;
          }
        });
        
        setCategoryCounts(counts);
      } catch (error: any) {
        console.error('Error fetching cars:', error);
        
        // Check if it's a configuration error
        if (error.code === 'failed-precondition' || error.code === 'permission-denied') {
          console.log('Firestore not properly configured or permission denied. Using defaults.');
        } else if (error.message?.includes('projectId')) {
          console.log('Firebase config missing. Check your .env.local file.');
        }
        
        // Keep default vehicles on error
        setAllVehicles(DEFAULT_VEHICLES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

  // Filter vehicles based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setVehicles(allVehicles);
    } else {
      const filtered = allVehicles.filter(v => v.category === selectedCategory);
      setVehicles(filtered);
    }
  }, [selectedCategory, allVehicles]);

  const handleCategoryChange = (category: CarCategory | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          {/* Navigation */}
          <nav className="nav-header">
            <div className="nav-content">
                  <div className="logo">
                      <img 
                        src="/logo.jpg" 
                        alt="Neval Mobility - Next Electric Vehicle Alternative" 
                        className="logo-img"
                        loading="eager"
                      />
                    </div>
              <ul className="nav-links">
                <li><a href="#vehicles" onClick={(e) => { e.preventDefault(); scrollToSection('vehicles'); }}>Vehicles</a></li>
                <li><a href="#technology" onClick={(e) => { e.preventDefault(); scrollToSection('technology'); }}>Technology</a></li>
                <li><a href="#charging" onClick={(e) => { e.preventDefault(); scrollToSection('charging'); }}>Charging</a></li>
                <li><a href="#sustainability" onClick={(e) => { e.preventDefault(); scrollToSection('sustainability'); }}>Sustainability</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
              </ul>
              <button className="nav-cta">Request Pricing</button>
            </div>
          </nav>

          {/* Firebase Status Indicator (Dev Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              position: 'fixed',
              top: 80,
              right: 20,
              padding: '8px 16px',
              background: firebaseConnected ? '#4caf50' : '#ff9800',
              color: 'white',
              fontSize: '12px',
              borderRadius: '4px',
              zIndex: 1000,
            }}>
              {firebaseConnected ? '✓ Firebase Connected' : '⚠ Using Default Data'}
            </div>
          )}

          {/* Hero Section with Hyperspeed */}
          <section className="hero-section">
            <div className="hero-background">
              <Hyperspeed
                effectOptions={{
                  distortion: 'turbulentDistortion',
                  length: 400,
                  roadWidth: 10,
                  islandWidth: 2,
                  lanesPerRoad: 3,
                  fov: 90,
                  fovSpeedUp: 150,
                  speedUp: 2,
                  colors: {
                    roadColor: 0x056006,
                    islandColor: 0x0a0a0a,
                    background: 0x000000,
                    shoulderLines: 0x6ec184,
                    brokenLines: 0x6ec184,
                    leftCars: [0x056006, 0x6ec184, 0x74b086],
                    rightCars: [0xe9f1ea, 0xffffff, 0xf0f0f0],
                    sticks: 0x6ec184,
                  }
                }}
              />
            </div>
            <div className="hero-content">
              <div className="hero-inner">
                <h1 className="hero-title">Neval<br/>Mobility</h1>
                <p className="hero-subtitle">Next Electric Vehicle Alternative</p>
                <div className="hero-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => scrollToSection('vehicles')}
                  >
                    Explore Fleet
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => scrollToSection('quotation')}
                  >
                    Request Pricing
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Carousel Section with Categories */}
          <section id="vehicles" className="vehicle-section">
            <div className="section-header">
              <h2 className="section-title">Our Fleet</h2>
              <p className="section-subtitle">
                {vehicles.length > 0 
                  ? `${vehicles.length} ${selectedCategory === 'all' ? 'models' : selectedCategory}. Zero emissions.` 
                  : selectedCategory !== 'all' 
                    ? 'No vehicles in this category' 
                    : 'Loading vehicles...'}
              </p>
            </div>
            
            {/* Category Filter */}
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              counts={categoryCounts}
            />
            
            {/* Only render Carousel if we have vehicles */}
            {vehicles && vehicles.length > 0 ? (
              <div className="carousel-wrapper">
                <Carousel
                  items={vehicles}
                  baseWidth={window.innerWidth * 0.8}
                  autoplay={false}
                  autoplayDelay={4000}
                  pauseOnHover={true}
                  loop={true}
                  round={false}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                {loading ? 'Loading vehicles...' : 
                 selectedCategory !== 'all' ? 
                 'No vehicles available in this category.' : 
                 'No vehicles available at this time.'}
              </div>
            )}
          </section>

          {/* Technology & Features with Animated Cards */}
          <AnimatedFeatures />

          {/* Footer with Hidden Admin Access */}
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-grid">
                <div className="footer-column">
                  <h4>Vehicles</h4>
                  <ul>
                    {allVehicles.map(vehicle => (
                      <li key={vehicle.id}>
                        <Link to={vehicle.link}>{vehicle.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Technology</h4>
                  <ul>
                    <li><a href="#technology">Blade Battery</a></li>
                    <li><a href="#technology">Intelligent Driving</a></li>
                    <li><a href="#technology">Safety Features</a></li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Support</h4>
                  <ul>
                    <li><a href="#contact">Contact Us</a></li>
                    <li><a href="#quotation">Request Pricing</a></li>
                    <li><a href="#locations">Locations</a></li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Company</h4>
                  <ul>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#news">News</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Hidden Admin Section */}
              <div className="footer-bottom">
                <div className="footer-copyright">
                  <p>&copy; 2025 Neval Mobility. All rights reserved.</p>
                </div>
                <div className="admin-trigger">
                  {isAdmin ? (
                    <div className="admin-controls">
                      <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="admin-link"
                      >
                        Admin Dashboard
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="admin-link"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAdminLogin(true)}
                      className="admin-link-hidden"
                      aria-label="Admin Access"
                    >
                      •
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Admin Login Modal */}
            {showAdminLogin && (
              <AdminLogin onClose={() => setShowAdminLogin(false)} />
            )}
          </footer>
        </div>
      } />
      
      {/* Car Detail Route */}
      <Route path="/car/:carId" element={<CarDetail />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <Suspense fallback={<div className="loading">Loading admin dashboard...</div>}>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />
    </Routes>
  );
};

// Main App Component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;