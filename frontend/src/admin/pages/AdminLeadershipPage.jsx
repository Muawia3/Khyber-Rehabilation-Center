import React, { useState, useEffect } from 'react';
import { SectionHeader, Card, Button, Modal, Alert, LoadingSpinner, LeadershipTree } from '../../components';
import { useDocumentTitle } from '../../hooks';
import { leadershipService } from '../../services';

export const AdminLeadershipPage = () => {
  useDocumentTitle('Admin - Manage Leadership & Hierarchy');
  const [flatMembers, setFlatMembers] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = JSON.parse(localStorage.getItem('khyber_leadership_data') || '{}');
        return cached.flat || [];
      }
    } catch {}
    return [];
  });
  const [treeData, setTreeData] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = JSON.parse(localStorage.getItem('khyber_leadership_data') || '{}');
        return cached.tree || [];
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Active view tab: 'table' or 'preview'
  const [activeTab, setActiveTab] = useState('table');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    photo: '',
    bio: '',
    email: '',
    phone: '',
    parentId: 'none',
    order: 0,
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState('');

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchLeadership();
  }, []);

  const fetchLeadership = async () => {
    setLoading(true);
    try {
      const response = await leadershipService.getAdminLeadership();
      if (response && response.data) {
        setFlatMembers(response.data.flat || []);
        setTreeData(response.data.tree || []);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('khyber_leadership_data', JSON.stringify(response.data));
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Failed to fetch admin leadership:', err);
      try {
        if (typeof window !== 'undefined') {
          const cached = JSON.parse(localStorage.getItem('khyber_leadership_data') || '{}');
          if (cached.flat?.length) {
            setFlatMembers(cached.flat);
            setTreeData(cached.tree || []);
          }
        }
      } catch {}
      showAlert('danger', err.message || 'Failed to retrieve leadership members from server.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (variant, message) => {
    setAlert({ variant, message });
    setTimeout(() => {
      setAlert(null);
    }, 6000);
  };

  // Helper: Find all descendant IDs of a member to prevent circular hierarchy assignment
  const getDescendantIds = (memberId, membersList) => {
    const descendants = new Set();
    const findChildren = (currentId) => {
      const directChildren = membersList.filter((m) => m.parentId === currentId);
      directChildren.forEach((child) => {
        descendants.add(child.id);
        findChildren(child.id);
      });
    };
    findChildren(memberId);
    return descendants;
  };

  // Open modal to add new member (or add direct child of a member)
  const handleOpenAdd = (parentMember = null) => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: '',
      photo: '',
      bio: '',
      email: '',
      phone: '',
      parentId: parentMember ? parentMember.id : 'none',
      order: parentMember ? (parentMember._count?.children || 0) + 1 : flatMembers.length,
      isPublished: true,
    });
    setImageError('');
    setIsModalOpen(true);
  };

  // Open modal to edit existing member
  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      designation: member.designation || '',
      photo: member.photo || '',
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      parentId: member.parentId || 'none',
      order: member.order !== undefined ? member.order : 0,
      isPublished: member.isPublished !== undefined ? member.isPublished : true,
    });
    setImageError('');
    setIsModalOpen(true);
  };

  // Handle image upload with validation
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only JPG, PNG, WEBP, or GIF image files are allowed.');
      return;
    }

    // Validate size (max 2.5 MB)
    if (file.size > 2.5 * 1024 * 1024) {
      setImageError('Image file is too large. Maximum size is 2.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Submit form
  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showAlert('danger', 'Full name is required.');
      return;
    }
    if (!formData.designation.trim()) {
      showAlert('danger', 'Designation / role is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        photo: formData.photo || null,
        bio: formData.bio || null,
        email: formData.email || null,
        phone: formData.phone || null,
        parentId: formData.parentId === 'none' ? null : formData.parentId,
        order: parseInt(formData.order, 10) || 0,
        isPublished: Boolean(formData.isPublished),
      };

      if (editingMember) {
        await leadershipService.updateMember(editingMember.id, payload);
        showAlert('success', `Leadership member "${payload.name}" updated successfully.`);
      } else {
        await leadershipService.createMember(payload);
        showAlert('success', `New leadership member "${payload.name}" added successfully.`);
      }

      setIsModalOpen(false);
      fetchLeadership();
    } catch (err) {
      console.error('Save leadership member error:', err);
      const msg = err.message || 'Failed to save leadership member. Please try again.';
      showAlert('danger', msg);
    } finally {
      setSaving(false);
    }
  };

  // Open delete confirmation modal
  const handleOpenDelete = (member) => {
    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      await leadershipService.deleteMember(memberToDelete.id, true);
      showAlert('success', `Leadership member "${memberToDelete.name}" was deleted successfully.`);
      setDeleteModalOpen(false);
      setMemberToDelete(null);
      fetchLeadership();
    } catch (err) {
      console.error('Delete member error:', err);
      showAlert('danger', err.message || 'Failed to delete member.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter allowed parents when editing to prevent circular relationships
  const forbiddenParentIds = editingMember
    ? new Set([editingMember.id, ...getDescendantIds(editingMember.id, flatMembers)])
    : new Set();

  return (
    <div className="admin-leadership-page">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)', margin: '0 0 4px' }}>
            Manage Leadership & Reporting Hierarchy
          </h1>
          <p style={{ color: 'var(--color-gray-600)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
            Configure executive hierarchy, CEO parent node, and departmental child branches for Khyber Rehabilitation Center.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="outline" size="sm" onClick={fetchLeadership} disabled={loading}>
            🔄 Refresh Data
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleOpenAdd()}>
            + Add New Leader / Member
          </Button>
        </div>
      </div>

      {alert && (
        <Alert variant={alert.variant} style={{ marginBottom: 'var(--spacing-6)' }}>
          {alert.message}
        </Alert>
      )}

      {/* Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="white">
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Leaders & Staff
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
            {flatMembers.length}
          </div>
        </Card>

        <Card variant="white">
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
            Top-Level Roots (CEO / Head)
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-gray-800)', marginTop: '4px' }}>
            {flatMembers.filter((m) => !m.parentId).length}
          </div>
        </Card>

        <Card variant="white">
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
            Departmental Subordinates
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-gray-800)', marginTop: '4px' }}>
            {flatMembers.filter((m) => m.parentId).length}
          </div>
        </Card>

        <Card variant="white">
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active on Public Website
          </span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>
            {flatMembers.filter((m) => m.isPublished).length}
          </div>
        </Card>
      </div>

      {/* View Mode Toggle Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', borderBottom: '2px solid var(--color-gray-200)', marginBottom: 'var(--spacing-6)' }}>
        <button
          type="button"
          onClick={() => setActiveTab('table')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'table' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'table' ? 'var(--color-primary)' : 'var(--color-gray-600)',
            fontWeight: 700,
            fontSize: 'var(--font-size-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📋</span> Member Management Directory
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'preview' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'preview' ? 'var(--color-primary)' : 'var(--color-gray-600)',
            fontWeight: 700,
            fontSize: 'var(--font-size-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🌳</span> Live Tree Hierarchy Preview
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <LoadingSpinner size="lg" message="Loading leadership hierarchy data..." />
        </div>
      ) : activeTab === 'table' ? (
        /* Members Table View */
        <Card variant="white">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-gray-50)', borderBottom: '1.5px solid var(--color-gray-200)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px' }}>Member</th>
                  <th style={{ padding: '12px 14px' }}>Designation</th>
                  <th style={{ padding: '12px 14px' }}>Reporting Parent</th>
                  <th style={{ padding: '12px 14px' }}>Hierarchy Branch</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flatMembers.map((member) => {
                  const parent = flatMembers.find((m) => m.id === member.parentId);
                  const childCount = flatMembers.filter((m) => m.parentId === member.id).length;
                  const isTopLevel = !member.parentId;

                  return (
                    <tr
                      key={member.id}
                      style={{
                        borderBottom: '1px solid var(--color-gray-100)',
                        backgroundColor: isTopLevel ? '#fbfdfe' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: 'var(--radius-full)',
                              overflow: 'hidden',
                              backgroundColor: 'var(--color-primary-50)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                {member.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <strong style={{ color: 'var(--color-gray-900)', fontSize: '13px' }}>
                              {member.name}
                            </strong>
                            {isTopLevel && (
                              <span
                                style={{
                                  marginLeft: '6px',
                                  backgroundColor: 'var(--color-primary)',
                                  color: '#fff',
                                  fontSize: '9px',
                                  padding: '1px 6px',
                                  borderRadius: '8px',
                                  fontWeight: 700,
                                }}
                              >
                                TOP LEADER / CEO
                              </span>
                            )}
                            {member.email && (
                              <div style={{ color: 'var(--color-gray-500)', fontSize: '11px' }}>{member.email}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                        {member.designation}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {parent ? (
                          <span style={{ color: 'var(--color-gray-800)' }}>
                            ↳ {parent.name} ({parent.designation})
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                            👑 Top-Level (No Parent)
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {childCount > 0 ? (
                          <span
                            style={{
                              backgroundColor: 'var(--color-primary-50)',
                              color: 'var(--color-primary)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontWeight: 600,
                            }}
                          >
                            {childCount} direct {childCount === 1 ? 'subordinate' : 'subordinates'}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--color-gray-400)' }}>Leaf member (0 child)</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: member.isPublished ? '#dcfce7' : '#fee2e2',
                            color: member.isPublished ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {member.isPublished ? 'Published' : 'Hidden'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            title="Add direct child under this member"
                            onClick={() => handleOpenAdd(member)}
                          >
                            + Child
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => handleOpenEdit(member)}
                          >
                            Edit
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(member)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Live Tree Preview Mode */
        <Card variant="white">
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-gray-800)', fontSize: 'var(--font-size-sm)' }}>
              Live Public Tree Preview:
            </span>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
              This is the interactive hierarchical tree structure as rendered on the public website.
            </p>
          </div>
          <LeadershipTree tree={treeData} />
        </Card>
      )}

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? `Edit Leader: ${editingMember.name}` : 'Add New Leadership Member'}
        size="lg"
      >
        <form onSubmit={handleSaveMember}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Tariq Khan"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
                Designation / Title *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Chief Executive Officer (CEO) & Founder"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)' }}
              />
            </div>
          </div>

          {/* Parent Selection with Anti-Cycle Protection */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
              Reporting Parent Leader (Hierarchy Branch)
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-primary-300)', fontSize: 'var(--font-size-sm)', backgroundColor: '#fff' }}
            >
              <option value="none">👑 No Parent / Top-Level Leader (e.g. CEO / Board Head)</option>
              {flatMembers.map((member) => {
                const isForbidden = forbiddenParentIds.has(member.id);
                return (
                  <option key={member.id} value={member.id} disabled={isForbidden}>
                    {member.name} — {member.designation} {isForbidden ? '(Forbidden: Cannot be self or descendant)' : ''}
                  </option>
                );
              })}
            </select>
            <small style={{ color: 'var(--color-gray-500)', fontSize: '11px', display: 'block', marginTop: '4px' }}>
              Select "No Parent" to place at top of tree, or choose an existing leader to attach this member as their child node.
            </small>
          </div>

          {/* Photo URL or File Upload */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
              Photo / Portrait Image
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <div>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => {
                    setImageError('');
                    setFormData({ ...formData, photo: e.target.value });
                  }}
                  placeholder="Paste Image URL (https://...)"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)' }}
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  style={{ width: '100%', fontSize: 'var(--font-size-xs)' }}
                />
              </div>
            </div>
            {imageError && (
              <span style={{ color: '#dc2626', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                {imageError}
              </span>
            )}
            {formData.photo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                <img
                  src={formData.photo}
                  alt="Preview"
                  style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '1px solid var(--color-primary)' }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, photo: '' })}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          {/* Details / Bio */}
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
              Biography / Responsibilities (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Outline qualifications, clinical focus, or departmental governance responsibilities..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-5)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
                Official Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@khyberrehab.org"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
                Phone / Helpline (Optional)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 91 5840000"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginBottom: '4px' }}>
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-300)', fontSize: 'var(--font-size-sm)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-5)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <span>Published & visible on public Leadership organizational tree</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member to Tree'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Member Deletion"
        size="md"
      >
        {memberToDelete && (
          <div>
            <p style={{ color: 'var(--color-gray-700)', fontSize: 'var(--font-size-sm)' }}>
              Are you sure you want to delete <strong>{memberToDelete.name}</strong> ({memberToDelete.designation})?
            </p>

            {flatMembers.filter((m) => m.parentId === memberToDelete.id).length > 0 && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #fef3c7',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-4)',
                  margin: 'var(--spacing-4) 0',
                }}
              >
                <div style={{ fontWeight: 700, color: '#b45309', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚠️ Hierarchy Warning:</span>
                </div>
                <p style={{ color: '#92400e', fontSize: 'var(--font-size-xs)', margin: '4px 0 0', lineHeight: 1.5 }}>
                  This member has{' '}
                  <strong>
                    {flatMembers.filter((m) => m.parentId === memberToDelete.id).length} child subordinate(s)
                  </strong>. Deleting this leader will reassign their children to this leader's parent node (or promote them to Top-Level if this was a top node).
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-5)' }}>
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Member'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
