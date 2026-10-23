import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, LoadingSpinner, EmptyState } from '../../components';
import { useDocumentTitle } from '../../hooks';
import { inquiryService } from '../../services/inquiryService';

export const AdminInquiriesPage = () => {
  useDocumentTitle('Patient Intake Inquiries');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingAction, setUpdatingAction] = useState(null);
  const [internalNoteText, setInternalNoteText] = useState('');

  // Auto-dismiss status messages after 3.5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const fetchInquiries = () => {
    setLoading(true);
    setApiNotice(null);

    const params = {};
    if (filter !== 'ALL') params.status = filter;
    if (searchTerm.trim()) params.search = searchTerm.trim();

    inquiryService
      .getInquiries(params)
      .then((res) => {
        const list = res?.data?.inquiries || (Array.isArray(res?.data) ? res.data : []);
        setInquiries(list);
        if (list.length > 0) {
          // If previous selection still exists in the list, keep it; else select first
          setSelectedInquiry((prev) => {
            if (prev) {
              const found = list.find((item) => item.id === prev.id);
              if (found) {
                setInternalNoteText(found.internalNote || '');
                return found;
              }
            }
            setInternalNoteText(list[0].internalNote || '');
            return list[0];
          });
        } else {
          setSelectedInquiry(null);
          setInternalNoteText('');
        }
      })
      .catch((err) => {
        setApiNotice(err.message || 'Unable to connect to live inquiries service.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleSelectInquiry = (inq) => {
    setSelectedInquiry(inq);
    setInternalNoteText(inq.internalNote || '');
    setStatusMessage(null);
  };

  const handleUpdateInquiryStatus = async (targetId, newStatus, customNote = null) => {
    const inqToUpdate =
      inquiries.find((i) => i.id === targetId) ||
      (selectedInquiry?.id === targetId ? selectedInquiry : null);
    if (!inqToUpdate) return;

    const previousStatus = inqToUpdate.status;
    const noteToSend =
      customNote !== null
        ? customNote
        : selectedInquiry?.id === targetId
        ? internalNoteText
        : inqToUpdate.internalNote || '';

    setUpdatingId(targetId);
    setUpdatingAction(newStatus);
    setStatusMessage(null);

    // Instant optimistic update in local state
    const updated = { ...inqToUpdate, status: newStatus, internalNote: noteToSend };
    if (selectedInquiry?.id === targetId) {
      setSelectedInquiry(updated);
    }
    setInquiries((prev) => prev.map((item) => (item.id === targetId ? updated : item)));

    try {
      await inquiryService.updateStatus(targetId, newStatus, noteToSend);
      const label = getStatusBadgeStyle(newStatus).label;
      setStatusMessage({ type: 'success', text: `✓ Status for "${inqToUpdate.fullName}" marked as ${label}` });
    } catch (err) {
      // Revert optimistic update on failure
      const reverted = { ...inqToUpdate, status: previousStatus };
      if (selectedInquiry?.id === targetId) {
        setSelectedInquiry(reverted);
      }
      setInquiries((prev) => prev.map((item) => (item.id === targetId ? reverted : item)));
      setStatusMessage({ type: 'error', text: `Failed to update status: ${err.message}` });
    } finally {
      setUpdatingId(null);
      setUpdatingAction(null);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedInquiry) return;
    handleUpdateInquiryStatus(selectedInquiry.id, newStatus, internalNoteText);
  };

  const handleSaveInternalNote = async () => {
    if (!selectedInquiry) return;
    setUpdatingId(selectedInquiry.id);
    setStatusMessage(null);

    try {
      await inquiryService.updateStatus(selectedInquiry.id, selectedInquiry.status, internalNoteText);
      setSelectedInquiry((prev) => ({ ...prev, internalNote: internalNoteText }));
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id ? { ...item, internalNote: internalNoteText } : item
        )
      );
      setStatusMessage({ type: 'success', text: 'Internal note saved successfully' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Failed to save note: ${err.message}` });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this confidential inquiry record?')) {
      return;
    }
    setUpdatingId(id);
    try {
      await inquiryService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
        setInternalNoteText('');
      }
      setStatusMessage({ type: 'success', text: 'Inquiry deleted successfully' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Failed to delete: ${err.message}` });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fef3c7', text: '#92400e', label: 'New / Pending' };
      case 'IN_REVIEW':
        return { bg: '#e0e7ff', text: '#3730a3', label: 'In Progress' };
      case 'CONTACTED':
        return { bg: '#d1fae5', text: '#065f46', label: 'Contacted' };
      case 'CLOSED':
      case 'ARCHIVED':
        return { bg: '#f3f4f6', text: '#4b5563', label: 'Closed / Archived' };
      default:
        return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

  return (
    <div className="admin-inquiries-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-6)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-3)',
        }}
      >
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)' }}>
            Patient Intake & Consultation Inquiries
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
            Review, prioritize, and record clinical responses for intake inquiries.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInquiries}>
          🔄 Refresh Inquiries
        </Button>
      </div>

      {apiNotice && (
        <Alert type="warning" title="Inquiries Service Notice">
          {apiNotice}
        </Alert>
      )}

      {statusMessage && (
        <Alert type={statusMessage.type} dismissible onDismiss={() => setStatusMessage(null)}>
          {statusMessage.text}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-6)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Inquiries' },
            { id: 'PENDING', label: 'New (Pending)' },
            { id: 'IN_REVIEW', label: 'In Progress' },
            { id: 'CONTACTED', label: 'Contacted' },
            { id: 'CLOSED', label: 'Closed / Archived' },
          ].map((item) => (
            <Button
              key={item.id}
              variant={filter === item.id ? 'primary' : 'secondary'}
              size="sm"
              className="btn-pill"
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: 'var(--font-size-sm)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-gray-300)',
              width: '220px',
            }}
          />
          <Button variant="outline" size="sm" type="submit">
            Search
          </Button>
        </form>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--spacing-12) 0' }}>
          <LoadingSpinner text="Loading patient inquiries..." />
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          title="No Inquiries Found"
          description="There are currently no patient inquiries matching this status or search filter."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.3fr)',
            gap: 'var(--spacing-6)',
            alignItems: 'start',
          }}
        >
          {/* Inquiries Queue List */}
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-3)',
              }}
            >
              <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-gray-800)', margin: 0 }}>
                Inquiry Queue ({inquiries.length})
              </h3>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                Select to view
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-3)',
                maxHeight: '680px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {inquiries.map((inq) => {
                const badge = getStatusBadgeStyle(inq.status);
                const isSelected = selectedInquiry?.id === inq.id;

                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    style={{
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-gray-200)',
                      backgroundColor: isSelected ? 'var(--color-primary-50)' : 'var(--color-white)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)' }}>
                        {inq.fullName}
                      </strong>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: badge.bg,
                          color: badge.text,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-gray-600)',
                        marginBottom: '4px',
                      }}
                    >
                      📞 {inq.phone}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-gray-500)',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{inq.inquiryType}</span>
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Quick Triage Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        marginTop: '8px',
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                        flexWrap: 'wrap',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        disabled={updatingId === inq.id}
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'IN_REVIEW')}
                        title="Mark inquiry as in progress"
                        style={{
                          fontSize: '10.5px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          border: inq.status === 'IN_REVIEW' ? '1.5px solid #6366f1' : '1px solid #c7d2fe',
                          backgroundColor: inq.status === 'IN_REVIEW' ? '#e0e7ff' : '#fff',
                          color: '#3730a3',
                          cursor: updatingId === inq.id ? 'not-allowed' : 'pointer',
                          fontWeight: inq.status === 'IN_REVIEW' ? 700 : 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {updatingId === inq.id && updatingAction === 'IN_REVIEW' ? '⏳...' : '⏳ In Progress'}
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === inq.id}
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'CONTACTED')}
                        title="Mark patient as contacted"
                        style={{
                          fontSize: '10.5px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          border: inq.status === 'CONTACTED' ? '1.5px solid #10b981' : '1px solid #a7f3d0',
                          backgroundColor: inq.status === 'CONTACTED' ? '#d1fae5' : '#fff',
                          color: '#065f46',
                          cursor: updatingId === inq.id ? 'not-allowed' : 'pointer',
                          fontWeight: inq.status === 'CONTACTED' ? 700 : 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {updatingId === inq.id && updatingAction === 'CONTACTED' ? '⏳...' : '📞 Contacted'}
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === inq.id}
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'CLOSED')}
                        title="Mark inquiry as closed"
                        style={{
                          fontSize: '10.5px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          border: inq.status === 'CLOSED' ? '1.5px solid #6b7280' : '1px solid #e5e7eb',
                          backgroundColor: inq.status === 'CLOSED' ? '#f3f4f6' : '#fff',
                          color: '#4b5563',
                          cursor: updatingId === inq.id ? 'not-allowed' : 'pointer',
                          fontWeight: inq.status === 'CLOSED' ? 700 : 500,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {updatingId === inq.id && updatingAction === 'CLOSED' ? '⏳...' : '✓ Closed'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Selected Inquiry Detail & Internal Note Editor */}
          {selectedInquiry ? (
            <Card variant="light-blue" style={{ position: 'sticky', top: 'var(--spacing-6)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-4)',
                  borderBottom: '1px solid var(--color-primary-200)',
                  paddingBottom: 'var(--spacing-3)',
                }}
              >
                <div>
                  <span className="section-badge">{selectedInquiry.inquiryType}</span>
                  <h3
                    style={{
                      fontSize: 'var(--font-size-xl)',
                      marginTop: 'var(--spacing-1)',
                      color: 'var(--color-gray-900)',
                      marginBottom: '2px',
                    }}
                  >
                    {selectedInquiry.fullName}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>
                    Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  style={{ color: '#ef4444' }}
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  disabled={updatingId === selectedInquiry.id}
                >
                  🗑️ Delete
                </Button>
              </div>

              {/* Contact Information */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-3)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'var(--spacing-4)',
                  backgroundColor: 'var(--color-white)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-primary-100)',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-xs)' }}>
                    Phone Contact:
                  </strong>
                  <div style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>
                    {selectedInquiry.phone}
                  </div>
                </div>

                <div>
                  <strong style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-xs)' }}>
                    Email Address:
                  </strong>
                  <div style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>
                    {selectedInquiry.email || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Patient Message */}
              <div
                style={{
                  backgroundColor: 'var(--color-white)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-primary-200)',
                  marginBottom: 'var(--spacing-5)',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-2)',
                    color: 'var(--color-gray-800)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  Submitted Message:
                </strong>
                <p
                  style={{
                    color: 'var(--color-gray-700)',
                    lineHeight: 1.6,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div style={{ marginBottom: 'var(--spacing-5)' }}>
                <strong
                  style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-2)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-gray-700)',
                    textTransform: 'uppercase',
                  }}
                >
                  Update Inquiry Status:
                </strong>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                  <Button
                    variant={selectedInquiry.status === 'PENDING' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={updatingId === selectedInquiry.id}
                    onClick={() => handleStatusChange('PENDING')}
                  >
                    {updatingId === selectedInquiry.id && updatingAction === 'PENDING' ? '⏳ Updating...' : 'Mark New / Pending'}
                  </Button>
                  <Button
                    variant={selectedInquiry.status === 'IN_REVIEW' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={updatingId === selectedInquiry.id}
                    onClick={() => handleStatusChange('IN_REVIEW')}
                  >
                    {updatingId === selectedInquiry.id && updatingAction === 'IN_REVIEW' ? '⏳ Updating...' : 'Mark In Progress'}
                  </Button>
                  <Button
                    variant={selectedInquiry.status === 'CONTACTED' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={updatingId === selectedInquiry.id}
                    onClick={() => handleStatusChange('CONTACTED')}
                  >
                    {updatingId === selectedInquiry.id && updatingAction === 'CONTACTED' ? '⏳ Updating...' : 'Mark Contacted'}
                  </Button>
                  <Button
                    variant={selectedInquiry.status === 'CLOSED' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={updatingId === selectedInquiry.id}
                    onClick={() => handleStatusChange('CLOSED')}
                  >
                    {updatingId === selectedInquiry.id && updatingAction === 'CLOSED' ? '⏳ Updating...' : 'Mark Closed'}
                  </Button>
                </div>
              </div>

              {/* Internal Clinical & Staff Notes */}
              <div>
                <strong
                  style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-2)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-gray-700)',
                    textTransform: 'uppercase',
                  }}
                >
                  Internal Staff Notes (Private):
                </strong>
                <textarea
                  rows={3}
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Record confidential intake coordination remarks (e.g. called family, scheduled intake assessment for Thursday)..."
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-gray-300)',
                    fontSize: 'var(--font-size-sm)',
                    marginBottom: 'var(--spacing-2)',
                    resize: 'vertical',
                  }}
                />
                <Button
                  variant="primary"
                  size="sm"
                  disabled={updatingId === selectedInquiry.id}
                  onClick={handleSaveInternalNote}
                >
                  {updatingId === selectedInquiry.id ? 'Saving Note...' : 'Save Internal Note'}
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
                Select an inquiry from the queue to view details and update its status.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
