// src/App.tsx - FIXED VERSION
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Hyperspeed from './components/HyperSpeed';
import Carousel from './components/Carousel';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import CarDetail from './pages/CarDetail';
import { Car, Zap, Battery, Gauge } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { db, collection, getDocs, query, where, signOutAdmin } from './services/firebase';
import { Car as CarType } from './types/Car';

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
  },
  {
    id: 'atto3',
    title: "BYD Atto 3",
    description: "Compact SUV. 420km range. From $48,000",
    link: "/car/atto3",
    icon: <Car className="h-4 w-4 text-white" />,
  },
  {
    id: 'tang',
    title: "BYD Tang",
    description: "7-seater SUV. 500km range. From $72,000",
    link: "/car/tang",
    icon: <Car className="h-4 w-4 text-white" />,
  },
  {
    id: 'dolphin',
    title: "BYD Dolphin",
    description: "City car. 405km range. From $35,000",
    link: "/car/dolphin",
    icon: <Car className="h-4 w-4 text-white" />,
  },
  {
    id: 'han',
    title: "BYD Han",
    description: "Executive sedan. 605km range. From $78,000",
    link: "/car/han",
    icon: <Car className="h-4 w-4 text-white" />,
  },
];

const AppContent: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>(DEFAULT_VEHICLES); // Start with defaults
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
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

        const carsQuery = query(
          collection(db, 'cars'),
          where('isActive', '==', true)
        );
        
        const snapshot = await getDocs(carsQuery);
        console.log(`Found ${snapshot.size} cars in Firestore`);
        
        if (snapshot.empty) {
          console.log('No cars in Firestore, using defaults');
          setVehicles(DEFAULT_VEHICLES);
        } else {
          const carsData = snapshot.docs.map(doc => {
            const data = doc.data() as CarType;
            return {
              id: doc.id,
              title: data.name || 'Unnamed Car',
              description: `${data.type || 'Electric Vehicle'}. ${data.range || 'N/A'} range. From ${data.price || 'Contact Us'}`,
              link: `/car/${doc.id}`,
              icon: <Car className="h-4 w-4 text-white" />
            };
          });
          
          console.log('Cars loaded from Firestore:', carsData);
          setVehicles(carsData);
          setFirebaseConnected(true);
        }
      } catch (error: any) {
        console.error('Error fetching cars:', error);
        
        // Check if it's a configuration error
        if (error.code === 'failed-precondition' || error.code === 'permission-denied') {
          console.log('Firestore not properly configured or permission denied. Using defaults.');
        } else if (error.message?.includes('projectId')) {
          console.log('Firebase config missing. Check your .env.local file.');
        }
        
        // Keep default vehicles on error
        setVehicles(DEFAULT_VEHICLES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);

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
              <div className="logo">NEVAL MOBILITY</div>
              <ul className="nav-links">
                <li><a href="#vehicles" onClick={(e) => { e.preventDefault(); scrollToSection('vehicles'); }}>Vehicles</a></li>
                <li><a href="#technology" onClick={(e) => { e.preventDefault(); scrollToSection('technology'); }}>Technology</a></li>
                <li><a href="#charging" onClick={(e) => { e.preventDefault(); scrollToSection('charging'); }}>Charging</a></li>
                <li><a href="#sustainability" onClick={(e) => { e.preventDefault(); scrollToSection('sustainability'); }}>Sustainability</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
              </ul>
              <button className="nav-cta">Book Quotation</button>
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
                <p className="hero-subtitle">Pure Electric Performance</p>
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
                    Get Quotation
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Carousel Section */}
          <section id="vehicles" className="vehicle-section">
            <div className="section-header">
              <h2 className="section-title">Our Fleet</h2>
              <p className="section-subtitle">
                {vehicles.length > 0 
                  ? `${vehicles.length} models. Zero emissions.` 
                  : 'Loading vehicles...'}
              </p>
            </div>
            
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
                {loading ? 'Loading vehicles...' : 'No vehicles available at this time.'}
              </div>
            )}
          </section>

          {/* Technology & Features with ScrollStack */}
          <section id="technology" className="features-section">
            <ScrollStack className="stack-wrapper">
              <ScrollStackItem itemClassName="stack-card-custom">
                <div className="stack-content">
                  <div className="stack-text">
                    <h3 className="stack-title">Blade Battery Technology</h3>
                    <p className="stack-description">
                      Revolutionary LFP battery technology delivering unmatched safety, 
                      longevity, and performance. Over 1 million kilometers lifespan.
                    </p>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-value">1M+</div>
                        <div className="stat-label">km lifespan</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">800V</div>
                        <div className="stat-label">architecture</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">18min</div>
                        <div className="stat-label">10-80% charge</div>
                      </div>
                    </div>
                  </div>
                  <div className="stack-visual">
                    <Battery size={120} color="#6ec184" />
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="stack-card-custom">
                <div className="stack-content reverse">
                  <div className="stack-visual">
                    <Gauge size={120} color="#6ec184" />
                  </div>
                  <div className="stack-text">
                    <h3 className="stack-title">Intelligent Driving</h3>
                    <p className="stack-description">
                      Advanced ADAS with 33 sensors providing 360° perception. 
                      Highway pilot and intelligent parking assistance.
                    </p>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-value">33</div>
                        <div className="stat-label">Sensors</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">360°</div>
                        <div className="stat-label">Coverage</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">L2+</div>
                        <div className="stat-label">Autonomy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="stack-card-custom">
                <div className="stack-content">
                  <div className="stack-text">
                    <h3 className="stack-title">Charging Network</h3>
                    <p className="stack-description">
                      Access to over 15,000 charging points across the country. 
                      Fast, reliable, and powered by renewable energy.
                    </p>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-value">15K+</div>
                        <div className="stat-label">Charging Points</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">350kW</div>
                        <div className="stat-label">Max Power</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">24/7</div>
                        <div className="stat-label">Availability</div>
                      </div>
                    </div>
                  </div>
                  <div className="stack-visual">
                    <Zap size={120} color="#6ec184" />
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="stack-card-sustainability">
                <div className="sustainability-content">
                  <h3 className="sustainability-title">Every Kilometer Matters</h3>
                  <div className="stats-grid-large">
                    <div className="stat-item">
                      <div className="stat-value-large">0</div>
                      <div className="stat-label-light">Direct Emissions</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value-large">96%</div>
                      <div className="stat-label-light">Recyclable</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value-large">-50%</div>
                      <div className="stat-label-light">Carbon vs ICE</div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </section>

          {/* Footer with Hidden Admin Access */}
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-grid">
                <div className="footer-column">
                  <h4>Vehicles</h4>
                  <ul>
                    {vehicles.map(vehicle => (
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
                    <li><a href="#quotation">Book Quotation</a></li>
                    <li><a href="#locations">Locations</a></li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Company</h4>
                  <ul>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#news">News</a></li>
                    <li><a href="#careers">Careers</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Hidden Admin Section */}
              <div className="footer-bottom">
                <div className="footer-copyright">
                  <p>&copy; 2024 Neval Mobility. All rights reserved.</p>
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