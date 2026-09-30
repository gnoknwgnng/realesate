import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { pool, query, isDbConnected, initDb } from '../server/db';
import { uploadToR2, isR2Configured } from '../server/r2';
import { store } from '../server/data/store';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://aeifhcefqohynganitxo.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlaWZoY2VmcW9oeW5nYW5pdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzE2NTMsImV4cCI6MjA1ODU0NzY1M30.4qF_C_9dF0YFhZqLqYmY0K2dZ7tQ9L4uV5eK8mZ6sR0';

console.log('=====================================================');
console.log('🔄 SUPABASE TO POSTGRESQL & CLOUDFLARE R2 MIGRATION');
console.log('=====================================================');
console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`Database Mode: ${process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('user:password') ? 'Live PostgreSQL' : 'Local Persistence Store'}`);
console.log(`Storage Mode: ${isR2Configured ? 'Live Cloudflare R2' : 'Local Media Store'}`);
console.log('-----------------------------------------------------\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface MigrationStats {
  propertiesExtracted: number;
  propertiesMigrated: number;
  imagesTransferredToR2: number;
  inquiriesMigrated: number;
  leadsMigrated: number;
  favoritesMigrated: number;
  errors: string[];
}

const stats: MigrationStats = {
  propertiesExtracted: 0,
  propertiesMigrated: 0,
  imagesTransferredToR2: 0,
  inquiriesMigrated: 0,
  leadsMigrated: 0,
  favoritesMigrated: 0,
  errors: [],
};

// Helper: Download image buffer from external URL
async function downloadImageBuffer(url: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MedProperties-Migration-Tool/1.0' } });
    if (!res.ok) {
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = res.headers.get('content-type') || 'image/jpeg';
    return { buffer, mimeType };
  } catch (err: any) {
    return null;
  }
}

async function runMigration() {
  try {
    // 1. Initialize DB schema if live PostgreSQL is connected
    try {
      await initDb();
    } catch (e: any) {
      console.log('Database init warning:', e.message);
    }

    // 2. Extract properties from Supabase
    console.log('📥 Step 1: Extracting properties from Supabase...');
    const { data: properties, error: propErr } = await supabase
      .from('properties')
      .select('*');

    if (propErr) {
      throw new Error(`Failed to fetch properties from Supabase: ${propErr.message}`);
    }

    stats.propertiesExtracted = properties?.length || 0;
    console.log(`Found ${stats.propertiesExtracted} properties in Supabase.`);

    // 3. Process each property & migrate images to R2
    console.log('\n📦 Step 2: Migrating properties & media to PostgreSQL & Cloudflare R2...');
    for (const prop of properties || []) {
      try {
        let r2Key = '';
        let r2Url = prop.image_url;

        // Transfer image to Cloudflare R2
        if (prop.image_url && (prop.image_url.startsWith('http://') || prop.image_url.startsWith('https://'))) {
          console.log(`  Transferring media for "${prop.title}"...`);
          const imgData = await downloadImageBuffer(prop.image_url);
          if (imgData) {
            const fileName = `${prop.id}.jpg`;
            const uploadRes = await uploadToR2(imgData.buffer, fileName, imgData.mimeType, 'properties');
            r2Key = uploadRes.key;
            r2Url = uploadRes.url;
            stats.imagesTransferredToR2++;
            console.log(`  ✓ Transferred image to R2: ${r2Url}`);
          } else {
            console.log(`  ⚠️ Could not download external image, retaining original URL: ${prop.image_url}`);
          }
        }

        // Insert or update in PostgreSQL
        if (isDbConnected()) {
          const insertPropSql = `
            INSERT INTO properties (
              id, title, address, city, state, price, period, beds, baths,
              dimensions, image_url, is_popular, category, property_type,
              description, hospital_distance, virtual_tour_url, owner_email,
              owner_id, status, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, COALESCE($21, NOW()), NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              address = EXCLUDED.address,
              city = EXCLUDED.city,
              state = EXCLUDED.state,
              price = EXCLUDED.price,
              period = EXCLUDED.period,
              beds = EXCLUDED.beds,
              baths = EXCLUDED.baths,
              dimensions = EXCLUDED.dimensions,
              image_url = EXCLUDED.image_url,
              is_popular = EXCLUDED.is_popular,
              category = EXCLUDED.category,
              property_type = EXCLUDED.property_type,
              description = EXCLUDED.description,
              hospital_distance = EXCLUDED.hospital_distance,
              virtual_tour_url = EXCLUDED.virtual_tour_url,
              owner_email = EXCLUDED.owner_email,
              owner_id = EXCLUDED.owner_id,
              status = EXCLUDED.status,
              updated_at = NOW()
          `;

          await query(insertPropSql, [
            prop.id,
            prop.title,
            prop.address,
            prop.city,
            prop.state,
            prop.price,
            prop.period,
            prop.beds,
            prop.baths,
            prop.dimensions,
            r2Url,
            prop.is_popular || false,
            prop.category,
            prop.property_type,
            prop.description,
            prop.hospital_distance,
            prop.virtual_tour_url,
            prop.owner_email,
            prop.owner_id,
            prop.status || 'active',
            prop.created_at,
          ]);

          // Insert into property_images table
          if (r2Url) {
            await query(
              `INSERT INTO property_images (property_id, r2_key, r2_url, is_primary, display_order)
               VALUES ($1, $2, $3, true, 0)
               ON CONFLICT DO NOTHING`,
              [prop.id, r2Key || `migrated/${prop.id}.jpg`, r2Url]
            );
          }
        } else {
          // Local persistent store
          const existing = store.getPropertyById(prop.id);
          const migratedProp = {
            ...prop,
            image_url: r2Url,
            images: [
              {
                id: `img-${prop.id}-0`,
                property_id: prop.id,
                r2_key: r2Key || `migrated/${prop.id}.jpg`,
                r2_url: r2Url,
                is_primary: true,
                display_order: 0,
              },
            ],
          };

          if (existing) {
            store.updateProperty(prop.id, migratedProp);
          } else {
            store.createProperty(migratedProp);
          }
        }

        stats.propertiesMigrated++;
      } catch (err: any) {
        console.error(`  ❌ Error migrating property "${prop.title}":`, err.message);
        stats.errors.push(`Property ${prop.id}: ${err.message}`);
      }
    }

    // 4. Migrate Inquiries
    console.log('\n📬 Step 3: Checking inquiries table...');
    const { data: inquiries } = await supabase.from('inquiries').select('*');
    if (inquiries && inquiries.length > 0) {
      for (const inq of inquiries) {
        try {
          if (isDbConnected()) {
            await query(
              `INSERT INTO inquiries (id, property_id, name, email, phone, medical_role, tour_date, message, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT (id) DO NOTHING`,
              [inq.id, inq.property_id, inq.name, inq.email, inq.phone, inq.medical_role, inq.tour_date, inq.message, inq.created_at]
            );
          } else {
            store.createInquiry(inq);
          }
          stats.inquiriesMigrated++;
        } catch (e: any) {
          stats.errors.push(`Inquiry ${inq.id}: ${e.message}`);
        }
      }
    }
    console.log(`Migrated ${stats.inquiriesMigrated} inquiries.`);

    // 5. Migrate Leads
    console.log('\n👥 Step 4: Checking leads table...');
    const { data: leads } = await supabase.from('leads').select('*');
    if (leads && leads.length > 0) {
      for (const lead of leads) {
        try {
          if (isDbConnected()) {
            await query(
              `INSERT INTO leads (id, email, type, created_at)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (id) DO NOTHING`,
              [lead.id, lead.email, lead.type, lead.created_at]
            );
          } else {
            store.createLead(lead);
          }
          stats.leadsMigrated++;
        } catch (e: any) {
          stats.errors.push(`Lead ${lead.id}: ${e.message}`);
        }
      }
    }
    console.log(`Migrated ${stats.leadsMigrated} leads.`);

    // 6. Migrate Favorites
    console.log('\n⭐ Step 5: Checking favorites table...');
    const { data: favorites } = await supabase.from('favorites').select('*');
    if (favorites && favorites.length > 0) {
      for (const fav of favorites) {
        try {
          if (isDbConnected()) {
            await query(
              `INSERT INTO favorites (id, property_id, user_id, created_at)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (property_id, user_id) DO NOTHING`,
              [fav.id, fav.property_id, fav.user_id, fav.created_at]
            );
          } else {
            store.toggleFavorite(fav.property_id, fav.user_id);
          }
          stats.favoritesMigrated++;
        } catch (e: any) {
          stats.errors.push(`Favorite ${fav.id}: ${e.message}`);
        }
      }
    }
    console.log(`Migrated ${stats.favoritesMigrated} favorites.`);

    // Final Report
    console.log('\n=====================================================');
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY');
    console.log('=====================================================');
    console.log(`Properties Extracted from Supabase: ${stats.propertiesExtracted}`);
    console.log(`Properties Migrated to PostgreSQL:  ${stats.propertiesMigrated}`);
    console.log(`Images Transferred to Cloudflare R2: ${stats.imagesTransferredToR2}`);
    console.log(`Inquiries Migrated:                 ${stats.inquiriesMigrated}`);
    console.log(`Leads Migrated:                     ${stats.leadsMigrated}`);
    console.log(`Favorites Migrated:                 ${stats.favoritesMigrated}`);
    console.log(`Errors encountered:                 ${stats.errors.length}`);
    if (stats.errors.length > 0) {
      console.log('Errors:', stats.errors);
    }
    console.log('=====================================================\n');

    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Fatal Migration Error:', err.message);
    process.exit(1);
  }
}

runMigration();
