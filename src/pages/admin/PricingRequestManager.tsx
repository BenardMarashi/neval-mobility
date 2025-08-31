// src/pages/admin/PricingRequestManager.tsx
import React, { useState } from 'react';
import { db, updateDoc, doc } from '../../services/firebase';
import { PricingRequest, PricingRequestStatus } from '../../types/PricingRequest';
import './PricingRequestManager.css';
import { serverTimestamp } from 'firebase/firestore';
interface PricingRequestManagerProps {
  pricingRequests: PricingRequest[];
}

const PricingRequestManager: React.FC<PricingRequestManagerProps> = ({ pricingRequests }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleStatusChange = async (request: PricingRequest, newStatus: PricingRequestStatus) => {
    if (!request.id) return;
    
    try {
      await updateDoc(doc(db, 'pricingRequests', request.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleNotesUpdate = async (request: PricingRequest) => {
    if (!request.id) return;
    
    try {
      await updateDoc(doc(db, 'pricingRequests', request.id), {
        notes: notes[request.id] || request.notes || '',
        updatedAt: serverTimestamp()
      });
      alert('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes');
    }
  };

  const getStatusColor = (status: PricingRequestStatus) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'contacted': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="pricing-request-manager">
      <div className="manager-header">
        <h2>Pricing Requests</h2>
        <div className="stats">
          <span>Total: {pricingRequests.length}</span>
          <span>Pending: {pricingRequests.filter(q => q.status === 'pending').length}</span>
        </div>
      </div>

      <div className="requests-list">
        {pricingRequests.map((request) => (
          <div 
            key={request.id} 
            className={`request-card ${expandedId === request.id ? 'expanded' : ''}`}
          >
            <div 
              className="request-header"
              onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
            >
              <div className="request-info">
                <h3>{request.customerName}</h3>
                <p>{request.carName} • {formatDate(request.createdAt)}</p>
              </div>
              <div className="request-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {request.status}
                </span>
              </div>
            </div>

            {expandedId === request.id && (
              <div className="request-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Email:</label>
                    <a href={`mailto:${request.email}`}>{request.email}</a>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <a href={`tel:${request.phone}`}>{request.phone}</a>
                  </div>
                  <div className="detail-item">
                    <label>Preferred Date:</label>
                    <span>{request.preferredDate || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Preferred Time:</label>
                    <span>{request.preferredTime || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{request.location || 'Not specified'}</span>
                  </div>
                </div>

                {request.message && (
                  <div className="detail-message">
                    <label>Message:</label>
                    <p>{request.message}</p>
                  </div>
                )}

                <div className="detail-actions">
                  <div className="status-update">
                    <label>Update Status:</label>
                    <select 
                      value={request.status}
                      onChange={(e) => handleStatusChange(request, e.target.value as PricingRequestStatus)}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="notes-section">
                    <label>Admin Notes:</label>
                    <textarea
                      value={notes[request.id!] ?? request.notes ?? ''}
                      onChange={(e) => setNotes({ ...notes, [request.id!]: e.target.value })}
                      placeholder="Add internal notes..."
                      rows={3}
                    />
                    <button 
                      onClick={() => handleNotesUpdate(request)}
                      className="btn-save-notes"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {pricingRequests.length === 0 && (
          <div className="empty-state">
            <p>No pricing requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingRequestManager;