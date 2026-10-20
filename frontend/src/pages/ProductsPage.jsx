import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader, Card, Button, Alert, LoadingSpinner, EmptyState } from '../components';
import { useDocumentTitle } from '../hooks';
import { CONTACT_INFO } from '../utils/constants';
import { contentService } from '../services/contentService';

const FALLBACK_CATALOG = [
  {
    id: 'prod-1',
    category: 'Fabric Cut Work',
    title: 'Handcrafted Fabric Cutwork Cushion Covers (Set of 2)',
    workshop: 'Fabric Cut Work Department',
    description: 'Intricately designed cotton cutwork cushion covers crafted by recovering artisans in our specialized fabric cut work workshop.',
    spec: 'Size: 16x16 inches, pure cotton with cutwork border',
  },
  {
    id: 'prod-2',
    category: 'Fabric Cut Work',
    title: 'Designer Fabric Cutwork Table Runner & Napkins',
    workshop: 'Fabric Cut Work Department',
    description: 'Premium organic linen table runner featuring traditional geometric cutwork border embroidery and matching hand-stitched napkins.',
    spec: 'Runner length: 72 inches, set includes 6 napkins',
  },
  {
    id: 'prod-3',
    category: 'Fabric Cut Work',
    title: 'Artisan Cutwork Embroidered Kurta Panels',
    workshop: 'Fabric Cut Work Department',
    description: 'Masterfully stitched fabric cutwork necklines and sleeve borders prepared for bespoke formal apparel.',
    spec: 'Pure lawn and cotton fabrics, custom colors available',
  },
  {
    id: 'prod-4',
    category: 'Fabric Cut Work',
    title: 'Cutwork Embroidered Bedspread & Pillow Ensemble',
    workshop: 'Fabric Cut Work Department',
    description: 'Traditional Peshawar cutwork artisan bed cover with openwork needlecraft corners and reinforced double stitching.',
    spec: 'King size bedspread with 2 matching pillow covers',
  },
  {
    id: 'prod-5',
    category: 'Fabric Cut Work',
    title: 'Hand-Stitched Cutwork Border Dupattas',
    workshop: 'Fabric Cut Work Department',
    description: 'Lightweight chiffon and organza dupattas finished with delicate scalloped cutwork borders and needlepoint.',
    spec: 'Length: 2.5 meters, four-side cutwork finishing',
  },
];

export const ProductsPage = () => {
  useDocumentTitle('Products Catalog & Crafts');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const categories = ['All', 'Fabric Cut Work', 'Woodcrafts', 'Textiles', 'Art & Pottery'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    contentService
      .getProducts(selectedCategory)
      .then((res) => {
        if (isMounted) {
          setDbProducts(res.data || []);
          setApiError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setApiError(err.message || 'Unable to connect to live product catalog.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const displayItems = dbProducts.length > 0
    ? dbProducts
    : (selectedCategory === 'All'
        ? FALLBACK_CATALOG
        : FALLBACK_CATALOG.filter((i) => i.category === selectedCategory));

  return (
    <div className="products-page">
      {/* Header Banner */}
      <section className="section-padding bg-mesh" style={{ borderBottom: '1px solid rgba(1, 156, 220, 0.18)' }}>
        <div className="container">
          <SectionHeader
            subtitle="Patient Crafts & Catalog"
            title="Rehabilitation Products Catalog"
            description="Explore items handcrafted by individuals in vocational recovery at Khyber Rehabilitation Center, Peshawar. Each order directly supports patient rehabilitation funds."
          />
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="section-padding bg-white">
        <div className="container">
          {apiError && import.meta.env.DEV && (
            <Alert type="warning" title="Development Status Notice">
              <strong>Server Notice:</strong> {apiError} (Displaying offline catalog structure until PostgreSQL server is active)
            </Alert>
          )}

          {/* Transparency Disclaimer Notice */}
          <div
            className="glass-card"
            style={{
              padding: 'var(--spacing-5) var(--spacing-6)',
              marginBottom: 'var(--spacing-8)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-4)',
              background: 'linear-gradient(135deg, rgba(240, 250, 255, 0.95) 0%, rgba(244, 250, 254, 0.85) 100%)',
            }}
          >
            <span style={{ fontSize: '28px' }}>🏺</span>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', lineHeight: 1.7 }}>
              <strong>Fair-Trade & Non-Profit Principle:</strong> All products featured below are produced
              by recovering trainees during structured vocational workshops. Pricing is determined on cost-recovery
              plus trainee wage stipends. Exact quotes and custom commission orders are provided upon inquiry.
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-10)' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'transparent' : 'rgba(1, 156, 220, 0.25)',
                  background: selectedCategory === cat ? 'var(--gradient-brand-vibrant)' : 'rgba(255, 255, 255, 0.9)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--color-gray-700)',
                  fontWeight: 700,
                  fontSize: 'var(--font-size-xs)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: selectedCategory === cat ? '0 4px 14px rgba(1, 156, 220, 0.35)' : 'var(--shadow-xs)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner text="Fetching products from database..." />
          ) : (
            <div className="grid-3">
              {displayItems.map((item) => (
                <Card key={item.id} variant="white" hoverable style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Visual Craft Placeholder */}
                  <div
                    style={{
                      height: '190px',
                      background: 'radial-gradient(circle at 50% 50%, rgba(1, 156, 220, 0.12) 0%, rgba(240, 250, 255, 0.6) 100%)',
                      border: '1px solid rgba(1, 156, 220, 0.2)',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--spacing-4)',
                      padding: 'var(--spacing-4)',
                      textAlign: 'center',
                    }}
                  >
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.75" style={{ marginBottom: 'var(--spacing-2)' }}>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                      {item.workshop || item.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                      [Authentic Item Photo Pending]
                    </span>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                      <span className="glow-badge" style={{ fontSize: '10px' }}>{item.category}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 700 }}>Trainee Crafted</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-2)', color: 'var(--color-gray-900)' }}>
                      {item.title || item.name}
                    </h3>

                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', lineHeight: 1.65, marginBottom: 'var(--spacing-4)' }}>
                      {item.description}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-3)', borderTop: '1px solid rgba(1, 156, 220, 0.15)' }}>
                      {item.spec && (
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-4)' }}>
                          <strong>Specifications:</strong> {item.spec}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Link to={`/contact?inquiry=Product+Order:+${encodeURIComponent(item.title || item.name)}`} style={{ flex: 1 }}>
                          <Button variant="primary" size="sm" className="btn-pill" style={{ width: '100%' }}>Inquire Item</Button>
                        </Link>
                        <a
                          href={`${CONTACT_INFO.whatsappLink}%20I%20would%20like%20to%20inquire%20about%20the%20${encodeURIComponent(item.title || item.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="whatsapp" size="sm" className="btn-pill">WhatsApp</Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Custom Bulk Orders Callout */}
          <div
            className="glass-card"
            style={{
              marginTop: 'var(--spacing-16)',
              padding: 'var(--spacing-10)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(240, 250, 255, 0.95) 0%, rgba(244, 250, 254, 0.85) 100%)',
              border: '1px solid rgba(1, 156, 220, 0.25)',
            }}
          >
            <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--color-gray-900)', marginBottom: 'var(--spacing-3)', fontWeight: 800 }}>
              Looking for Custom Bulk Orders or Organization Supplies?
            </h3>
            <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-md)', maxWidth: '660px', margin: '0 auto var(--spacing-6)', lineHeight: 1.7 }}>
              Our workshops in Peshawar accommodate custom specifications for corporate gifts, hospital textile linens,
              office desks, and customized clay decor.
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg" className="btn-pill">Submit Bulk Custom Inquiry</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
