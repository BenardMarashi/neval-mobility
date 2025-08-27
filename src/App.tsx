import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Hyperspeed from './components/HyperSpeed';
import Carousel from './components/Carousel';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import CarDetail from './pages/CarDetail';
import { Car, Zap, Battery, Gauge } from 'lucide-react';

const App: React.FC = () => {
  const vehicles = [
    {
      title: "BYD Seal",
      description: "Premium electric sedan. 700km range. From $65,000",
      id: 1,
      link: "/car/seal",
      icon: <Car className="h-4 w-4 text-white" />,
    },
    {
      title: "BYD Atto 3",
      description: "Compact SUV. 420km range. From $48,000",
      id: 2,
      link: "/car/atto3",
      icon: <Car className="h-4 w-4 text-white" />,
    },
    {
      title: "BYD Tang",
      description: "7-seater SUV. 500km range. From $72,000",
      id: 3,
      link: "/car/tang",
      icon: <Car className="h-4 w-4 text-white" />,
    },
    {
      title: "BYD Dolphin",
      description: "City car. 405km range. From $35,000",
      id: 4,
      link: "/car/dolphin",
      icon: <Car className="h-4 w-4 text-white" />,
    },
    {
      title: "BYD Han",
      description: "Executive sedan. 605km range. From $78,000",
      id: 5,
      link: "/car/han",
      icon: <Car className="h-4 w-4 text-white" />,
    },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="nav-content">
          <div className="logo">NEVAL MOBILITY</div>
          <ul className="nav-links">
            <li><a href="#vehicles">Vehicles</a></li>
            <li><a href="#technology">Technology</a></li>
            <li><a href="#charging">Charging</a></li>
            <li><a href="#sustainability">Sustainability</a></li>
            <li><a href="#about">About</a></li>
          </ul>
          <button className="nav-cta">Book Test Drive</button>
        </div>
      </nav>

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
              <button className="btn-primary">Explore Fleet</button>
              <button className="btn-secondary">Configure</button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Carousel Section */}
        <section id="vehicles" className="vehicle-section">
        <div className="section-header">
            <h2 className="section-title">Our Fleet</h2>
            <p className="section-subtitle">Five models. Zero emissions.</p>
        </div>
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-column">
              <h4>Vehicles</h4>
              <ul>
                <li><a href="/vehicles/seal">BYD Seal</a></li>
                <li><a href="/vehicles/atto3">BYD Atto 3</a></li>
                <li><a href="/vehicles/tang">BYD Tang</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
          </div>
        } />
        <Route path="/car/:carId" element={<CarDetail />} />
      </Routes>
    </Router>
  );
};

export default App;