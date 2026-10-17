import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import './LeadershipTree.css';

// Recursive Node for Visual Org Chart
const TreeNode = ({ node, onSelectMember, isTopLevel = false, parentName = null, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  // Initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'KR';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  return (
    <div className={`org-node ${hasChildren && !collapsed ? 'has-children' : ''} ${isTopLevel ? 'is-root-node' : ''}`}>
      {/* Node Member Card */}
      <div className="org-card-wrapper">
        <div
          className={`org-card ${isTopLevel ? 'is-ceo' : ''}`}
          onClick={() => onSelectMember(node)}
          title="Click to view full profile"
        >
          {isTopLevel ? (
            <div className="ceo-crown-badge">
              <span>👑</span>
              <span>Chief Executive (Top / Parent)</span>
            </div>
          ) : parentName ? (
            <div className="org-parent-badge">
              <span className="org-parent-badge-arrow">↳</span>
              <span>Reports to: {parentName}</span>
            </div>
          ) : null}

          <div className="org-card-avatar">
            {node.photo ? (
              <img
                src={node.photo}
                alt={node.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="avatar-fallback"
              style={{ display: node.photo ? 'none' : 'flex' }}
            >
              {getInitials(node.name)}
            </div>
          </div>

          <h4 className="org-card-name">{node.name}</h4>
          <p className="org-card-designation">{node.designation}</p>

          {node.bio && <p className="org-card-bio-snippet">{node.bio}</p>}

          <div className="org-card-footer">
            {hasChildren && (
              <span className="card-children-count">
                {node.children.length} {node.children.length === 1 ? 'Team Branch' : 'Team Branches'}
              </span>
            )}
            <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 600 }}>
              Details →
            </span>
          </div>
        </div>

        {/* Optional Branch Collapse Toggle */}
        {hasChildren && (
          <button
            type="button"
            className="branch-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            title={collapsed ? 'Expand team branch' : 'Collapse team branch'}
          >
            {collapsed ? `+ Expand (${node.children.length})` : '− Collapse'}
          </button>
        )}
      </div>

      {/* Children Branches with Connecting Lines */}
      {hasChildren && !collapsed && (
        <ul className="org-children-row">
          {node.children.map((child) => (
            <li key={child.id} className="org-child-branch">
              <TreeNode
                node={child}
                onSelectMember={onSelectMember}
                isTopLevel={false}
                parentName={node.name}
                depth={depth + 1}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Recursive Component for Linear / Mobile Branch View
const BranchNode = ({ node, onSelectMember, depth = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isTopLevel = depth === 0;

  return (
    <div className="org-list-item">
      <div
        className={`org-list-card ${isTopLevel ? 'is-ceo' : ''}`}
        onClick={() => onSelectMember(node)}
      >
        <div
          style={{
            width: isTopLevel ? '52px' : '44px',
            height: isTopLevel ? '52px' : '44px',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid var(--color-primary-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-primary-50)',
          }}
        >
          {node.photo ? (
            <img src={node.photo} alt={node.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
              {node.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-900)' }}>
              {node.name}
            </h4>
            {isTopLevel && (
              <span
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                }}
              >
                Top Leader
              </span>
            )}
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
            {node.designation}
          </p>
        </div>

        {hasChildren && (
          <span
            style={{
              fontSize: '11px',
              backgroundColor: 'var(--color-primary-50)',
              color: 'var(--color-primary-dark)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {node.children.length} {node.children.length === 1 ? 'Subordinate' : 'Subordinates'}
          </span>
        )}
      </div>

      {hasChildren && (
        <div className="org-list-children">
          {node.children.map((child) => (
            <BranchNode key={child.id} node={child} onSelectMember={onSelectMember} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const LeadershipTree = ({ tree = [] }) => {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'list'
  const [zoomLevel, setZoomLevel] = useState(80); // Default to 80% so all branches fit without horizontal scrolling
  const [selectedMember, setSelectedMember] = useState(null);

  if (!tree || tree.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-10)', color: 'var(--color-gray-500)' }}>
        <p>No leadership hierarchy structure configured yet.</p>
      </div>
    );
  }

  return (
    <div className="org-tree-container">
      {/* View Options & Zoom Controls */}
      <div className="org-tree-controls">
        <div className="org-tree-view-toggles">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
            onClick={() => setViewMode('chart')}
          >
            <span>🌳</span>
            <span>Visual Org Chart</span>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <span>📑</span>
            <span>Hierarchy Branch View</span>
          </button>
        </div>

        {viewMode === 'chart' && (
          <div className="org-tree-zoom-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)' }}>Zoom:</span>
            {[75, 80, 90, 100].map((zoom) => (
              <button
                key={zoom}
                type="button"
                onClick={() => setZoomLevel(zoom)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-gray-300)',
                  backgroundColor: zoomLevel === zoom ? 'var(--color-primary-50)' : '#fff',
                  color: zoomLevel === zoom ? 'var(--color-primary)' : 'var(--color-gray-700)',
                  fontWeight: zoomLevel === zoom ? 700 : 500,
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {zoom}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visual Org Chart Mode */}
      {viewMode === 'chart' ? (
        <div className="org-tree-viewport">
          <div
            className="org-tree-root"
            data-zoom={zoomLevel}
            style={{
              '--org-tree-zoom': zoomLevel / 100,
              zoom: `${zoomLevel}%`,
            }}
          >
            {tree.map((rootNode) => (
              <TreeNode
                key={rootNode.id}
                node={rootNode}
                onSelectMember={setSelectedMember}
                isTopLevel={true}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Mobile & Linear Branch List View */
        <div className="org-list-view">
          <div style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-xs)' }}>
            Showing institutional reporting hierarchy from top-level leadership down to departmental units:
          </div>
          {tree.map((rootNode) => (
            <BranchNode
              key={rootNode.id}
              node={rootNode}
              onSelectMember={setSelectedMember}
              depth={0}
            />
          ))}
        </div>
      )}

      {/* Member Details Modal */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={selectedMember ? selectedMember.name : 'Leader Profile'}
        size="md"
      >
        {selectedMember && (
          <div>
            <div style={{ display: 'flex', gap: 'var(--spacing-5)', alignItems: 'center', marginBottom: 'var(--spacing-5)' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  border: '3px solid var(--color-primary-200)',
                  boxShadow: '0 4px 12px rgba(1, 156, 220, 0.2)',
                  flexShrink: 0,
                  background: 'var(--color-primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedMember.photo ? (
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {selectedMember.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary-50)',
                    color: 'var(--color-primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-block',
                    marginBottom: '4px',
                  }}
                >
                  {selectedMember.parentId ? 'Departmental Leader' : 'Top-Level Executive / CEO'}
                </span>
                <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)', color: 'var(--color-gray-900)' }}>
                  {selectedMember.name}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {selectedMember.designation}
                </p>
              </div>
            </div>

            {selectedMember.bio && (
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                  Professional Profile & Role
                </h4>
                <p style={{ color: 'var(--color-gray-700)', lineHeight: 1.7, fontSize: 'var(--font-size-sm)' }}>
                  {selectedMember.bio}
                </p>
              </div>
            )}

            <div
              style={{
                backgroundColor: 'var(--color-gray-50)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-3) var(--spacing-4)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-3)',
                fontSize: 'var(--font-size-xs)',
                marginBottom: 'var(--spacing-5)',
              }}
            >
              <div>
                <strong style={{ color: 'var(--color-gray-600)' }}>Official Email:</strong>
                <p style={{ margin: 0, color: 'var(--color-gray-800)', wordBreak: 'break-all' }}>
                  {selectedMember.email || 'inquiry@khyberrehab.org'}
                </p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-gray-600)' }}>Direct Helpline:</strong>
                <p style={{ margin: 0, color: 'var(--color-gray-800)' }}>
                  {selectedMember.phone || '+92 91 5840000'}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Button variant="primary" size="sm" onClick={() => setSelectedMember(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
