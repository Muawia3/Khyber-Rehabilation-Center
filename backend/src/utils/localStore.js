import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root data directory outside backend folder so backend nodemon watcher never restarts on data updates
const DATA_DIR = path.resolve(__dirname, '../../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_DATA = {
  treatments: [
    {
      id: 'treat-001',
      title: 'Medical Detoxification & Stabilization',
      slug: 'medical-detoxification-stabilization',
      category: 'Inpatient',
      summary: '24/7 medically supervised detoxification protocols, withdrawal symptom management, and somatic stabilization.',
      description: 'Our clinical detoxification unit provides around-the-clock medical supervision, vital signs monitoring, and evidence-based pharmaceutical protocols to safely manage withdrawal symptoms in a secure, dignified setting in Peshawar.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
      order: 1,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'treat-002',
      title: 'Clinical Psychotherapy & CBT',
      slug: 'clinical-psychotherapy-cbt',
      category: 'Therapy',
      summary: 'Individual psychotherapy, Cognitive Behavioral Therapy (CBT), trauma counseling, and emotional regulation.',
      description: 'Licensed clinical psychologists guide patients through structured therapeutic sessions to identify triggers, resolve underlying trauma, reshape negative thinking patterns, and develop sustainable coping mechanisms.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
      order: 2,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'treat-003',
      title: 'Structured Inpatient Rehabilitation',
      slug: 'structured-inpatient-rehabilitation',
      category: 'Inpatient',
      summary: 'Comprehensive 90-day residential program integrating moral rejuvenation, community living, and peer support.',
      description: 'A disciplined, compassionate therapeutic community providing structured daily schedules, group dynamics, spiritual guidance, and healthy lifestyle routines to foster self-esteem and responsibility.',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
      order: 3,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'treat-004',
      title: 'Relapse Prevention & Family Reintegration',
      slug: 'relapse-prevention-family-reintegration',
      category: 'Outpatient',
      summary: 'Long-term aftercare counseling, trigger mapping, family mediation, and post-discharge alumni support.',
      description: 'Addiction recovery extends beyond discharge. We equip recovering individuals with relapse prevention plans, ongoing mentoring, and guided family counseling sessions to mend relationships.',
      imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600',
      order: 4,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],

  skills: [
    {
      id: 'skill-001',
      title: 'Fabric Cut Work - Pattern Drafting & Precision Cutting',
      slug: 'fabric-cut-work-pattern-drafting-precision-cutting',
      category: 'Fabric Cut Work',
      duration: '3 Months',
      description: 'Foundational training in geometric pattern design, fabric grading, precision scissor cutting, and fabric preparation for artisan apparel.',
      order: 1,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'skill-002',
      title: 'Fabric Cut Work - Hand & Machine Cutwork Embroidery',
      slug: 'fabric-cut-work-embroidery',
      category: 'Fabric Cut Work',
      duration: '3 Months',
      description: 'Specialized techniques in intricate cutwork, edge border embroidery, floral eyelet cutwork, and traditional needlework motifs.',
      order: 2,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'skill-003',
      title: 'Fabric Cut Work - Garment Stitching & Tailoring Assembly',
      slug: 'fabric-cut-work-garment-stitching-tailoring',
      category: 'Fabric Cut Work',
      duration: '3 Months',
      description: 'Industrial sewing machine operation, cutwork panel joining, collar attachment, and finishing of regional and modern garments.',
      order: 3,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'skill-004',
      title: 'Fabric Cut Work - Textile Finishing & Quality Control',
      slug: 'fabric-cut-work-finishing-quality-control',
      category: 'Fabric Cut Work',
      duration: '2 Months',
      description: 'Steam pressing, thread trimming, quality inspection, and commercial packaging for cutwork textile goods and customer orders.',
      order: 4,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],

  business: [
    {
      id: 'biz-001',
      name: 'Loader Rickshaw Logistics & Delivery Fleet',
      slug: 'loader-rickshaw-logistics-delivery-fleet',
      category: 'Logistics & Cargo Transit',
      contactPerson: 'Admissions & Enterprise Desk',
      contactPhone: '0300-7335962',
      description: 'Commercial cargo transit and goods distribution service operated by recovering individuals across Peshawar and Charsadda Road, providing safe logistics and dignified earnings.',
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'biz-002',
      name: 'Chinchi Rickshaw Passenger Transit Service',
      slug: 'chinchi-rickshaw-passenger-transit-service',
      category: 'Passenger Transit',
      contactPerson: 'Operations Coordinator',
      contactPhone: '0300-7335962',
      description: 'Community passenger shuttle service on Naguman-Charsadda Road and urban Peshawar corridors, enabling trained alumni to generate stable daily income with pride.',
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'biz-003',
      name: 'Livestock & Dairy Farming Initiative',
      slug: 'livestock-dairy-farming-initiative',
      category: 'Agriculture & Dairy',
      contactPerson: 'Agricultural Supervisor',
      contactPhone: '0300-7335962',
      description: 'Sustainable dairy cattle and goat farming cooperative providing pure milk supply, livestock rearing experience, and long-term agricultural livelihood opportunities.',
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],

  products: [
    {
      id: 'prod-001',
      name: 'Handcrafted Fabric Cutwork Cushion Covers (Set of 2)',
      slug: 'handcrafted-fabric-cutwork-cushion-covers',
      category: 'Fabric Cut Work',
      workshop: 'Fabric Cut Work Department',
      price: '1850',
      description: 'Intricately designed cotton cutwork cushion covers crafted by recovering artisans in our specialized fabric cut work workshop.',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=500',
      isAvailable: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-002',
      name: 'Designer Fabric Cutwork Table Runner & Napkins',
      slug: 'designer-fabric-cutwork-table-runner',
      category: 'Fabric Cut Work',
      workshop: 'Fabric Cut Work Department',
      price: '2400',
      description: 'Premium organic linen table runner featuring traditional geometric cutwork border embroidery and matching hand-stitched napkins.',
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=500',
      isAvailable: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-003',
      name: 'Artisan Cutwork Embroidered Kurta Panels',
      slug: 'artisan-cutwork-embroidered-kurta-panels',
      category: 'Fabric Cut Work',
      workshop: 'Fabric Cut Work Department',
      price: '3200',
      description: 'Masterfully stitched fabric cutwork necklines and sleeve borders prepared for bespoke men and women formal garments.',
      imageUrl: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=500',
      isAvailable: true,
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],

  stories: [
    {
      id: 'story-001',
      title: 'From Darkness to Independence: 150+ Patients Milestone Journey',
      slug: 'from-darkness-to-independence-150-recovered',
      patientIdentifier: 'Recovered Alumnus (Peshawar)',
      recoveryPeriod: '2+ Years Clean',
      category: 'Substance Recovery',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      isConsentGiven: true,
      isFeatured: true,
      isPublished: true,
      story: 'When I was admitted to Khyber Rehabilitation Center at Naguman, Charsadda Road, my health and family relationships were completely shattered. The medical team safely guided me through detoxification. In the Fabric Cut Work workshop, I discovered focus and artistry. Today, I am proud to be among the 150+ recovered patients living with dignity and self-reliance.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'story-002',
      title: 'Earning with Honor Through Loader Rickshaw Logistics',
      slug: 'earning-with-honor-loader-rickshaw',
      patientIdentifier: 'Batch Graduate (85 Programs Completed)',
      recoveryPeriod: '18 Months Clean',
      category: 'Small Business Empowerment',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      isConsentGiven: true,
      isFeatured: true,
      isPublished: true,
      story: 'Completing the rehabilitation program gave me my life back. With the support of our Center, I joined the Loader Rickshaw commercial transit initiative. Operating between Peshawar and Charsadda Road, I earn an honest daily living and proudly support my family without looking back.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'story-003',
      title: 'Finding Peace and Purpose in Livestock Cooperative',
      slug: 'finding-peace-and-purpose-in-livestock',
      patientIdentifier: 'KP Resident Alumnus',
      recoveryPeriod: '14 Months Clean',
      category: 'Livestock & Vocational Enterprise',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      isConsentGiven: true,
      isFeatured: true,
      isPublished: true,
      story: 'The combination of spiritual counseling from our religious teacher, medical monitoring, and hands-on work in the livestock dairy unit restored my peace of mind. Khyber Rehabilitation Center gave me a second chance at life.',
      createdAt: new Date().toISOString(),
    },
  ],

  announcements: [
    {
      id: 'ann-001',
      title: 'Free Family Addiction Awareness & Counseling Seminar',
      slug: 'free-family-addiction-awareness-counseling-seminar',
      category: 'Event',
      content: 'Khyber Rehabilitation Center is hosting a free educational seminar this Saturday for families seeking guidance on early addiction warning signs, intervention strategies, and compassionate intake pathways in Peshawar.',
      startDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ann-002',
      title: 'New Inpatient Rehabilitation & Vocational Batch Open',
      slug: 'new-inpatient-rehabilitation-vocational-batch-open',
      category: 'Admissions',
      content: 'Admissions are currently open for our comprehensive 90-day residential program with medical detoxification and vocational training enrollment. 24/7 helpline is available for confidential intake.',
      startDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],

  inquiries: [],
};

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);
const memoryCache = new Map();

export const localStore = {
  getCollection: (collection) => {
    if (memoryCache.has(collection)) {
      return memoryCache.get(collection);
    }
    const filePath = getFilePath(collection);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        memoryCache.set(collection, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn(`[LocalStore] Failed to read ${collection}.json:`, err.message);
    }
    // Return default and initialize
    const defaults = DEFAULT_DATA[collection] || [];
    localStore.saveCollection(collection, defaults);
    return defaults;
  },

  saveCollection: (collection, items) => {
    memoryCache.set(collection, items);
    const filePath = getFilePath(collection);
    try {
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`[LocalStore] Failed to write ${collection}.json:`, err.message);
      return false;
    }
  },

  addItem: (collection, item) => {
    const items = localStore.getCollection(collection);
    const newItem = {
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    };
    items.unshift(newItem);
    localStore.saveCollection(collection, items);
    return newItem;
  },

  updateItem: (collection, id, updates) => {
    const items = localStore.getCollection(collection);
    const index = items.findIndex((i) => String(i.id) === String(id));
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStore.saveCollection(collection, items);
    return items[index];
  },

  deleteItem: (collection, id) => {
    const items = localStore.getCollection(collection);
    const filtered = items.filter((i) => String(i.id) !== String(id));
    localStore.saveCollection(collection, filtered);
    return true;
  },
};
