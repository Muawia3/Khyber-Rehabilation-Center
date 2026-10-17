/**
 * Database Seed Script for Khyber Rehabilitation Center
 * Creates initial administrator account strictly from configured environment variables.
 * Does not insert fake patient records, fabricated reviews, or dummy data.
 *
 * Execution command: npm run db:seed
 */

import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Khyber Rehabilitation Center: Database Seeding ---');

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Center Administrator';

  if (!adminEmail || !adminPassword) {
    console.log(
      'Notice: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD are not set in .env.\n' +
      'Skipping initial admin creation to prevent hardcoded credentials.\n' +
      'To seed an admin account, set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD in your .env file and run again.'
    );
    return;
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: {
      fullName: adminName,
      passwordHash: passwordHash,
      isActive: true,
    },
    create: {
      email: adminEmail.toLowerCase().trim(),
      fullName: adminName,
      passwordHash: passwordHash,
      role: 'SUPERADMIN',
      isActive: true,
    },
  });

  console.log(`[Seed Success] Administrator account configured for: ${admin.email}`);

  // Seed initial leadership hierarchy if empty
  const leadershipCount = await prisma.leadershipMember.count();
  if (leadershipCount === 0) {
    console.log('Seeding initial organizational leadership hierarchy...');
    const ceo = await prisma.leadershipMember.create({
      data: {
        name: 'Dr. Tariq Khan',
        designation: 'Chief Executive Officer (CEO) & Founder',
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
        bio: 'Visionary founder dedicated to compassionate addiction rehabilitation, evidence-based clinical detox protocols, and social empowerment across Khyber Pakhtunkhwa.',
        order: 0,
        isPublished: true,
      },
    });

    const medDir = await prisma.leadershipMember.create({
      data: {
        name: 'Dr. Shahab Ahmad',
        designation: 'Director of Clinical & Medical Services',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        bio: 'Oversees 24/7 medically supervised detoxification, somatic stabilization, and psychiatric evaluations.',
        order: 1,
        isPublished: true,
        parentId: ceo.id,
      },
    });

    const psyLead = await prisma.leadershipMember.create({
      data: {
        name: 'Ms. Ayesha Siddiqui',
        designation: 'Head of Clinical Psychology & Psychotherapy',
        photo: 'https://images.unsplash.com/photo-1594824813689-566c5d946914?auto=format&fit=crop&q=80&w=400',
        bio: 'Directs Cognitive Behavioral Therapy (CBT), trauma counseling, and family reconciliation programs.',
        order: 2,
        isPublished: true,
        parentId: ceo.id,
      },
    });

    const vocHead = await prisma.leadershipMember.create({
      data: {
        name: 'Engr. Farooq Marwat',
        designation: 'Head of Vocational Training & Enterprise',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        bio: 'Leads trade skill workshops in carpentry, tailoring, and IT to prepare recovering individuals for financial independence.',
        order: 3,
        isPublished: true,
        parentId: ceo.id,
      },
    });

    await prisma.leadershipMember.create({
      data: {
        name: 'Dr. Bilal Yousafzai',
        designation: 'Senior Inpatient Medical Officer',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
        bio: 'Responsible for round-the-clock physical health monitoring and withdrawal symptom management.',
        order: 1,
        isPublished: true,
        parentId: medDir.id,
      },
    });

    console.log('[Seed Success] Initial leadership hierarchy created.');
  }

main()
  .catch((e) => {
    console.error('[Seed Error] Failed to execute database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
