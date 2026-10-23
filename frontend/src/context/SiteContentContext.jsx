import React, { createContext, useContext, useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import logoImg from '../assets/logo.jpeg';

export const SiteContentContext = createContext(null);

export const DEFAULT_SITE_CONTENT = {
  navbar_config: {
    brandName: 'Khyber Rehabilitation Center',
    brandSubtitle: 'Peshawar',
    logoUrl: logoImg,
    topBarText: 'Naguman, Charsadda Road, Peshawar',
    topBarBadge: '150+ Recovered',
    emergencyPhone: '0300-7335962',
    whatsappLink: 'https://wa.me/923007335962?text=Hello%20Khyber%20Rehabilitation%20Center,%20I%20would%20like%20to%20inquire%20about%20your%20services.',
    actionButtonText: 'Get Help',
    actionButtonLink: '/contact',
    showLeadershipButton: true,
    leadershipButtonText: 'Our Leadership',
    showTopBar: false,
    navLinks: [
      { id: 'nav-1', name: 'Home', path: '/', isVisible: true, order: 1 },
      { id: 'nav-2', name: 'About', path: '/about', isVisible: true, order: 2 },
      { id: 'nav-3', name: 'Treatment', path: '/treatment', isVisible: true, order: 3 },
      { id: 'nav-4', name: 'Skills Development', path: '/skills', isVisible: true, order: 4 },
      { id: 'nav-5', name: 'Business', path: '/business', isVisible: true, order: 5 },
      { id: 'nav-6', name: 'Success Stories', path: '/success-stories', isVisible: true, order: 6 },
      { id: 'nav-7', name: 'Contact', path: '/contact', isVisible: true, order: 7 },
    ],
  },

  footer_config: {
    title: 'Khyber Rehabilitation Center',
    tagline: 'Restoring Health, Rebuilding Lives',
    text: 'Dedicated to providing clinical detoxification, structured psychological therapy, Fabric Cut Work skills training, and small business empowerment (Loader & Chinchi Rickshaw, Livestock) in Peshawar.',
    badge: '150+ Patients Recovered • 85+ Programs Completed',
    address: '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan',
    phone: '0300-7335962',
    whatsappDisplay: '0300-7335962',
    whatsappLink: 'https://wa.me/923007335962?text=Hello%20Khyber%20Rehabilitation%20Center,%20I%20would%20like%20to%20inquire%20about%20your%20services.',
    email: 'info.krcpeshawar@gmail.com',
    hours: 'Inpatient Care: 24/7 | Clinical Consultations: Mon - Sat 9:00 AM - 5:00 PM',
    copyright: 'Khyber Rehabilitation Center, Peshawar. All rights reserved.',
    note: 'Confidential & Dignified Care',
  },

  homepage_hero: {
    badge: '150+ Patients Recovered • 85+ Programs Completed',
    badgeTop: '24/7 Inpatient Care',
    title: 'Restoring Dignity, Rebuilding Lives in Peshawar',
    subtitle: 'A medically supervised rehabilitation center located at 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan. We offer evidence-based detoxification, clinical psychotherapy, Fabric Cut Work vocational training, and sustainable small business initiatives.',
    primaryBtnText: '24/7 Helpline: 0300-7335962',
    primaryBtnLink: '/contact',
    secondaryBtnText: 'Explore Our Programs',
    secondaryBtnLink: '/treatment',
    whatsappBtnText: 'WhatsApp Support',
    badge1: '100% Confidential Care',
    badge2: 'Emergency 24/7 Admissions',
    showTrustBadges: true,
    showFloatingChips: false,
    showCardMission: true,
    cardMissionLabel: 'Clinical Mission:',
    cardMissionText: 'Healing body, mind, and spirit through medical supervision, psychological counseling, and vocational trades.',
    heroImage: '',
    bgTheme: 'white',
  },

  homepage_intro: {
    badge: 'Our Mission in Peshawar',
    title: 'A Dignified Path Toward Permanent Sobriety',
    description: 'At Khyber Rehabilitation Center, we treat individuals suffering from addiction and mental health challenges with unconditional empathy and clinical rigor.',
    paragraphText: 'Addiction is a chronic disease requiring structured medical stabilization, psychiatric psychotherapy, family counseling, and socio-economic support. Our multidisciplinary team works tirelessly to restore self-respect.',
    btnText: 'Learn More About Our Center',
    btnLink: '/about',
    pillarsTitle: 'Our Three Core Pillars',
    pillar1Title: '1. Medical Detoxification',
    pillar1Desc: 'Supervised clinical withdrawal in safe residential facilities with 24/7 vitals surveillance.',
    pillar2Title: '2. Psychological Psychotherapy',
    pillar2Desc: 'Cognitive Behavioral Therapy (CBT), trauma counseling, and personalized relapse prevention plans.',
    pillar3Title: '3. Fabric Cut Work & Small Businesses',
    pillar3Desc: 'Specialized Fabric Cut Work craftsmanship and sustainable small businesses (Loader Rickshaws, Chinchi Rickshaws, Livestock) empowering patients with self-reliance.',
  },

  homepage_stages: {
    badge: 'Roadmap to Freedom',
    title: 'The Four-Stage Recovery Pathway',
    description: 'Our multidisciplinary framework guiding individuals from physical withdrawal to economic autonomy.',
    stage1Step: '01',
    stage1Title: 'Medical Assessment & Detoxification',
    stage1Desc: 'Direct medical supervision by qualified doctors and round-the-clock nursing care to manage withdrawal symptoms safely and with dignity.',
    stage2Step: '02',
    stage2Title: 'Psychotherapy & Spiritual Counseling',
    stage2Desc: 'Clinical psychology sessions combined with moral and ethical guidance from our dedicated religious teacher.',
    stage3Step: '03',
    stage3Title: 'Fabric Cut Work & Vocational Skills',
    stage3Desc: 'Specialized fabric cutting, pattern designing, and textile tailoring skills to empower patients with marketable craftsmanship.',
    stage4Step: '04',
    stage4Title: 'Small Business Empowerment & Reintegration',
    stage4Desc: 'Sustainable livelihood pathways including Loader Rickshaw, Chinchi Rickshaw, and Livestock management for 150+ recovered alumni.',
  },

  homepage_treatment_sec: {
    badge: 'Clinical Care & Recovery',
    title: 'Structured Treatment Programs',
    description: 'Evidence-based clinical rehabilitation programs designed to ensure safety and sustainable healing.',
    btnText: 'View All Treatment Programs',
    btnLink: '/treatment',
  },

  homepage_skills_sec: {
    badge: 'Trade Skills & Sustainable Livelihood',
    title: 'Fabric Cut Work & Vocational Empowerment',
    description: 'Recovering patients learn specialized Fabric Cut Work, precision pattern drafting, cutwork embroidery, and tailoring.',
    btnText: 'Explore All Skill Programs',
    btnLink: '/skills',
  },

  homepage_stories_sec: {
    badge: '150+ Recovered Patients Milestone',
    title: 'Stories of Recovery & Reintegration',
    description: 'Celebrating over 150+ patients recovered and 85+ programs completed through clinical detoxification, Fabric Cut Work, and small-business units in Peshawar.',
    btnText: 'Read Full Stories →',
    btnLink: '/success-stories',
  },

  homepage_cta_sec: {
    title: 'Ready to Take the First Step Toward Recovery?',
    description: 'Our medical team and admissions counselors are available 24/7 in Peshawar to assist you with compassionate, strictly confidential intake.',
    primaryBtnText: 'Contact Admissions Office',
    primaryBtnLink: '/contact',
    whatsappBtnText: 'WhatsApp Helpline',
  },

  homepage_sections: [
    { id: 'sec_hero', type: 'hero', name: 'Hero Welcome Banner', isVisible: true, order: 1 },
    { id: 'sec_announcements', type: 'announcements', name: 'Urgent Announcements & News', isVisible: true, order: 2 },
    { id: 'sec_intro', type: 'intro', name: 'Center Mission & Philosophy', isVisible: true, order: 3 },
    { id: 'sec_treatment', type: 'treatment', name: 'Rehabilitation Programs Showcase', isVisible: true, order: 4 },
    { id: 'sec_stages', type: 'stages', name: 'Four-Stage Recovery Pathway', isVisible: true, order: 5 },
    { id: 'sec_skills', type: 'skills', name: 'Fabric Cut Work & Trade Units', isVisible: true, order: 6 },
    { id: 'sec_stories', type: 'stories', name: 'Patient Recovery Journeys (150+ Recovered)', isVisible: true, order: 7 },
    { id: 'sec_cta', type: 'cta', name: 'Admissions & Help Banner', isVisible: true, order: 8 },
  ],

  about_content: {
    bannerSubtitle: '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan',
    bannerTitle: 'About Khyber Rehabilitation Center',
    bannerDesc: 'Located at 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan, we are dedicated to clinical rehabilitation, fabric crafts training, and patient reintegration.',
    storyBadge: 'Our Story & Purpose',
    storyTitle: 'Compassionate Rehabilitation Grounded in Dignity',
    storyP1: 'Located at 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan, Khyber Rehabilitation Center was established with an unwavering conviction: that every person caught in the cycle of substance dependence deserves dignified, compassionate, and clinically rigorous care.',
    storyP2: 'With over 150+ patients successfully recovered and 85+ programs completed, our center addresses the full person: physical detoxification, mental and psychological healing, moral rejuvenation, and sustainable vocational empowerment.',
    storyNotice: 'Operating under professional clinical governance at 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan.',
    missionTitle: 'Our Mission',
    missionText: 'To deliver comprehensive medical and psychological rehabilitation that heals individuals, supports families, and equips patients with Fabric Cut Work skills and small-business opportunities (Loader Rickshaws, Chinchi, Livestock) for permanent self-reliance.',
    visionTitle: 'Our Vision',
    visionText: 'A compassionate society where addiction is recognized and treated without stigma, and where every recovering individual in Khyber Pakhtunkhwa has access to pathways for sustainable livelihood, self-reliance, and family honor.',
    valuesTitle: 'Our Core Values',
    values: [
      { id: 'v1', title: '1. Dignity & Empathy', desc: 'Every patient is treated with unconditional human empathy, confidentiality, and respect, free from shame.' },
      { id: 'v2', title: '2. Clinical & Medical Care', desc: 'Evidence-based detoxification protocols supervised by doctors, round-the-clock nursing care, and clinical psychologists.' },
      { id: 'v3', title: '3. Economic Self-Reliance', desc: 'Equipping patients with Fabric Cut Work skills and practical small businesses (Loader Rickshaw, Chinchi, Livestock).' },
      { id: 'v4', title: '4. Spiritual & Moral Guidance', desc: 'Dedicated religious teachers providing spiritual counseling, ethical guidance, and inner peace.' },
      { id: 'v5', title: '5. Relapse Prevention & Aftercare', desc: 'Over 150+ patients recovered through structured long-term mentoring and family reconciliation.' },
      { id: 'v6', title: '6. Transparency & Security', desc: 'Round-the-clock facility security guards and honest communication with patient families.' },
    ],
  },

  contact_content: {
    title: 'Emergency Admissions & Consultation',
    subtitle: 'We are here 24 hours a day, 7 days a week to support you and your family.',
    phoneDisplay: '0300-7335962',
    phone: '0300-7335962',
    whatsappDisplay: '0300-7335962',
    whatsapp: '0300-7335962',
    whatsappLink: 'https://wa.me/923007335962?text=Hello%20Khyber%20Rehabilitation%20Center,%20I%20would%20like%20to%20inquire%20about%20your%20services.',
    emailDisplay: 'info.krcpeshawar@gmail.com',
    email: 'info.krcpeshawar@gmail.com',
    addressDisplay: '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan',
    address: '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan',
    bannerTitle: 'Contact Khyber Rehabilitation Center',
    bannerSubtitle: 'Admissions Helpline: 0300-7335962',
    bannerDesc: 'Our admissions coordinators and medical team at 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan are available 24/7 for confidential consultations.',
    hours: 'Inpatient Care: 24/7 | Clinical Consultations: Mon - Sat 9:00 AM - 5:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.748680789726!2d71.6362626763489!3d34.12130727313203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93f005f326fff%3A0x6b7e8f86574a6d55!2sKHYBER%20REHABILITATION%20CENTRE!5e0!3m2!1sen!2spk!5m2!1sen!2spk',
    confidentialNotice: 'All inquiries and clinical communications are protected by strict healthcare confidentiality protocols. Inpatient admissions are accepted 24 hours a day, 7 days a week.',
    locationNote: 'Our center is located at 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan. Dedicated transport assistance and patient reception are coordinated 24/7 via 0300-7335962.',
  },

  seo_content: {
    defaultTitle: 'Khyber Rehabilitation Center | 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar',
    metaDescription: 'Khyber Rehabilitation Center, 4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar - Restoring Health, Rebuilding Lives. 150+ patients recovered, 85+ programs completed. Helpline: 0300-7335962.',
    metaKeywords: 'Khyber Rehabilitation Center, 4JCQ+GGG Naguman Charsadda Rd Peshawar, Addiction Recovery Peshawar, 0300-7335962, Fabric Cut Work, Loader Rickshaw, Chinchi Rickshaw, Livestock',
    ogImage: logoImg,
  },
};

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const base = { ...DEFAULT_SITE_CONTENT };
    try {
      if (typeof window !== 'undefined') {
        const local = JSON.parse(localStorage.getItem('khyber_site_content') || '{}');
        Object.keys(local).forEach((key) => {
          const val = local[key];
          if (val !== undefined && val !== null) {
            if (typeof val === 'object' && !Array.isArray(val) && typeof base[key] === 'object') {
              base[key] = { ...base[key], ...val };
            } else {
              base[key] = val;
            }
          }
        });
      }
    } catch (e) {
      console.warn('[SiteContent] LocalStorage parse warning:', e);
    }
    return base;
  });

  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await contentService.getSiteContent();

      let localEdits = {};
      try {
        if (typeof window !== 'undefined') {
          localEdits = JSON.parse(localStorage.getItem('khyber_site_content') || '{}');
        }
      } catch {}

      if (res && res.data) {
        setContent((prev) => {
          const merged = { ...prev };
          // 1. Overlay server data
          Object.keys(res.data).forEach((key) => {
            const val = res.data[key];
            if (val !== undefined && val !== null) {
              if (typeof val === 'object' && !Array.isArray(val) && typeof prev[key] === 'object') {
                merged[key] = { ...prev[key], ...val };
              } else {
                merged[key] = val;
              }
            }
          });

          // 2. Overlay any active client local edits so unsynced changes are never lost
          Object.keys(localEdits).forEach((key) => {
            const val = localEdits[key];
            if (val !== undefined && val !== null) {
              if (typeof val === 'object' && !Array.isArray(val) && typeof merged[key] === 'object') {
                merged[key] = { ...merged[key], ...val };
              } else {
                merged[key] = val;
              }
            }
          });

          if (merged.navbar_config?.navLinks) {
            merged.navbar_config.navLinks = merged.navbar_config.navLinks.filter(
              (l) => l.name !== 'Profiles' && l.name !== 'Profile' && l.path !== '/profiles'
            );
          }
          return merged;
        });
      }
    } catch {
      // Keep defaults & localEdits active if backend is temporarily unreachable
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Update a single section optimistically and persist via API & LocalStorage
  const updateSection = async (key, sectionData, sectionName = 'global', title = '') => {
    // 1. Update React state immediately
    setContent((prev) => ({
      ...prev,
      [key]: sectionData,
    }));

    // 2. Persist to localStorage immediately
    try {
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem('khyber_site_content') || '{}');
        stored[key] = sectionData;
        localStorage.setItem('khyber_site_content', JSON.stringify(stored));
      }
    } catch (e) {
      console.warn('[SiteContent] LocalStorage write error:', e);
    }

    // 3. Persist to backend server API
    try {
      const res = await contentService.upsertContent({
        key,
        section: sectionName,
        title: title || key.replace(/_/g, ' ').toUpperCase(),
        content: sectionData,
      });
      return { success: true, data: res?.data };
    } catch (err) {
      console.warn(`[SiteContent] Server sync notice for section ${key}:`, err.message);
      // Still success because it is safely persisted locally in localStorage and in memory
      return { success: true, warning: err.message };
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        loading,
        isInitialized,
        refreshSiteContent: fetchContent,
        updateSection,
        navbar: content.navbar_config || DEFAULT_SITE_CONTENT.navbar_config,
        footer: content.footer_config || DEFAULT_SITE_CONTENT.footer_config,
        hero: content.homepage_hero || DEFAULT_SITE_CONTENT.homepage_hero,
        homepageSections: content.homepage_sections || DEFAULT_SITE_CONTENT.homepage_sections,
        homepageIntro: content.homepage_intro || DEFAULT_SITE_CONTENT.homepage_intro,
        homepageStages: content.homepage_stages || DEFAULT_SITE_CONTENT.homepage_stages,
        homepageTreatmentSec: content.homepage_treatment_sec || DEFAULT_SITE_CONTENT.homepage_treatment_sec,
        homepageSkillsSec: content.homepage_skills_sec || DEFAULT_SITE_CONTENT.homepage_skills_sec,
        homepageStoriesSec: content.homepage_stories_sec || DEFAULT_SITE_CONTENT.homepage_stories_sec,
        homepageCtaSec: content.homepage_cta_sec || DEFAULT_SITE_CONTENT.homepage_cta_sec,
        about: content.about_content || DEFAULT_SITE_CONTENT.about_content,
        contact: content.contact_content || DEFAULT_SITE_CONTENT.contact_content,
        seo: content.seo_content || DEFAULT_SITE_CONTENT.seo_content,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
