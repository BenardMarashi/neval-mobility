// src/pages/admin/QuotationManager.tsx
import React, { useState } from 'react';
import { db, updateDoc, doc } from '../../services/firebase';
import { Quotation, QuotationStatus } from '../../types/Quotation';
import './QuotationManager.css';

interface QuotationManagerProps {
  quotations: Quotation[];
}

const QuotationManager: React.FC<QuotationManagerProps> = ({ quotations }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleStatusChange = async (quotation: Quotation, newStatus: QuotationStatus) => {
    if (!quotation.id) return;
    
    try {
      await updateDoc(doc(db, 'quotations', quotation.id), {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleNotesUpdate = async (quotation: Quotation) => {
    if (!quotation.id) return;
    
    try {
      await updateDoc(doc(db, 'quotations', quotation.id), {
        notes: notes[quotation.id] || quotation.notes || '',
        updatedAt: new Date()
      });
      alert('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes');
    }
  };

  const getStatusColor = (status: QuotationStatus) => {
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
    <div className="quotation-manager">
      <div className="manager-header">
        <h2>Quotation Requests</h2>
        <div className="stats">
          <span>Total: {quotations.length}</span>
          <span>Pending: {quotations.filter(q => q.status === 'pending').length}</span>
        </div>
      </div>

      <div className="quotations-list">
        {quotations.map((quotation) => (
          <div 
            key={quotation.id} 
            className={`quotation-card ${expandedId === quotation.id ? 'expanded' : ''}`}
          >
            <div 
              className="quotation-header"
              onClick={() => setExpandedId(expandedId === quotation.id ? null : quotation.id)}
            >
              <div className="quotation-info">
                <h3>{quotation.name}</h3>
                <p>{quotation.carName} • {formatDate(quotation.createdAt)}</p>
              </div>
              <div className="quotation-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(quotation.status) }}
                >
                  {quotation.status}
                </span>
              </div>
            </div>

            {expandedId === quotation.id && (
              <div className="quotation-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Email:</label>
                    <a href={`mailto:${quotation.email}`}>{quotation.email}</a>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <a href={`tel:${quotation.phone}`}>{quotation.phone}</a>
                  </div>
                  <div className="detail-item">
                    <label>Preferred Date:</label>
                    <span>{quotation.preferredDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Preferred Time:</label>
                    <span>{quotation.preferredTime}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{quotation.location}</span>
                  </div>
                </div>

                {quotation.message && (
                  <div className="detail-message">
                    <label>Message:</label>
                    <p>{quotation.message}</p>
                  </div>
                )}

                <div className="detail-actions">
                  <div className="status-update">
                    <label>Update Status:</label>
                    <select 
                      value={quotation.status}
                      onChange={(e) => handleStatusChange(quotation, e.target.value as QuotationStatus)}
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
                      value={notes[quotation.id!] ?? quotation.notes ?? ''}
                      onChange={(e) => setNotes({ ...notes, [quotation.id!]: e.target.value })}
                      placeholder="Add internal notes..."
                      rows={3}
                    />
                    <button 
                      onClick={() => handleNotesUpdate(quotation)}
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
        
        {quotations.length === 0 && (
          <div className="empty-state">
            <p>No quotation requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationManager;