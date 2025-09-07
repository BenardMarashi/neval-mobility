// src/App.tsx - WITH ADMIN LOGIN FIXED
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import './App.css';
// HYPERSPEED LOADS FIRST - NOT LAZY LOADED
import Hyperspeed from './components/HyperSpeed';
import { Car } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'; // ADD THIS IMPORT
import { db, collection, getDocs, query, where, signOutAdmin } from './services/firebase';
import { Car as CarType, CarCategory, CATEGORY_LABELS } from './types/Car';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import CategoryFilter from './components/CategoryFilter';
import './components/CategoryFilter.css';
// Lazy load all non-critical components
const Carousel = lazy(() => import('./components/Carousel'));
const AnimatedFeatures = lazy(() => import('./components/AnimatedFeatures'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const BladeBattery = lazy(() => import('./pages/technology/BladeBattery'));
const EPlatform = lazy(() => import('./pages/technology/EPlatform'));
const EnergyManagement = lazy(() => import('./pages/technology/EnergyManagement'));
const RequestPricingPage = lazy(() => import('./pages/RequestPricingPage'));
const Fleet = lazy(() => import('./pages/Fleet'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Loading component for Suspense fallback - WRAPPED FOR TRANSLATION
const LoadingSpinnerComponent: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  const { t } = useLanguage();
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      color: '#666',
      fontSize: '14px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #6ec184',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 10px'
        }}></div>
        {t(message)}
      </div>
    </div>
  );
};

// Wrapper for LoadingSpinner that handles translation context
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <LanguageProvider>
      <LoadingSpinnerComponent message={message} />
    </LanguageProvider>
  );
};

// Add CSS for spinner animation
const spinnerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject spinner styles
if (typeof document !== 'undefined' && !document.getElementById('spinner-styles')) {
  const style = document.createElement('style');
  style.id = 'spinner-styles';
  style.innerHTML = spinnerStyles;
  document.head.appendChild(style);
}

// Admin Route Handler Component - handles /admin path
const AdminRouteHandler: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      // If already logged in, redirect to dashboard
      navigate('/admin/dashboard');
    } else {
      // Show login modal
      setShowLogin(true);
    }
  }, [isAdmin, navigate]);

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {showLogin && (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminLogin 
            onClose={() => {
              setShowLogin(false);
              navigate('/');
            }} 
          />
        </Suspense>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage(); // ADD THIS
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | 'all'>(
    (searchParams.get('category') as CarCategory | 'all') || 'ocean network'
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

  // Default vehicles with translation
  const DEFAULT_VEHICLES = [
    {
      id: 'seal',
      title: "BYD Seal",
      description: t('Premium electric sedan') + '. 700km ' + t('range') + '. ' + t('From') + ' $65,000',
      link: "/car/seal",
      icon: <Car className="h-4 w-4 text-white" />,
      category: 'ocean network' as CarCategory
    },
    {
      id: 'atto3',
      title: "BYD Atto 3",
      description: t('Compact SUV') + '. 420km ' + t('range') + '. ' + t('From') + ' $48,000',
      link: "/car/atto3",
      icon: <Car className="h-4 w-4 text-white" />,
      category: 'dynasty network' as CarCategory
    },
    {
      id: 'tang',
      title: "BYD Tang",
      description: t('7-seater SUV') + '. 500km ' + t('range') + '. ' + t('From') + ' $72,000',
      link: "/car/tang",
      icon: <Car className="h-4 w-4 text-white" />,
      category: 'dynasty network' as CarCategory
    },
    {
      id: 'dolphin',
      title: "BYD Dolphin",
      description: t('City car') + '. 405km ' + t('range') + '. ' + t('From') + ' $35,000',
      link: "/car/dolphin",
      icon: <Car className="h-4 w-4 text-white" />,
      category: 'ocean network' as CarCategory
    },
    {
      id: 'han',
      title: "BYD Han",
      description: t('Executive sedan') + '. 605km ' + t('range') + '. ' + t('From') + ' $78,000',
      link: "/car/han",
      icon: <Car className="h-4 w-4 text-white" />,
      category: 'dynasty network' as CarCategory
    },
  ];

  const [vehicles, setVehicles] = useState<any[]>(DEFAULT_VEHICLES);
  const [allVehicles, setAllVehicles] = useState<any[]>(DEFAULT_VEHICLES);

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
              type: data.type || 'Electric Vehicle',
              price: data.price || 'Contact for pricing',
              image: data.images && data.images.length > 0 ? data.images[0] : '/placeholder-car.jpg',
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
      {/* Admin Route - handles /admin path */}
      <Route path="/admin" element={<AdminRouteHandler />} />
      
      {/* Main Home Route */}
      <Route path="/" element={
        <div className="app">
          {/* Navigation */}
          <nav className="nav-header">
            <div className="nav-content">
              <div className="logo">
                <img 
                  src="/logo.jpg" 
                  className="logo-img"
                  loading="eager"
                />
              </div>
              <ul className="nav-links">
                <li><a href="#fleet" onClick={(e) => { e.preventDefault(); scrollToSection('vehicles'); }}>{t('Fleet')}</a></li>
                <li><a href="#technology" onClick={(e) => { e.preventDefault(); scrollToSection('technology'); }}>{t('Technology')}</a></li>
                <li><Link to="/about">{t('About')}</Link></li>
              </ul>
              <button className="nav-cta" onClick={() => navigate('/request-pricing')}>{t('Request Pricing')}</button>
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

          {/* Hero Section with Hyperspeed - RENDERS IMMEDIATELY */}
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
                <h1 className="hero-title">Neval<br/>{t('Mobility')}</h1>
                <p className="hero-subtitle">{t('Next Electric Vehicle Alternative')}</p>
                <div className="hero-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/fleet')}
                  >
                    {t('Explore Fleet')}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Carousel Section with Categories - LAZY LOADED */}
          <section id="vehicles" className="vehicle-section">
            <div className="section-header">
              <h2 className="section-title">{t('Our Fleet')}</h2>
              <p className="section-subtitle">
                {vehicles.length > 0 
                  ? `${vehicles.length} ${selectedCategory === 'all' ? t('models') : selectedCategory}. ${t('Zero emissions')}.` 
                  : selectedCategory !== 'all' 
                    ? t('No vehicles in this category') 
                    : t('Loading vehicles...')}
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="category-filter">
              <div className="category-pills">
                {(['ocean network', 'dynasty network', 'denza', 'leopard'] as CarCategory[]).map(category => (
                  <button
                    key={category}
                    className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <span className="pill-label">{CATEGORY_LABELS[category]}</span>
                    <span className="pill-count">{categoryCounts[category] || 0}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Carousel with Suspense boundary */}
            {vehicles && vehicles.length > 0 ? (
              <Suspense fallback={<LoadingSpinner message="Loading vehicles..." />}>
                <Carousel
                  items={vehicles}
                  onRequestPricing={(carId) => {
                    navigate(`/request-pricing?car=${carId}`);
                  }}
                />
              </Suspense>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                {loading ? t('Loading vehicles...') : 
                selectedCategory !== 'all' ? 
                t('No vehicles available in this category.') : 
                t('No vehicles available at this time.')}
              </div>
            )}
          </section>

          {/* Technology & Features with Animated Cards - LAZY LOADED */}
          <Suspense fallback={<LoadingSpinner message="Loading features..." />}>
            <AnimatedFeatures />
          </Suspense>

          {/* FOOTER WITH FIXED ADMIN ACCESS */}
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-main">
                <div className="footer-grid">
                  <div className="footer-column">
                    <h4>{t('Fleet')}</h4>
                    <ul>
                      <li><Link to="/fleet">{t('All Models')}</Link></li>
                      <li><Link to="/fleet?category=ocean%20network">Ocean Network</Link></li>
                      <li><Link to="/fleet?category=dynasty%20network">Dynasty Network</Link></li>
                      <li><Link to="/fleet?category=denza">Denza</Link></li>
                      <li><Link to="/fleet?category=leopard">Leopard</Link></li>
                    </ul>
                  </div>
                  <div className="footer-column">
                    <h4>{t('Technology')}</h4>
                    <ul>
                      <li><Link to="/technology/blade-battery">{t('Blade Battery')}</Link></li>
                      <li><Link to="/technology/e-platform">e-Platform 3.0</Link></li>
                      <li><Link to="/technology/energy-management">{t('Energy Management')}</Link></li>
                    </ul>
                  </div>
                  <div className="footer-column">
                    <h4>{t('Support')}</h4>
                    <ul>
                      <li><Link to="/contact">{t('Contact Us')}</Link></li>
                      <li><Link to="/request-pricing">{t('Request Pricing')}</Link></li>
                      <li><Link to="/about">{t('About')}</Link></li>
                    </ul>
                    
                    {/* Social Media Section */}
                    <div className="footer-socials">
                      <h4>{t('Socials')}</h4>
                      <div className="social-icons">
                        <a
                          href="https://www.instagram.com/nevalmobility"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label="Instagram"
                        >
                          <Instagram size={20} color="white" />
                        </a>
                        <a
                          href="https://www.facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label="Facebook"
                        >
                          <Facebook size={20} color="white" />
                        </a>
                        <a
                          href="https://www.linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={20} color="white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FIXED FOOTER BOTTOM WITH LANGUAGE SELECTOR */}
              <div className="footer-bottom">
                <div className="footer-copyright" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <p>&copy; 2025 Neval Mobility. {t('All rights reserved')}.</p>
                  
                  {/* LANGUAGE SELECTOR - MINIMALISTIC */}
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'sq' | 'en')}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6ec184',
                      padding: '4px 8px',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="sq" style={{ backgroundColor: '#000' }}>SQ</option>
                    <option value="en" style={{ backgroundColor: '#000' }}>EN</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Admin Login Modal - Shows when clicking the dot */}
            {showAdminLogin && (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLogin onClose={() => setShowAdminLogin(false)} />
              </Suspense>
            )}
          </footer>
        </div>
      } />
      
      {/* All Other Routes with Lazy Loading - KEEP EXACTLY AS IS */}
      <Route 
        path="/car/:carId" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading car details..." />}>
            <CarDetail />
          </Suspense>
        } 
      />
      <Route 
        path="/request-pricing" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading pricing form..." />}>
            <RequestPricingPage />
          </Suspense>
        } 
      />
      <Route 
        path="/fleet" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading fleet..." />}>
            <Fleet />
          </Suspense>
        } 
      />
      <Route 
        path="/about" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading about..." />}>
            <AboutUs />
          </Suspense>
        } 
      />
      <Route 
        path="/contact" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading contact..." />}>
            <ContactUs />
          </Suspense>
        } 
      />
      <Route 
        path="/technology/blade-battery" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading technology..." />}>
            <BladeBattery />
          </Suspense>
        } 
      />
      <Route 
        path="/technology/e-platform" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading technology..." />}>
            <EPlatform />
          </Suspense>
        } 
      />
      <Route 
        path="/technology/energy-management" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading technology..." />}>
            <EnergyManagement />
          </Suspense>
        } 
      />
      
      {/* Admin Dashboard Route */}
      <Route 
        path="/admin/dashboard" 
        element={
          <Suspense fallback={<LoadingSpinner message="Loading admin dashboard..." />}>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />
    </Routes>
  );
};

// Main App Component with LanguageProvider and AuthProvider
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;