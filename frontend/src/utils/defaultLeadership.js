// Default institutional leadership hierarchy exactly matching center specifications:
// CEO (Gul Dast / Guldees, Peshawar)
//   ↳ Chairman
//       ↳ Doctor -> Nurse 1 -> Nurse 2 -> Nurse 3
//       ↳ Admin -> Security Guards -> SG (Staff)
//       ↳ Psychologist
//       ↳ Religious Teacher

export const DEFAULT_LEADERSHIP_MEMBERS = [
  {
    id: 'ceo-leader-001',
    name: 'Gul Dast / Guldees',
    designation: 'Chief Executive Officer (CEO) & Founder',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    bio: 'Chief Executive Officer & Founder guiding clinical rehabilitation, ethical standards, and patient empowerment in Peshawar.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 0,
    isPublished: true,
    parentId: null,
  },
  {
    id: 'chairman-002',
    name: 'Executive Chairman',
    designation: 'Chairman of the Board & Executive Governance',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Oversees operational execution, institutional governance, and alignment across clinical and vocational departments.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'ceo-leader-001',
  },
  {
    id: 'doctor-003',
    name: 'Chief Medical Officer (Doctor)',
    designation: 'Doctor / Medical Director',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Responsible for medically supervised detoxification, vital stabilization, and physician supervision of all inpatients.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'chairman-002',
  },
  {
    id: 'nurse-004',
    name: 'Head Nurse (Nurse 1)',
    designation: 'Head Nurse / Inpatient Supervisor',
    photo: 'https://images.unsplash.com/photo-1594824813689-566c5d946914?auto=format&fit=crop&q=80&w=400',
    bio: 'Supervises daily inpatient clinical care, intake medication administration, and vital signs assessment.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'doctor-003',
  },
  {
    id: 'nurse-005',
    name: 'Staff Nurse (Nurse 2)',
    designation: 'Staff Clinical Nurse',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Dedicated round-the-clock physical health monitoring and withdrawal stabilization assistance.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'nurse-004',
  },
  {
    id: 'nurse-006',
    name: 'Inpatient Care Nurse (Nurse 3)',
    designation: 'Assistant Inpatient Nurse',
    photo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400',
    bio: 'Assists patients with bedside clinical support, hydration, nutrition, and compassionate care.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'nurse-005',
  },
  {
    id: 'admin-007',
    name: 'Director of Administration (Admin)',
    designation: 'Facility Administrator & Operations In-Charge',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Directs center logistics, admissions desk, facility hygiene, residential nutrition, and security coordination.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 2,
    isPublished: true,
    parentId: 'chairman-002',
  },
  {
    id: 'sec-guard-008',
    name: 'Security Guards (Supervisor)',
    designation: 'Head of Facility Security',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'Supervises entrance gate security, visitor screening, and patient safety protocols.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'admin-007',
  },
  {
    id: 'sec-guard-009',
    name: 'Security Guards (SG Staff)',
    designation: 'Residential Security Guard (SG Staff)',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    bio: '24/7 vigilant surveillance, gate access verification, and maintaining a secure healing environment.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 1,
    isPublished: true,
    parentId: 'sec-guard-008',
  },
  {
    id: 'psy-lead-010',
    name: 'Clinical Psychologist',
    designation: 'Head of Psychology & Psychotherapy',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Directs Cognitive Behavioral Therapy (CBT), individual psycho-counseling, trauma recovery, and family reconciliation.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 3,
    isPublished: true,
    parentId: 'chairman-002',
  },
  {
    id: 'rel-teacher-011',
    name: 'Religious Teacher',
    designation: 'Spiritual Counselor & Islamic Ethics Mentor',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    bio: 'Provides daily spiritual counseling, moral rejuvenation, Islamic ethics, and spiritual healing.',
    email: 'info.krcpeshawar@gmail.com',
    phone: '0300-7335962',
    order: 4,
    isPublished: true,
    parentId: 'chairman-002',
  },
];

export const buildHierarchyTree = (items = []) => {
  if (!items || items.length === 0) return [];
  const itemMap = {};
  const rootNodes = [];

  items.forEach((item) => {
    itemMap[item.id] = { ...item, children: [] };
  });

  items.forEach((item) => {
    if (item.parentId && itemMap[item.parentId]) {
      itemMap[item.parentId].children.push(itemMap[item.id]);
    } else {
      rootNodes.push(itemMap[item.id]);
    }
  });

  const sortTreeNodes = (nodes) => {
    nodes.sort((a, b) => (a.order || 0) - (b.order || 0));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortTreeNodes(node.children);
      }
    });
  };

  sortTreeNodes(rootNodes);
  return rootNodes;
};

export const DEFAULT_LEADERSHIP_TREE = buildHierarchyTree(DEFAULT_LEADERSHIP_MEMBERS);
