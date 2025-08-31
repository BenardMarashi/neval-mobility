// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutAdmin, db, collection, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from '../../services/firebase';
import { Car } from '../../types/Car';
import { PricingRequest } from '../../types/PricingRequest';
import CarManager from './CarManager';
import PricingRequestManager from './PricingRequestManager';
import './AdminDashboard.css';

type TabType = 'cars' | 'pricingRequests';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [pricingRequests, setPricingRequests] = useState<PricingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up real-time listeners
    const carsUnsubscribe = onSnapshot(
      collection(db, 'cars'),
      (snapshot) => {
        const carsData: Car[] = [];
        snapshot.forEach((doc) => {
          carsData.push({ id: doc.id, ...doc.data() } as Car);
        });
        setCars(carsData.sort((a, b) => a.name.localeCompare(b.name)));
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );

    const pricingUnsubscribe = onSnapshot(
      collection(db, 'pricingRequests'),
      (snapshot) => {
        const requestsData: PricingRequest[] = [];
        snapshot.forEach((doc) => {
          requestsData.push({ id: doc.id, ...doc.data() } as PricingRequest);
        });
        // Sort by newest first
        setPricingRequests(requestsData.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;
          return bTime - aTime;
        }));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching pricing requests:', error);
        setLoading(false);
      }
    );

    return () => {
      carsUnsubscribe();
      pricingUnsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteDoc(doc(db, 'cars', carId));
      } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete car');
      }
    }
  };

  const handleToggleCarActive = async (car: Car) => {
    try {
      await updateDoc(doc(db, 'cars', car.id!), {
        isActive: !car.isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Failed to update car status');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-actions">
            <button onClick={() => navigate('/')} className="btn-secondary">
              View Site
            </button>
            <button onClick={handleSignOut} className="btn-primary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          Cars ({cars.length})
        </button>
        <button
          className={`tab ${activeTab === 'pricingRequests' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricingRequests')}
        >
          Pricing Requests ({pricingRequests.filter(q => q.status === 'pending').length} new)
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'cars' ? (
          <CarManager 
            cars={cars}
            onDelete={handleDeleteCar}
            onToggleActive={handleToggleCarActive}
          />
        ) : (
          <PricingRequestManager pricingRequests={pricingRequests} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;