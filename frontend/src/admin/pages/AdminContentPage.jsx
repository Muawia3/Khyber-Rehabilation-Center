import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, LoadingSpinner, EmptyState, Modal } from '../../components';
import { useDocumentTitle, useSiteContent } from '../../hooks';
import { contentService } from '../../services/contentService';
import { getFullImageUrl } from '../../utils/imageUrl';
import { Link } from 'react-router-dom';

export const AdminContentPage = () => {
  useDocumentTitle('Full Website Dynamic CMS - Admin Dashboard');
  const {
    navbar,
    footer,
    hero,
    homepageSections,
    homepageIntro,
    homepageStages,
    homepageTreatmentSec,
    homepageSkillsSec,
    homepageStoriesSec,
    homepageCtaSec,
    about,
    contact,
    seo,
    updateSection,
    refreshSiteContent,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState('navbar');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiNotice, setApiNotice] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Local state for dynamic CMS sections
  const [navForm, setNavForm] = useState(navbar);
  const [heroForm, setHeroForm] = useState(hero);
  const [introForm, setIntroForm] = useState(homepageIntro);
  const [stagesForm, setStagesForm] = useState(homepageStages);
  const [treatmentSecForm, setTreatmentSecForm] = useState(homepageTreatmentSec);
  const [skillsSecForm, setSkillsSecForm] = useState(homepageSkillsSec);
  const [storiesSecForm, setStoriesSecForm] = useState(homepageStoriesSec);
  const [ctaSecForm, setCtaSecForm] = useState(homepageCtaSec);
  const [sectionsForm, setSectionsForm] = useState(homepageSections);
  const [aboutForm, setAboutForm] = useState(about);
  const [contactForm, setContactForm] = useState(contact);
  const [footerForm, setFooterForm] = useState(footer);
  const [seoForm, setSeoForm] = useState(seo);

  // Modal State for Database items (treatments, skills, etc.)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Section Modal (for Homepage Builder)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    id: '',
    type: 'custom_cta',
    name: '',
    title: '',
    badge: '',
    content: '',
    buttonText: '',
    buttonLink: '',
    bg: 'light-blue',
    isVisible: true,
  });

  // Nav Item Modal
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [editingNavLink, setEditingNavLink] = useState(null);
  const [navLinkData, setNavLinkData] = useState({
    id: '',
    name: '',
    path: '',
    isVisible: true,
    hasDropdown: false,
  });

  // Value Item Modal (for About page core values)
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [valueData, setValueData] = useState({ id: '', title: '', desc: '' });

  // Sync CMS forms when context updates
  useEffect(() => {
    if (navbar) {
      let bName = navbar.brandName || 'Khyber Rehabilitation Center';
      let bSub = navbar.brandSubtitle || 'Peshawar';
      if (bName === 'Khyber Rehabilitation') bName = 'Khyber Rehabilitation Center';
      if (bSub === 'Center, Peshawar' || bSub === 'Center Peshawar') bSub = 'Peshawar';

      setNavForm({
        ...navbar,
        brandName: bName,
        brandSubtitle: bSub,
        navLinks: (navbar.navLinks || []).filter(
          (l) => l.name !== 'Profiles' && l.name !== 'Profile' && l.path !== '/profiles'
        ),
      });
    } else {
      setNavForm(navbar);
    }
  }, [navbar]);

  useEffect(() => {
    setHeroForm(hero);
  }, [hero]);

  useEffect(() => {
    setIntroForm(homepageIntro);
  }, [homepageIntro]);

  useEffect(() => {
    setStagesForm(homepageStages);
  }, [homepageStages]);

  useEffect(() => {
    setTreatmentSecForm(homepageTreatmentSec);
  }, [homepageTreatmentSec]);

  useEffect(() => {
    setSkillsSecForm(homepageSkillsSec);
  }, [homepageSkillsSec]);

  useEffect(() => {
    setStoriesSecForm(homepageStoriesSec);
  }, [homepageStoriesSec]);

  useEffect(() => {
    setCtaSecForm(homepageCtaSec);
  }, [homepageCtaSec]);

  useEffect(() => {
    setSectionsForm(homepageSections);
  }, [homepageSections]);

  useEffect(() => {
    setAboutForm(about);
  }, [about]);

  useEffect(() => {
    if (contact) {
      let addr = contact.address || '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan';
      if (addr.includes('Naguman, Charsadda Road, Peshawar') && !addr.includes('4JCQ+GGG')) {
        addr = '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan';
      }
      let mapUrl = contact.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.748680789726!2d71.6362626763489!3d34.12130727313203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93f005f326fff%3A0x6b7e8f86574a6d55!2sKHYBER%20REHABILITATION%20CENTRE!5e0!3m2!1sen!2spk!5m2!1sen!2spk';
      if (!mapUrl.includes('0x38d93f005f326fff') && !mapUrl.includes('KHYBER') && !mapUrl.includes('google.com/maps')) {
        mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.748680789726!2d71.6362626763489!3d34.12130727313203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d93f005f326fff%3A0x6b7e8f86574a6d55!2sKHYBER%20REHABILITATION%20CENTRE!5e0!3m2!1sen!2spk!5m2!1sen!2spk';
      }
      setContactForm({ ...contact, address: addr, addressDisplay: addr, mapEmbedUrl: mapUrl });
    } else {
      setContactForm(contact);
    }
  }, [contact]);

  useEffect(() => {
    if (footer) {
      let addr = footer.address || '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan';
      if (addr.includes('Naguman, Charsadda Road, Peshawar') && !addr.includes('4JCQ+GGG')) {
        addr = '4JCQ+GGG, Naguman, Charsadda Rd, near Gulbella, Peshawar, Pakistan';
      }
      setFooterForm({ ...footer, address: addr });
    } else {
      setFooterForm(footer);
    }
  }, [footer]);

  useEffect(() => {
    setSeoForm(seo);
  }, [seo]);

  const tabs = [
    { id: 'navbar', label: 'Navbar & Header', icon: '🌐', group: 'cms' },
    { id: 'homepage', label: 'Homepage & Sections', icon: '🏠', group: 'cms' },
    { id: 'about', label: 'About Us & Values', icon: '📖', group: 'cms' },
    { id: 'treatments', label: 'Treatments', icon: '🩺', group: 'db' },
    { id: 'skills', label: 'Vocational Skills', icon: '🛠️', group: 'db' },
    { id: 'business', label: 'Business Units', icon: '💼', group: 'db' },
    { id: 'products', label: 'Workshop Products', icon: '📦', group: 'db' },
    { id: 'stories', label: 'Success Stories', icon: '🌟', group: 'db' },
    { id: 'announcements', label: 'Announcements', icon: '📢', group: 'db' },
    { id: 'contact', label: 'Contact & Helpline', icon: '📞', group: 'cms' },
    { id: 'footer', label: 'Footer & Layout', icon: '🦶', group: 'cms' },
    { id: 'seo', label: 'SEO & Meta Tags', icon: '🔍', group: 'cms' },
  ];

  // Fetch Database items when DB tabs are active
  const fetchDbItems = () => {
    const isDbTab = ['treatments', 'skills', 'business', 'products', 'stories', 'announcements'].includes(activeTab);
    if (!isDbTab) return;

    setLoading(true);
    setApiNotice(null);

    let fetcher;
    if (activeTab === 'treatments') fetcher = contentService.getTreatments(true);
    else if (activeTab === 'skills') fetcher = contentService.getSkills(true);
    else if (activeTab === 'business') fetcher = contentService.getBusiness(true);
    else if (activeTab === 'products') fetcher = contentService.getProducts(null, true);
    else if (activeTab === 'stories') fetcher = contentService.getStories(false, true);
    else if (activeTab === 'announcements') fetcher = contentService.getAnnouncements(true);

    if (fetcher) {
      fetcher
        .then((res) => {
          setItems(res?.data || []);
        })
        .catch((err) => {
          setApiNotice(err.message || 'Unable to connect to database service.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchDbItems();
  }, [activeTab]);

  // Image Upload Helper
  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setIsSubmitting(true);
        const res = await contentService.uploadImage(reader.result, file.name);
        if (res && res.data && res.data.url) {
          callback(res.data.url);
          setSuccessMessage('Image uploaded successfully to server!');
        } else {
          alert('Upload completed, but no URL was returned.');
        }
      } catch (err) {
        alert(`Image upload failed: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // CMS Save Handlers
  const handleSaveNavbar = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setApiNotice(null);
    try {
      const res = await updateSection('navbar_config', navForm, 'global', 'Navbar & Header Configuration');
      if (res.success) {
        setErrorMessage(null);
        setApiNotice(null);
        setSuccessMessage('Navbar configuration updated successfully and published live!');
        refreshSiteContent();
      } else {
        setSuccessMessage(null);
        setErrorMessage(res.error || 'Failed to update navbar.');
      }
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveHomepage = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setApiNotice(null);
    try {
      await updateSection('homepage_hero', heroForm, 'home', 'Homepage Hero Section');
      await updateSection('homepage_intro', introForm, 'home', 'Homepage Mission & 3 Pillars');
      await updateSection('homepage_stages', stagesForm, 'home', 'Homepage 4 Recovery Stages');
      await updateSection('homepage_treatment_sec', treatmentSecForm, 'home', 'Homepage Treatments Header');
      await updateSection('homepage_skills_sec', skillsSecForm, 'home', 'Homepage Vocational Skills Header');
      await updateSection('homepage_stories_sec', storiesSecForm, 'home', 'Homepage Success Stories Header');
      await updateSection('homepage_cta_sec', ctaSecForm, 'home', 'Homepage Bottom Admissions CTA');
      await updateSection('homepage_sections', sectionsForm, 'home', 'Homepage Layout & Sections Order');
      setErrorMessage(null);
      setApiNotice(null);
      setSuccessMessage('Homepage complete content (every single section, word, and button) saved and published live!');
      refreshSiteContent();
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setApiNotice(null);
    try {
      const res = await updateSection('about_content', aboutForm, 'about', 'About Us & Philosophy');
      if (res.success) {
        setErrorMessage(null);
        setApiNotice(null);
        setSuccessMessage('About Page content and core values saved successfully!');
        refreshSiteContent();
      } else {
        setSuccessMessage(null);
        setErrorMessage(res.error || 'Failed to update about page.');
      }
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveContact = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setApiNotice(null);
    try {
      const res = await updateSection('contact_content', contactForm, 'contact', 'Contact Coordinates & Helpline');
      if (res.success) {
        setErrorMessage(null);
        setApiNotice(null);
        setSuccessMessage('Contact coordinates and admissions helpline updated successfully!');
        refreshSiteContent();
      } else {
        setSuccessMessage(null);
        setErrorMessage(res.error || 'Failed to update contact info.');
      }
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveFooter = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setApiNotice(null);
    try {
      const res = await updateSection('footer_config', footerForm, 'global', 'Footer & Global Layout');
      if (res.success) {
        setErrorMessage(null);
        setApiNotice(null);
        setSuccessMessage('Footer branding, links, and copyright saved successfully!');
        refreshSiteContent();
      } else {
        setSuccessMessage(null);
        setErrorMessage(res.error || 'Failed to update footer.');
      }
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSeo = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setApiNotice(null);
    try {
      const res = await updateSection('seo_content', seoForm, 'seo', 'Site SEO & Metadata');
      if (res.success) {
        setErrorMessage(null);
        setApiNotice(null);
        setSuccessMessage('SEO titles, meta descriptions, and keywords saved successfully!');
        refreshSiteContent();
      } else {
        setSuccessMessage(null);
        setErrorMessage(res.error || 'Failed to update SEO.');
      }
    } catch (err) {
      setSuccessMessage(null);
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nav Links Reordering & Management
  const moveNavLink = (index, direction) => {
    const newLinks = [...(navForm.navLinks || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // Reassign order properties
    newLinks.forEach((item, i) => {
      item.order = i + 1;
    });

    setNavForm({ ...navForm, navLinks: newLinks });
  };

  const toggleNavLinkVisibility = (id) => {
    const updated = (navForm.navLinks || []).map((link) =>
      link.id === id ? { ...link, isVisible: !link.isVisible } : link
    );
    setNavForm({ ...navForm, navLinks: updated });
  };

  const openAddNavLinkModal = () => {
    setEditingNavLink(null);
    setNavLinkData({
      id: `nav-${Date.now()}`,
      name: '',
      path: '',
      isVisible: true,
      hasDropdown: false,
    });
    setIsNavModalOpen(true);
  };

  const openEditNavLinkModal = (link) => {
    setEditingNavLink(link);
    setNavLinkData({ ...link });
    setIsNavModalOpen(true);
  };

  const handleSaveNavLink = (e) => {
    e.preventDefault();
    let updated;
    if (editingNavLink) {
      updated = (navForm.navLinks || []).map((l) => (l.id === editingNavLink.id ? navLinkData : l));
    } else {
      updated = [...(navForm.navLinks || []), { ...navLinkData, order: (navForm.navLinks || []).length + 1 }];
    }
    setNavForm({ ...navForm, navLinks: updated });
    setIsNavModalOpen(false);
  };

  const handleDeleteNavLink = (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from navigation?`)) return;
    const updated = (navForm.navLinks || []).filter((l) => l.id !== id);
    setNavForm({ ...navForm, navLinks: updated });
  };

  // Homepage Sections Reordering & Management
  const moveSection = (index, direction) => {
    const newSections = [...sectionsForm];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((sec, i) => {
      sec.order = i + 1;
    });

    setSectionsForm(newSections);
  };

  const toggleSectionVisibility = (id) => {
    const updated = sectionsForm.map((sec) =>
      sec.id === id ? { ...sec, isVisible: !sec.isVisible } : sec
    );
    setSectionsForm(updated);
  };

  const openAddSectionModal = () => {
    setEditingSection(null);
    setSectionData({
      id: `sec_custom_${Date.now()}`,
      type: 'custom_cta',
      name: 'Custom Call to Action',
      title: 'Take the First Step Toward Healing',
      badge: 'Admission Helpline',
      content: 'Compassionate medical care, detoxification, and psychological therapy available 24 hours a day.',
      buttonText: 'Contact Admissions',
      buttonLink: '/contact',
      bg: 'light-blue',
      isVisible: true,
    });
    setIsSectionModalOpen(true);
  };

  const openEditSectionModal = (sec) => {
    setEditingSection(sec);
    setSectionData({ ...sec });
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    let updated;
    if (editingSection) {
      updated = sectionsForm.map((s) => (s.id === editingSection.id ? sectionData : s));
    } else {
      updated = [...sectionsForm, { ...sectionData, order: sectionsForm.length + 1 }];
    }
    setSectionsForm(updated);
    setIsSectionModalOpen(false);
  };

  const handleDeleteSection = (id, name) => {
    if (!window.confirm(`Are you sure you want to delete custom section "${name}"?`)) return;
    const updated = sectionsForm.filter((s) => s.id !== id);
    setSectionsForm(updated);
  };

  // Core Values Management (About Page)
  const openAddValueModal = () => {
    setEditingValue(null);
    setValueData({ id: `val_${Date.now()}`, title: '', desc: '' });
    setIsValueModalOpen(true);
  };

  const openEditValueModal = (val) => {
    setEditingValue(val);
    setValueData({ ...val });
    setIsValueModalOpen(true);
  };

  const handleSaveValue = (e) => {
    e.preventDefault();
    const currentValues = aboutForm.values || [];
    let updated;
    if (editingValue) {
      updated = currentValues.map((v) => (v.id === editingValue.id ? valueData : v));
    } else {
      updated = [...currentValues, valueData];
    }
    setAboutForm({ ...aboutForm, values: updated });
    setIsValueModalOpen(false);
  };

  const handleDeleteValue = (id) => {
    if (!window.confirm('Are you sure you want to delete this core value?')) return;
    const updated = (aboutForm.values || []).filter((v) => v.id !== id);
    setAboutForm({ ...aboutForm, values: updated });
  };

  // Database Items (Treatments, Skills, Business, Products, Stories, Announcements) Handlers
  const openCreateModal = () => {
    setEditingItem(null);
    if (activeTab === 'treatments') {
      setFormData({ title: '', category: 'Inpatient', summary: '', description: '', imageUrl: '', order: 0, isPublished: true });
    } else if (activeTab === 'skills') {
      setFormData({ title: '', category: 'Carpentry', duration: '3 Months', description: '', order: 0, isPublished: true });
    } else if (activeTab === 'business') {
      setFormData({ name: '', category: 'Handicrafts', contactPerson: '', contactPhone: '', description: '', isPublished: true });
    } else if (activeTab === 'products') {
      setFormData({ name: '', category: 'Woodcrafts', workshop: 'Carpentry Department', price: '', imageUrl: '', description: '', isAvailable: true, isPublished: true });
    } else if (activeTab === 'stories') {
      setFormData({ title: '', patientIdentifier: 'Center Alumnus (Peshawar)', category: 'Substance Recovery', recoveryPeriod: '2+ Years Clean', imageUrl: '', isConsentGiven: true, isFeatured: false, isPublished: true, story: '' });
    } else if (activeTab === 'announcements') {
      setFormData({ title: '', category: 'Notice', imageUrl: '', startDate: '', endDate: '', isPublished: true, content: '' });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleFormFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setApiNotice(null);

    try {
      if (activeTab === 'treatments') {
        if (editingItem) await contentService.updateTreatment(editingItem.id, formData);
        else await contentService.createTreatment(formData);
      } else if (activeTab === 'skills') {
        if (editingItem) await contentService.updateSkill(editingItem.id, formData);
        else await contentService.createSkill(formData);
      } else if (activeTab === 'business') {
        if (editingItem) await contentService.updateBusiness(editingItem.id, formData);
        else await contentService.createBusiness(formData);
      } else if (activeTab === 'products') {
        if (editingItem) await contentService.updateProduct(editingItem.id, formData);
        else await contentService.createProduct(formData);
      } else if (activeTab === 'stories') {
        if (editingItem) await contentService.updateStory(editingItem.id, formData);
        else await contentService.createStory(formData);
      } else if (activeTab === 'announcements') {
        if (editingItem) await contentService.updateAnnouncement(editingItem.id, formData);
        else await contentService.createAnnouncement(formData);
      }

      setSuccessMessage(`${editingItem ? 'Updated' : 'Created'} successfully! Live changes saved to database.`);
      setIsModalOpen(false);
      fetchDbItems();
    } catch (err) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (item) => {
    const updatedStatus = !item.isPublished;
    setErrorMessage(null);
    setApiNotice(null);
    try {
      if (activeTab === 'treatments') await contentService.updateTreatment(item.id, { isPublished: updatedStatus });
      else if (activeTab === 'skills') await contentService.updateSkill(item.id, { isPublished: updatedStatus });
      else if (activeTab === 'business') await contentService.updateBusiness(item.id, { isPublished: updatedStatus });
      else if (activeTab === 'products') await contentService.updateProduct(item.id, { isPublished: updatedStatus });
      else if (activeTab === 'stories') await contentService.updateStory(item.id, { isPublished: updatedStatus });
      else if (activeTab === 'announcements') await contentService.updateAnnouncement(item.id, { isPublished: updatedStatus });

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPublished: updatedStatus } : i))
      );
      setSuccessMessage(`Status updated to ${updatedStatus ? 'Published' : 'Draft'}.`);
    } catch (err) {
      alert(`Failed to update publication status: ${err.message}`);
    }
  };

  const handleDeleteItem = async (item) => {
    const itemName = item.title || item.name;
    if (!window.confirm(`Are you sure you want to permanently delete "${itemName}"?`)) {
      return;
    }

    setErrorMessage(null);
    setApiNotice(null);
    try {
      if (activeTab === 'treatments') await contentService.deleteTreatment(item.id);
      else if (activeTab === 'skills') await contentService.deleteSkill(item.id);
      else if (activeTab === 'business') await contentService.deleteBusiness(item.id);
      else if (activeTab === 'products') await contentService.deleteProduct(item.id);
      else if (activeTab === 'stories') await contentService.deleteStory(item.id);
      else if (activeTab === 'announcements') await contentService.deleteAnnouncement(item.id);

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setSuccessMessage(`"${itemName}" deleted successfully.`);
    } catch (err) {
      alert(`Failed to delete record: ${err.message}`);
    }
  };

  const activeTabMeta = tabs.find((t) => t.id === activeTab);
  const isCmsTab = activeTabMeta?.group === 'cms';

  return (
    <div className="admin-content-page" style={{ paddingBottom: 'var(--spacing-16)' }}>
      {/* Page Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '24px' }}>⚙️</span>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-gray-900)', margin: 0 }}>
              Full Website Content Management System (CMS)
            </h1>
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Every visible element, layout order, branding, and text on the public website can be managed dynamically here.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <Link to="/admin/leadership">
            <Button variant="outline" size="sm">
              👥 Manage Leadership Tree
            </Button>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              👁️ View Live Public Site
            </Button>
          </a>
          {!isCmsTab && (
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              + Add New {activeTabMeta?.label.slice(0, -1) || 'Record'}
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {apiNotice && (
        <Alert type="warning" title="Database Notice">
          {apiNotice}
        </Alert>
      )}

      {successMessage && (
        <Alert type="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert type="danger" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: 'var(--spacing-6)',
          overflowX: 'auto',
          padding: '6px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(230, 246, 254, 0.7) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(1, 156, 220, 0.28)',
          boxShadow: '0 8px 24px -4px rgba(1, 156, 220, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setErrorMessage(null);
              setApiNotice(null);
              setSuccessMessage(null);
            }}
            style={{
              padding: '7px 16px',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              background: activeTab === tab.id ? 'var(--gradient-brand-vibrant)' : 'transparent',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              color: activeTab === tab.id ? '#ffffff' : 'var(--color-gray-600)',
              borderRadius: 'var(--radius-full)',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(1, 156, 220, 0.35)' : 'none',
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: NAVBAR & BRANDING CMS
         ========================================================================= */}
      {activeTab === 'navbar' && (
        <form onSubmit={handleSaveNavbar} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Branding & Logo
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Main website name, subtitle, and brand logo displayed across navigation.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Navbar Changes'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Brand Name (Primary) *</label>
                <input
                  type="text"
                  required
                  value={navForm?.brandName || ''}
                  onChange={(e) => setNavForm({ ...navForm, brandName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand Subtitle / Location *</label>
                <input
                  type="text"
                  required
                  value={navForm?.brandSubtitle || ''}
                  onChange={(e) => setNavForm({ ...navForm, brandSubtitle: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--spacing-3)' }}>
              <label className="form-label">Logo Image URL or Local File Upload</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  style={{ flex: 1, minWidth: '240px' }}
                  placeholder="https://... or upload below"
                  value={navForm?.logoUrl || ''}
                  onChange={(e) => setNavForm({ ...navForm, logoUrl: e.target.value })}
                />
                <label
                  style={{
                    backgroundColor: 'var(--color-gray-100)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--color-gray-300)',
                  }}
                >
                  📁 Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, (url) => setNavForm({ ...navForm, logoUrl: url }))}
                  />
                </label>
              </div>

              {navForm?.logoUrl && (
                <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <img
                    src={navForm.logoUrl}
                    alt="Logo Preview"
                    style={{ maxHeight: '55px', maxWidth: '140px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px' }}
                  />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>Live Logo Preview</span>
                </div>
              )}
            </div>
          </Card>

          {/* Top Emergency Bar */}
          <Card>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-3)', color: 'var(--color-gray-900)' }}>
              Emergency Top Bar & Action Buttons
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Top Bar Location Text</label>
                <input
                  type="text"
                  value={navForm?.topBarText || ''}
                  onChange={(e) => setNavForm({ ...navForm, topBarText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Top Bar Status Badge</label>
                <input
                  type="text"
                  value={navForm?.topBarBadge || ''}
                  onChange={(e) => setNavForm({ ...navForm, topBarBadge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Helpline Phone Number</label>
                <input
                  type="text"
                  value={navForm?.emergencyPhone || ''}
                  onChange={(e) => setNavForm({ ...navForm, emergencyPhone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Helpline Link</label>
                <input
                  type="text"
                  value={navForm?.whatsappLink || ''}
                  onChange={(e) => setNavForm({ ...navForm, whatsappLink: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-gray-100)' }}>
              <div className="form-group">
                <label className="form-label">Action Button Label (e.g. Get Help)</label>
                <input
                  type="text"
                  value={navForm?.actionButtonText || ''}
                  onChange={(e) => setNavForm({ ...navForm, actionButtonText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Action Button Link (e.g. /contact)</label>
                <input
                  type="text"
                  value={navForm?.actionButtonLink || ''}
                  onChange={(e) => setNavForm({ ...navForm, actionButtonLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Leadership Button Label</label>
                <input
                  type="text"
                  value={navForm?.leadershipButtonText || 'Our Leadership'}
                  onChange={(e) => setNavForm({ ...navForm, leadershipButtonText: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={navForm?.showTopBar ?? false}
                    onChange={(e) => setNavForm({ ...navForm, showTopBar: e.target.checked })}
                  />
                  <span>Show Top Notification / Emergency Bar above Navbar</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={navForm?.showLeadershipButton ?? true}
                    onChange={(e) => setNavForm({ ...navForm, showLeadershipButton: e.target.checked })}
                  />
                  <span>Show "Our Leadership" Button in Navbar</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Navigation Links Manager */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Navbar Menu Links (Order, Visibility & Labels)
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Use the arrows (↑ ↓) to reorder menu items or toggle visibility.
                </p>
              </div>
              <Button variant="outline" size="sm" type="button" onClick={openAddNavLinkModal}>
                + Add Navigation Link
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>
                    <th style={{ padding: '8px' }}>Order</th>
                    <th style={{ padding: '8px' }}>Link Name / Label</th>
                    <th style={{ padding: '8px' }}>Target Path</th>
                    <th style={{ padding: '8px' }}>Visibility</th>
                    <th style={{ padding: '8px' }}>Dropdown Menu</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(navForm?.navLinks || []).map((link, index) => (
                    <tr key={link.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveNavLink(index, 'up')}
                            style={{ cursor: index === 0 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', padding: '2px 6px' }}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={index === (navForm?.navLinks || []).length - 1}
                            onClick={() => moveNavLink(index, 'down')}
                            style={{ cursor: index === (navForm?.navLinks || []).length - 1 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', padding: '2px 6px' }}
                          >
                            ↓
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{link.name}</td>
                      <td style={{ padding: '10px 8px', color: 'var(--color-gray-500)', fontFamily: 'monospace' }}>{link.path}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button
                          type="button"
                          onClick={() => toggleNavLinkVisibility(link.id)}
                          style={{
                            backgroundColor: link.isVisible ? '#d1fae5' : '#fee2e2',
                            color: link.isVisible ? '#065f46' : '#991b1b',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '11px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {link.isVisible ? '✓ Visible' : '✗ Hidden'}
                        </button>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {link.hasDropdown ? (
                          <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>Enabled</span>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <Button variant="outline" size="sm" type="button" onClick={() => openEditNavLinkModal(link)}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            style={{ color: '#ef4444' }}
                            onClick={() => handleDeleteNavLink(link.id, link.name)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'right' }}>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving to Database...' : '💾 Save & Publish Navbar Changes'}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* =========================================================================
          TAB 2: HOMEPAGE BUILDER & SECTIONS ORDER
         ========================================================================= */}
      {activeTab === 'homepage' && (
        <form onSubmit={handleSaveHomepage} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {/* Hero Section Card */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Hero Section (Top Welcome Banner)
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage the main hero title, subtitle, buttons, and visual graphics.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Homepage'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Hero Badge / Subtitle Highlight</label>
                <input
                  type="text"
                  value={heroForm?.badge || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Top Status Tagline (e.g. 24/7 Inpatient Care)</label>
                <input
                  type="text"
                  value={heroForm?.badgeTop || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeTop: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--spacing-3)' }}>
              <label className="form-label">Hero Main Title (Supports Line Breaks) *</label>
              <textarea
                rows={2}
                required
                value={heroForm?.title || ''}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle / Description *</label>
              <textarea
                rows={3}
                required
                value={heroForm?.subtitle || ''}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Primary Button Label</label>
                <input
                  type="text"
                  value={heroForm?.primaryBtnText || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryBtnText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Button Link</label>
                <input
                  type="text"
                  value={heroForm?.primaryBtnLink || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryBtnLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Button Label</label>
                <input
                  type="text"
                  value={heroForm?.secondaryBtnText || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Button Link</label>
                <input
                  type="text"
                  value={heroForm?.secondaryBtnLink || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryBtnLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Button Label</label>
                <input
                  type="text"
                  value={heroForm?.whatsappBtnText || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, whatsappBtnText: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-3)' }}>
              <div className="form-group">
                <label className="form-label">Trust Badge 1</label>
                <input
                  type="text"
                  value={heroForm?.badge1 || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, badge1: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trust Badge 2</label>
                <input
                  type="text"
                  value={heroForm?.badge2 || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, badge2: e.target.value })}
                />
              </div>
            </div>

            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-50)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-primary-300)', marginTop: 'var(--spacing-4)' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginTop: 0, marginBottom: 'var(--spacing-3)' }}>
                Hero Card Mission Tagline Box
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-3)' }}>
                <div className="form-group">
                  <label className="form-label">Tagline Label</label>
                  <input
                    type="text"
                    value={heroForm?.cardMissionLabel || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, cardMissionLabel: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tagline Text</label>
                  <input
                    type="text"
                    value={heroForm?.cardMissionText || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, cardMissionText: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--spacing-4)' }}>
              <label className="form-label">Hero Visual / Card Image URL or Upload</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  style={{ flex: 1, minWidth: '240px' }}
                  placeholder="https://... or upload image"
                  value={heroForm?.heroImage || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                />
                <label
                  style={{
                    backgroundColor: 'var(--color-gray-100)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--color-gray-300)',
                  }}
                >
                  📁 Upload Hero Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, (url) => setHeroForm({ ...heroForm, heroImage: url }))}
                  />
                </label>
              </div>

              {heroForm?.heroImage && (
                <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <img
                    src={getFullImageUrl(heroForm.heroImage)}
                    alt="Hero Preview"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo.jpeg';
                    }}
                    style={{ maxHeight: '70px', maxWidth: '140px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px' }}
                  />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>Live Hero Image Preview</span>
                </div>
              )}
            </div>
          </Card>

          {/* Mission & Three Core Pillars Section Card */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Center Mission & Three Core Pillars
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage the introductory mission statement, detailed paragraph, action button, and 3 core pillar cards.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Homepage'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Section Badge / Tagline</label>
                <input
                  type="text"
                  value={introForm?.badge || ''}
                  onChange={(e) => setIntroForm({ ...introForm, badge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Main Title</label>
                <input
                  type="text"
                  value={introForm?.title || ''}
                  onChange={(e) => setIntroForm({ ...introForm, title: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--spacing-3)' }}>
              <label className="form-label">Intro Description / Subtitle</label>
              <textarea
                rows={2}
                value={introForm?.description || ''}
                onChange={(e) => setIntroForm({ ...introForm, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Narrative Paragraph</label>
              <textarea
                rows={3}
                value={introForm?.paragraphText || ''}
                onChange={(e) => setIntroForm({ ...introForm, paragraphText: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Action Button Label</label>
                <input
                  type="text"
                  value={introForm?.btnText || ''}
                  onChange={(e) => setIntroForm({ ...introForm, btnText: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Action Button Link</label>
                <input
                  type="text"
                  value={introForm?.btnLink || ''}
                  onChange={(e) => setIntroForm({ ...introForm, btnLink: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-5)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-gray-200)' }}>
              <div className="form-group" style={{ marginBottom: 'var(--spacing-4)' }}>
                <label className="form-label" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Pillars Box Title</label>
                <input
                  type="text"
                  value={introForm?.pillarsTitle || ''}
                  onChange={(e) => setIntroForm({ ...introForm, pillarsTitle: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)' }}>
                {/* Pillar 1 */}
                <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-primary-100)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-50)' }}>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Pillar 1 Title</label>
                    <input
                      type="text"
                      value={introForm?.pillar1Title || ''}
                      onChange={(e) => setIntroForm({ ...introForm, pillar1Title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>Pillar 1 Description</label>
                    <textarea
                      rows={2}
                      value={introForm?.pillar1Desc || ''}
                      onChange={(e) => setIntroForm({ ...introForm, pillar1Desc: e.target.value })}
                    />
                  </div>
                </div>

                {/* Pillar 2 */}
                <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-primary-100)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-50)' }}>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Pillar 2 Title</label>
                    <input
                      type="text"
                      value={introForm?.pillar2Title || ''}
                      onChange={(e) => setIntroForm({ ...introForm, pillar2Title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>Pillar 2 Description</label>
                    <textarea
                      rows={2}
                      value={introForm?.pillar2Desc || ''}
                      onChange={(e) => setIntroForm({ ...introForm, pillar2Desc: e.target.value })}
                    />
                  </div>
                </div>

                {/* Pillar 3 */}
                <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-primary-100)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-50)' }}>
                  <div className="form-group" style={{ marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Pillar 3 Title</label>
                    <input
                      type="text"
                      value={introForm?.pillar3Title || ''}
                      onChange={(e) => setIntroForm({ ...introForm, pillar3Title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>Pillar 3 Description</label>
                    <textarea
                      rows={2}
                      value={introForm?.pillar3Desc || ''}
                      onChange={(e) => setIntroForm({ ...introForm, pillar3Desc: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Four-Stage Recovery Pathway Section Card */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Four-Stage Recovery Pathway
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage the roadmap badge, heading, description, and every step's title, number, and explanation.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Homepage'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Roadmap Badge</label>
                <input
                  type="text"
                  value={stagesForm?.badge || ''}
                  onChange={(e) => setStagesForm({ ...stagesForm, badge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Roadmap Title</label>
                <input
                  type="text"
                  value={stagesForm?.title || ''}
                  onChange={(e) => setStagesForm({ ...stagesForm, title: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 'var(--spacing-3)' }}>
              <label className="form-label">Roadmap Subtitle / Description</label>
              <textarea
                rows={2}
                value={stagesForm?.description || ''}
                onChange={(e) => setStagesForm({ ...stagesForm, description: e.target.value })}
              />
            </div>

            <div style={{ marginTop: 'var(--spacing-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
              {/* Stage 1 */}
              <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '60px' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Step #</label>
                    <input
                      type="text"
                      value={stagesForm?.stage1Step || '01'}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage1Step: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Stage 1 Title</label>
                    <input
                      type="text"
                      value={stagesForm?.stage1Title || ''}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage1Title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Stage 1 Description</label>
                  <textarea
                    rows={3}
                    value={stagesForm?.stage1Desc || ''}
                    onChange={(e) => setStagesForm({ ...stagesForm, stage1Desc: e.target.value })}
                  />
                </div>
              </div>

              {/* Stage 2 */}
              <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '60px' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Step #</label>
                    <input
                      type="text"
                      value={stagesForm?.stage2Step || '02'}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage2Step: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Stage 2 Title</label>
                    <input
                      type="text"
                      value={stagesForm?.stage2Title || ''}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage2Title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Stage 2 Description</label>
                  <textarea
                    rows={3}
                    value={stagesForm?.stage2Desc || ''}
                    onChange={(e) => setStagesForm({ ...stagesForm, stage2Desc: e.target.value })}
                  />
                </div>
              </div>

              {/* Stage 3 */}
              <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '60px' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Step #</label>
                    <input
                      type="text"
                      value={stagesForm?.stage3Step || '03'}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage3Step: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Stage 3 Title</label>
                    <input
                      type="text"
                      value={stagesForm?.stage3Title || ''}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage3Title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Stage 3 Description</label>
                  <textarea
                    rows={3}
                    value={stagesForm?.stage3Desc || ''}
                    onChange={(e) => setStagesForm({ ...stagesForm, stage3Desc: e.target.value })}
                  />
                </div>
              </div>

              {/* Stage 4 */}
              <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '60px' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Step #</label>
                    <input
                      type="text"
                      value={stagesForm?.stage4Step || '04'}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage4Step: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Stage 4 Title</label>
                    <input
                      type="text"
                      value={stagesForm?.stage4Title || ''}
                      onChange={(e) => setStagesForm({ ...stagesForm, stage4Title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Stage 4 Description</label>
                  <textarea
                    rows={3}
                    value={stagesForm?.stage4Desc || ''}
                    onChange={(e) => setStagesForm({ ...stagesForm, stage4Desc: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section Headers & Exploration Buttons */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Homepage Showcase Section Headers & Links
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Control the badges, titles, descriptions, and button links for Treatments, Vocational Skills, and Success Stories sections.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Homepage'}
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
              {/* Treatments Showcase Header */}
              <div style={{ padding: 'var(--spacing-4)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-gray-50)' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-primary)', marginTop: 0, marginBottom: 'var(--spacing-3)' }}>
                  🩺 Treatments Section Header
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Badge</label>
                    <input
                      type="text"
                      value={treatmentSecForm?.badge || ''}
                      onChange={(e) => setTreatmentSecForm({ ...treatmentSecForm, badge: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={treatmentSecForm?.title || ''}
                      onChange={(e) => setTreatmentSecForm({ ...treatmentSecForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Label</label>
                    <input
                      type="text"
                      value={treatmentSecForm?.btnText || ''}
                      onChange={(e) => setTreatmentSecForm({ ...treatmentSecForm, btnText: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Link</label>
                    <input
                      type="text"
                      value={treatmentSecForm?.btnLink || ''}
                      onChange={(e) => setTreatmentSecForm({ ...treatmentSecForm, btnLink: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--spacing-2)' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    value={treatmentSecForm?.description || ''}
                    onChange={(e) => setTreatmentSecForm({ ...treatmentSecForm, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Skills Showcase Header */}
              <div style={{ padding: 'var(--spacing-4)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-gray-50)' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-primary)', marginTop: 0, marginBottom: 'var(--spacing-3)' }}>
                  🛠️ Vocational Skills (Fabric Cut Work) Section Header
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Badge</label>
                    <input
                      type="text"
                      value={skillsSecForm?.badge || ''}
                      onChange={(e) => setSkillsSecForm({ ...skillsSecForm, badge: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={skillsSecForm?.title || ''}
                      onChange={(e) => setSkillsSecForm({ ...skillsSecForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Label</label>
                    <input
                      type="text"
                      value={skillsSecForm?.btnText || ''}
                      onChange={(e) => setSkillsSecForm({ ...skillsSecForm, btnText: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Link</label>
                    <input
                      type="text"
                      value={skillsSecForm?.btnLink || ''}
                      onChange={(e) => setSkillsSecForm({ ...skillsSecForm, btnLink: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--spacing-2)' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    value={skillsSecForm?.description || ''}
                    onChange={(e) => setSkillsSecForm({ ...skillsSecForm, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Stories Showcase Header */}
              <div style={{ padding: 'var(--spacing-4)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-gray-50)' }}>
                <h4 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-primary)', marginTop: 0, marginBottom: 'var(--spacing-3)' }}>
                  🌟 Success Stories Section Header
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-3)' }}>
                  <div className="form-group">
                    <label className="form-label">Badge</label>
                    <input
                      type="text"
                      value={storiesSecForm?.badge || ''}
                      onChange={(e) => setStoriesSecForm({ ...storiesSecForm, badge: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={storiesSecForm?.title || ''}
                      onChange={(e) => setStoriesSecForm({ ...storiesSecForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Label</label>
                    <input
                      type="text"
                      value={storiesSecForm?.btnText || ''}
                      onChange={(e) => setStoriesSecForm({ ...storiesSecForm, btnText: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Button Link</label>
                    <input
                      type="text"
                      value={storiesSecForm?.btnLink || ''}
                      onChange={(e) => setStoriesSecForm({ ...storiesSecForm, btnLink: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 'var(--spacing-2)' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    value={storiesSecForm?.description || ''}
                    onChange={(e) => setStoriesSecForm({ ...storiesSecForm, description: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Admissions Bottom Call-to-Action Banner Card */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Admissions Bottom Call-to-Action Banner
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage the full-width admissions helpline banner at the bottom of the homepage.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Homepage'}
              </Button>
            </div>

            <div className="form-group">
              <label className="form-label">Banner Title</label>
              <input
                type="text"
                value={ctaSecForm?.title || ''}
                onChange={(e) => setCtaSecForm({ ...ctaSecForm, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Banner Description</label>
              <textarea
                rows={2}
                value={ctaSecForm?.description || ''}
                onChange={(e) => setCtaSecForm({ ...ctaSecForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Primary Button Label</label>
                <input
                  type="text"
                  value={ctaSecForm?.primaryBtnText || ''}
                  onChange={(e) => setCtaSecForm({ ...ctaSecForm, primaryBtnText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Button Link</label>
                <input
                  type="text"
                  value={ctaSecForm?.primaryBtnLink || ''}
                  onChange={(e) => setCtaSecForm({ ...ctaSecForm, primaryBtnLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Button Label</label>
                <input
                  type="text"
                  value={ctaSecForm?.whatsappBtnText || ''}
                  onChange={(e) => setCtaSecForm({ ...ctaSecForm, whatsappBtnText: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Section Reorder & Visibility Builder */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Homepage Reusable Sections Builder & Ordering
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Reorder sections using (↑ ↓), show/hide sections, or add new custom reusable CTA & narrative text blocks.
                </p>
              </div>
              <Button variant="primary" size="sm" type="button" onClick={openAddSectionModal}>
                + Add Custom Section
              </Button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--font-size-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-gray-200)', color: 'var(--color-gray-600)' }}>
                    <th style={{ padding: '8px' }}>Order</th>
                    <th style={{ padding: '8px' }}>Section Name</th>
                    <th style={{ padding: '8px' }}>Section Type</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionsForm.map((sec, index) => {
                    const isCustom = sec.type === 'custom_cta' || sec.type === 'custom_text';
                    return (
                      <tr key={sec.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveSection(index, 'up')}
                              style={{ cursor: index === 0 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', padding: '2px 6px' }}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={index === sectionsForm.length - 1}
                              onClick={() => moveSection(index, 'down')}
                              style={{ cursor: index === sectionsForm.length - 1 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', padding: '2px 6px' }}
                            >
                              ↓
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '10px 8px', fontWeight: 600 }}>
                          {sec.name}
                          {isCustom && <span style={{ marginLeft: '6px', fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px' }}>Custom</span>}
                        </td>
                        <td style={{ padding: '10px 8px', color: 'var(--color-gray-500)', fontFamily: 'monospace' }}>
                          {sec.type}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <button
                            type="button"
                            onClick={() => toggleSectionVisibility(sec.id)}
                            style={{
                              backgroundColor: sec.isVisible ? '#d1fae5' : '#fee2e2',
                              color: sec.isVisible ? '#065f46' : '#991b1b',
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '11px',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {sec.isVisible ? '✓ Visible' : '✗ Hidden'}
                          </button>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {isCustom ? (
                              <>
                                <Button variant="outline" size="sm" type="button" onClick={() => openEditSectionModal(sec)}>
                                  Edit Content
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  style={{ color: '#ef4444' }}
                                  onClick={() => handleDeleteSection(sec.id, sec.name)}
                                >
                                  Delete
                                </Button>
                              </>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>System Component</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'right' }}>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving to Database...' : '💾 Save & Publish Homepage Layout'}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* =========================================================================
          TAB 3: ABOUT US & CORE VALUES CMS
         ========================================================================= */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  About Page Banner & Narrative Story
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Edit institutional narrative, founding purpose, mission, and vision.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save About Page'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Banner Subtitle / Category</label>
                <input
                  type="text"
                  value={aboutForm?.bannerSubtitle || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, bannerSubtitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={aboutForm?.bannerTitle || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, bannerTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Banner Description</label>
              <textarea
                rows={2}
                value={aboutForm?.bannerDesc || ''}
                onChange={(e) => setAboutForm({ ...aboutForm, bannerDesc: e.target.value })}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Story Section Title</label>
                <input
                  type="text"
                  value={aboutForm?.storyTitle || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Story Paragraph 1 *</label>
                <textarea
                  rows={3}
                  required
                  value={aboutForm?.storyP1 || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyP1: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Story Paragraph 2</label>
                <textarea
                  rows={3}
                  value={aboutForm?.storyP2 || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyP2: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institutional Governance Notice</label>
                <input
                  type="text"
                  value={aboutForm?.storyNotice || ''}
                  onChange={(e) => setAboutForm({ ...aboutForm, storyNotice: e.target.value })}
                />
              </div>
            </div>

            {/* Mission & Vision */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)', borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <div>
                <div className="form-group">
                  <label className="form-label">Mission Title</label>
                  <input
                    type="text"
                    value={aboutForm?.missionTitle || 'Our Mission'}
                    onChange={(e) => setAboutForm({ ...aboutForm, missionTitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mission Statement *</label>
                  <textarea
                    rows={4}
                    required
                    value={aboutForm?.missionText || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, missionText: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">Vision Title</label>
                  <input
                    type="text"
                    value={aboutForm?.visionTitle || 'Our Vision'}
                    onChange={(e) => setAboutForm({ ...aboutForm, visionTitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vision Statement *</label>
                  <textarea
                    rows={4}
                    required
                    value={aboutForm?.visionText || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, visionText: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Core Values Management */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Core Institutional Values ({aboutForm?.values?.length || 0})
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage the core ethical values and principles displayed on the About page.
                </p>
              </div>
              <Button variant="outline" size="sm" type="button" onClick={openAddValueModal}>
                + Add Core Value
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-3)' }}>
              {(aboutForm?.values || []).map((val) => (
                <div
                  key={val.id}
                  style={{
                    backgroundColor: 'var(--color-gray-50)',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-gray-200)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                      {val.title}
                    </strong>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.5 }}>
                      {val.desc}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: 'var(--spacing-3)' }}>
                    <Button variant="ghost" size="sm" type="button" onClick={() => openEditValueModal(val)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      style={{ color: '#ef4444' }}
                      onClick={() => handleDeleteValue(val.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'right' }}>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save & Publish About Us Page'}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* =========================================================================
          TAB 4: CONTACT & HELPLINE CMS
         ========================================================================= */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Contact Information & Coordinates
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage addresses, emergency helpline, WhatsApp link, and care timings.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Contact Details'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={contactForm?.bannerTitle || ''}
                  onChange={(e) => setContactForm({ ...contactForm, bannerTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Subtitle</label>
                <input
                  type="text"
                  value={contactForm?.bannerSubtitle || ''}
                  onChange={(e) => setContactForm({ ...contactForm, bannerSubtitle: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Banner Description</label>
              <textarea
                rows={2}
                value={contactForm?.bannerDesc || ''}
                onChange={(e) => setContactForm({ ...contactForm, bannerDesc: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)', borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Center Facility Physical Address *</label>
                <textarea
                  rows={2}
                  required
                  value={contactForm?.address || ''}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admissions & Emergency Line *</label>
                <input
                  type="text"
                  required
                  value={contactForm?.phone || ''}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Support Phone</label>
                <input
                  type="text"
                  value={contactForm?.whatsapp || ''}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Direct Link</label>
                <input
                  type="text"
                  value={contactForm?.whatsappLink || ''}
                  onChange={(e) => setContactForm({ ...contactForm, whatsappLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Email Address</label>
                <input
                  type="email"
                  value={contactForm?.email || ''}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Care Timings / Operating Hours</label>
                <input
                  type="text"
                  value={contactForm?.hours || ''}
                  onChange={(e) => setContactForm({ ...contactForm, hours: e.target.value })}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Google Maps Embed URL (iframe source)</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/maps?..."
                  value={contactForm?.mapEmbedUrl || ''}
                  onChange={(e) => setContactForm({ ...contactForm, mapEmbedUrl: e.target.value })}
                />
                <span className="form-help">Paste Google Maps embed URL to render interactive map on contact page.</span>
              </div>

              {contactForm?.mapEmbedUrl && (
                <div style={{ marginTop: 'var(--spacing-3)', height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
                  <iframe
                    src={contactForm.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    title="Map Preview"
                  />
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Confidentiality & Emergency Notice</label>
                <textarea
                  rows={2}
                  value={contactForm?.confidentialityNotice || ''}
                  onChange={(e) => setContactForm({ ...contactForm, confidentialityNotice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Facility Gate & Verification Note</label>
                <textarea
                  rows={2}
                  value={contactForm?.locationNote || ''}
                  onChange={(e) => setContactForm({ ...contactForm, locationNote: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'right' }}>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save & Publish Contact Coordinates'}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* =========================================================================
          TAB 5: FOOTER & GLOBAL LAYOUT CMS
         ========================================================================= */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Footer Branding, Copy & Accreditation
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Manage the footer title, summary copy, accreditation badge, and copyright notices.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save Footer'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Footer Title *</label>
                <input
                  type="text"
                  required
                  value={footerForm?.title || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline *</label>
                <input
                  type="text"
                  required
                  value={footerForm?.tagline || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, tagline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">About Center Brief (Footer Column 1) *</label>
              <textarea
                rows={3}
                required
                value={footerForm?.text || ''}
                onChange={(e) => setFooterForm({ ...footerForm, text: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)', borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label">Accreditation Badge Text</label>
                <input
                  type="text"
                  value={footerForm?.badge || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, badge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copyright Notice Text</label>
                <input
                  type="text"
                  value={footerForm?.copyright || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Footer Center Address</label>
                <input
                  type="text"
                  value={footerForm?.address || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Footer Phone</label>
                <input
                  type="text"
                  value={footerForm?.phone || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Footer Inpatient Care Timings</label>
                <input
                  type="text"
                  value={footerForm?.hours || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, hours: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'right' }}>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save & Publish Footer Changes'}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* =========================================================================
          TAB 6: SEO & METADATA CMS
         ========================================================================= */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSeo} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Search Engine Optimization (SEO) & Social Sharing
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginTop: '2px' }}>
                  Control default page titles, search engine descriptions, keywords, and OpenGraph social preview images.
                </p>
              </div>
              <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save SEO Settings'}
              </Button>
            </div>

            <div className="form-group">
              <label className="form-label">Default Page Title *</label>
              <input
                type="text"
                required
                value={seoForm?.defaultTitle || ''}
                onChange={(e) => setSeoForm({ ...seoForm, defaultTitle: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta Description (Shown on Google search results) *</label>
              <textarea
                rows={3}
                required
                value={seoForm?.metaDescription || ''}
                onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta Keywords (Comma separated)</label>
              <input
                type="text"
                value={seoForm?.metaKeywords || ''}
                onChange={(e) => setSeoForm({ ...seoForm, metaKeywords: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ borderTop: '1px solid var(--color-gray-100)', marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)' }}>
              <label className="form-label">Social Share OG Image URL or Upload</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  style={{ flex: 1, minWidth: '240px' }}
                  placeholder="https://... or upload image"
                  value={seoForm?.ogImage || ''}
                  onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                />
                <label
                  style={{
                    backgroundColor: 'var(--color-gray-100)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid var(--color-gray-300)',
                  }}
                >
                  📁 Upload OG Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, (url) => setSeoForm({ ...seoForm, ogImage: url }))}
                  />
                </label>
              </div>

              {seoForm?.ogImage && (
                <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <img
                    src={seoForm.ogImage}
                    alt="OG Preview"
                    style={{ maxHeight: '70px', maxWidth: '140px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px' }}
                  />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>Social Share Preview Image</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'right' }}>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : '💾 Save & Publish SEO Metadata'}
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* =========================================================================
          DATABASE TABS: Treatments, Skills, Business, Products, Stories, Announcements
         ========================================================================= */}
      {!isCmsTab && (
        <Card>
          {loading ? (
            <div style={{ padding: 'var(--spacing-12) 0' }}>
              <LoadingSpinner text={`Loading ${activeTabMeta?.label}...`} />
            </div>
          ) : items.length > 0 ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-4)',
                }}
              >
                <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0, color: 'var(--color-gray-900)' }}>
                  Database Records ({items.length})
                </h3>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                  All updates appear immediately on the public website
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '2px solid var(--color-gray-200)',
                        color: 'var(--color-gray-600)',
                      }}
                    >
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Title / Name</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Category / Workshop</th>
                      {activeTab === 'products' && (
                        <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Price (PKR)</th>
                      )}
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>Status</th>
                      <th style={{ padding: 'var(--spacing-3) var(--spacing-2)', textAlign: 'right' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: '1px solid var(--color-gray-100)' }}
                      >
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 600 }}>
                          {item.title || item.name}
                          {item.patientIdentifier && (
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                color: 'var(--color-gray-500)',
                                fontWeight: 400,
                              }}
                            >
                              Anonymized: {item.patientIdentifier}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                          <span
                            style={{
                              backgroundColor: 'var(--color-gray-100)',
                              color: 'var(--color-gray-700)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '11px',
                              fontWeight: 500,
                            }}
                          >
                            {item.category || item.workshop || 'General'}
                          </span>
                        </td>

                        {activeTab === 'products' && (
                          <td style={{ padding: 'var(--spacing-3) var(--spacing-2)', fontWeight: 600 }}>
                            {item.price ? `Rs. ${item.price}` : 'Price on Inquiry'}
                          </td>
                        )}

                        <td style={{ padding: 'var(--spacing-3) var(--spacing-2)' }}>
                          <button
                            onClick={() => handleTogglePublish(item)}
                            title="Click to toggle publication"
                            style={{
                              backgroundColor: item.isPublished ? '#d1fae5' : '#fee2e2',
                              color: item.isPublished ? '#065f46' : '#991b1b',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '11px',
                              fontWeight: 600,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {item.isPublished ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        <td
                          style={{
                            padding: 'var(--spacing-3) var(--spacing-2)',
                            textAlign: 'right',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                            <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ color: '#ef4444' }}
                              onClick={() => handleDeleteItem(item)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              title={`No ${activeTabMeta?.label} in Database`}
              description={`No database records are currently registered in this section. Use the "+ Add New" button above to publish new content.`}
              action={
                <Button variant="primary" size="sm" onClick={openCreateModal}>
                  + Add First {activeTabMeta?.label.slice(0, -1) || 'Item'}
                </Button>
              }
            />
          )}
        </Card>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}

      {/* Navigation Link Add/Edit Modal */}
      <Modal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        title={editingNavLink ? 'Edit Navigation Link' : 'Add New Navigation Link'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsNavModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveNavLink}>
              Save Link
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveNavLink} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div className="form-group">
            <label className="form-label">Link Label / Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Services, About"
              value={navLinkData.name}
              onChange={(e) => setNavLinkData({ ...navLinkData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target URL Path *</label>
            <input
              type="text"
              required
              placeholder="e.g. /treatment or /about"
              value={navLinkData.path}
              onChange={(e) => setNavLinkData({ ...navLinkData, path: e.target.value })}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={navLinkData.isVisible}
              onChange={(e) => setNavLinkData({ ...navLinkData, isVisible: e.target.checked })}
            />
            <span>Visible in Main Navbar</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={navLinkData.hasDropdown}
              onChange={(e) => setNavLinkData({ ...navLinkData, hasDropdown: e.target.checked })}
            />
            <span>Has Dropdown Menu (e.g. Profiles dropdown)</span>
          </label>
        </form>
      </Modal>

      {/* Homepage Custom Section Add/Edit Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title={editingSection ? 'Edit Homepage Section' : 'Add New Homepage Section'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveSection}>
              Save Section
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveSection} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div className="form-group">
            <label className="form-label">Section Name / Admin Identifier *</label>
            <input
              type="text"
              required
              placeholder="e.g. Summer Awareness CTA"
              value={sectionData.name}
              onChange={(e) => setSectionData({ ...sectionData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reusable Section Type</label>
            <select
              value={sectionData.type}
              onChange={(e) => setSectionData({ ...sectionData, type: e.target.value })}
            >
              <option value="custom_cta">Call to Action (CTA Banner with Button)</option>
              <option value="custom_text">Narrative Content (Headline + Text Paragraphs)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Section Badge (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Admissions Helpline"
              value={sectionData.badge || ''}
              onChange={(e) => setSectionData({ ...sectionData, badge: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Main Heading / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Start Your Journey to Recovery"
              value={sectionData.title || ''}
              onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content / Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed section narrative..."
              value={sectionData.content || ''}
              onChange={(e) => setSectionData({ ...sectionData, content: e.target.value })}
            />
          </div>

          {sectionData.type === 'custom_cta' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <div className="form-group">
                <label className="form-label">Button Label</label>
                <input
                  type="text"
                  placeholder="e.g. Contact Now"
                  value={sectionData.buttonText || ''}
                  onChange={(e) => setSectionData({ ...sectionData, buttonText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  placeholder="e.g. /contact"
                  value={sectionData.buttonLink || ''}
                  onChange={(e) => setSectionData({ ...sectionData, buttonLink: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Background Style</label>
            <select
              value={sectionData.bg || 'light-blue'}
              onChange={(e) => setSectionData({ ...sectionData, bg: e.target.value })}
            >
              <option value="light-blue">Soft Light Blue (#F0F9FF)</option>
              <option value="white">Pure White (#FFFFFF)</option>
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={sectionData.isVisible}
              onChange={(e) => setSectionData({ ...sectionData, isVisible: e.target.checked })}
            />
            <span>Publish & Show on Homepage</span>
          </label>
        </form>
      </Modal>

      {/* Core Value Modal */}
      <Modal
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
        title={editingValue ? 'Edit Core Value' : 'Add New Core Value'}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsValueModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveValue}>
              Save Value
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveValue} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div className="form-group">
            <label className="form-label">Value Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. 1. Human Dignity & Empathy"
              value={valueData.title}
              onChange={(e) => setValueData({ ...valueData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Value Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe this core ethical principle..."
              value={valueData.desc}
              onChange={(e) => setValueData({ ...valueData, desc: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Database Item Modal (Treatments, Skills, Business, Products, Stories, Announcements) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingItem ? 'Edit' : 'Create New'} ${activeTabMeta?.label.slice(0, -1) || 'Item'}`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleFormSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving to Database...' : editingItem ? 'Save Changes' : 'Create Record'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {/* Treatments Form */}
          {activeTab === 'treatments' && (
            <>
              <div className="form-group">
                <label className="form-label">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Detoxification & Stabilization"
                  value={formData.title || ''}
                  onChange={(e) => handleFormFieldChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={formData.category || 'Inpatient'}
                  onChange={(e) => handleFormFieldChange('category', e.target.value)}
                >
                  <option value="Inpatient">Inpatient Rehabilitation</option>
                  <option value="Detox">Medical Detoxification</option>
                  <option value="Outpatient">Outpatient Consultation</option>
                  <option value="Therapy">Psychological Therapy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Summary (Card Highlight) *</label>
                <input
                  type="text"
                  required
                  placeholder="Brief 1-line program summary..."
                  value={formData.summary || ''}
                  onChange={(e) => handleFormFieldChange('summary', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Clinical Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed treatment curriculum and recovery methodology..."
                  value={formData.description || ''}
                  onChange={(e) => handleFormFieldChange('description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL or Local Upload</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    style={{ flex: 1 }}
                    placeholder="https://..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleFormFieldChange('imageUrl', e.target.value)}
                  />
                  <label style={{ backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #d1d5db', fontSize: '12px' }}>
                    📁 Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => handleFormFieldChange('imageUrl', url))}
                    />
                  </label>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublished ?? true}
                  onChange={(e) => handleFormFieldChange('isPublished', e.target.checked)}
                />
                <span>Publish Immediately on Public Website</span>
              </label>
            </>
          )}

          {/* Skills Form */}
          {activeTab === 'skills' && (
            <>
              <div className="form-group">
                <label className="form-label">Vocational Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wood Furniture & Carpentry Mastery"
                  value={formData.title || ''}
                  onChange={(e) => handleFormFieldChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carpentry, IT, Tailoring, Electrical"
                  value={formData.category || ''}
                  onChange={(e) => handleFormFieldChange('category', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 3 Months, 6 Months"
                  value={formData.duration || ''}
                  onChange={(e) => handleFormFieldChange('duration', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Curriculum & Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="What students learn during rehabilitation training..."
                  value={formData.description || ''}
                  onChange={(e) => handleFormFieldChange('description', e.target.value)}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublished ?? true}
                  onChange={(e) => handleFormFieldChange('isPublished', e.target.checked)}
                />
                <span>Publish Course on Public Website</span>
              </label>
            </>
          )}

          {/* Business Initiatives Form */}
          {activeTab === 'business' && (
            <>
              <div className="form-group">
                <label className="form-label">Business Initiative Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Woodcraft Artisan Cooperative"
                  value={formData.name || ''}
                  onChange={(e) => handleFormFieldChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Woodcrafts, Textiles, Agriculture"
                  value={formData.category || ''}
                  onChange={(e) => handleFormFieldChange('category', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person & Phone</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={formData.contactPerson || ''}
                    onChange={(e) => handleFormFieldChange('contactPerson', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={formData.contactPhone || ''}
                    onChange={(e) => handleFormFieldChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Initiative Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Objective, economic integration model, and employment support..."
                  value={formData.description || ''}
                  onChange={(e) => handleFormFieldChange('description', e.target.value)}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublished ?? true}
                  onChange={(e) => handleFormFieldChange('isPublished', e.target.checked)}
                />
                <span>Publish on Public Website</span>
              </label>
            </>
          )}

          {/* Products Form */}
          {activeTab === 'products' && (
            <>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handcrafted Teak Wooden Tray"
                  value={formData.name || ''}
                  onChange={(e) => handleFormFieldChange('name', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category || 'Woodcrafts'}
                    onChange={(e) => handleFormFieldChange('category', e.target.value)}
                  >
                    <option value="Woodcrafts">Woodcrafts</option>
                    <option value="Textiles">Textiles & Tailoring</option>
                    <option value="Handicrafts">Handicrafts & Art</option>
                    <option value="Leather">Leather Goods</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (PKR) (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1500"
                    value={formData.price || ''}
                    onChange={(e) => handleFormFieldChange('price', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Manufacturing Workshop</label>
                <input
                  type="text"
                  placeholder="e.g. Center Carpentry Workshop"
                  value={formData.workshop || ''}
                  onChange={(e) => handleFormFieldChange('workshop', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL or Upload</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    style={{ flex: 1 }}
                    placeholder="https://..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleFormFieldChange('imageUrl', e.target.value)}
                  />
                  <label style={{ backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #d1d5db', fontSize: '12px' }}>
                    📁 Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => handleFormFieldChange('imageUrl', url))}
                    />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Handmade dimensions, materials, and artisan background..."
                  value={formData.description || ''}
                  onChange={(e) => handleFormFieldChange('description', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable ?? true}
                    onChange={(e) => handleFormFieldChange('isAvailable', e.target.checked)}
                  />
                  <span>Available in Stock</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => handleFormFieldChange('isPublished', e.target.checked)}
                  />
                  <span>Publish in Catalog</span>
                </label>
              </div>
            </>
          )}

          {/* Success Stories Form */}
          {activeTab === 'stories' && (
            <>
              <div className="form-group">
                <label className="form-label">Story Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. From Addiction to Master Craftsman"
                  value={formData.title || ''}
                  onChange={(e) => handleFormFieldChange('title', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <div className="form-group">
                  <label className="form-label">Anonymized Patient Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alumnus (Peshawar), Workshop Graduate"
                    value={formData.patientIdentifier || ''}
                    onChange={(e) => handleFormFieldChange('patientIdentifier', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Recovery Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2+ Years Sobriety, 18 Months Clean"
                    value={formData.recoveryPeriod || ''}
                    onChange={(e) => handleFormFieldChange('recoveryPeriod', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Success Narrative & Reflection *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Inspirational journey through treatment, vocational empowerment, and societal reintegration..."
                  value={formData.story || ''}
                  onChange={(e) => handleFormFieldChange('story', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    style={{ flex: 1 }}
                    placeholder="https://..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleFormFieldChange('imageUrl', e.target.value)}
                  />
                  <label style={{ backgroundColor: '#f3f4f6', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: '1px solid #d1d5db', fontSize: '12px' }}>
                    📁 Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => handleFormFieldChange('imageUrl', url))}
                    />
                  </label>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-primary-50)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-primary-200)',
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    required
                    checked={formData.isConsentGiven ?? true}
                    onChange={(e) => handleFormFieldChange('isConsentGiven', e.target.checked)}
                  />
                  <span>✓ Informed Consent Given (Patient approved public reflection without real identity)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => handleFormFieldChange('isFeatured', e.target.checked)}
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => handleFormFieldChange('isPublished', e.target.checked)}
                  />
                  <span>Publish Story</span>
                </label>
              </div>
            </>
          )}

          {/* Announcements Form */}
          {activeTab === 'announcements' && (
            <>
              <div className="form-group">
                <label className="form-label">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Family Addiction Awareness Workshop this Saturday"
                  value={formData.title || ''}
                  onChange={(e) => handleFormFieldChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={formData.category || 'Notice'}
                  onChange={(e) => handleFormFieldChange('category', e.target.value)}
                >
                  <option value="Notice">General Notice</option>
                  <option value="Hiring">Hiring & Career Opportunity</option>
                  <option value="Event">Community Event & Workshop</option>
                  <option value="Admissions">New Admissions Open</option>
                  <option value="News">Center Press Release</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleFormFieldChange('startDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => handleFormFieldChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Announcement Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full text and event details..."
                  value={formData.content || ''}
                  onChange={(e) => handleFormFieldChange('content', e.target.value)}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublished ?? true}
                  onChange={(e) => handleFormFieldChange('isPublished', e.target.checked)}
                />
                <span>Active Public Announcement (Will automatically expire after end date)</span>
              </label>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
