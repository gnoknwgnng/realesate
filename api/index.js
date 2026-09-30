var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/r2.ts
var r2_exports = {};
__export(r2_exports, {
  bucketName: () => bucketName,
  createPresignedUploadUrl: () => createPresignedUploadUrl,
  deleteFromR2: () => deleteFromR2,
  getPresignedUploadUrl: () => getPresignedUploadUrl,
  isR2Configured: () => isR2Configured,
  publicUrl: () => publicUrl,
  s3Client: () => s3Client,
  uploadToR2: () => uploadToR2
});
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs2 from "fs";
import path2 from "path";
import crypto from "crypto";
import dotenv2 from "dotenv";
async function uploadToR2(buffer, originalName, mimeType, folder = "properties") {
  const ext = path2.extname(originalName) || ".jpg";
  const uniqueId = crypto.randomUUID();
  const safeName = path2.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const key = `${folder}/${Date.now()}-${uniqueId}-${safeName}${ext}`;
  if (s3Client && isR2Configured) {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: mimeType
        })
      );
      const url = publicUrl ? `${publicUrl.replace(/\/$/, "")}/${key}` : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      return {
        key,
        url,
        fileName: originalName,
        fileSize: buffer.length,
        mimeType
      };
    } catch (err) {
      console.error("Failed to upload to Cloudflare R2, falling back to local:", err.message);
    }
  }
  try {
    const localFilePath = path2.join(localUploadsDir, `${Date.now()}-${uniqueId}${ext}`);
    fs2.writeFileSync(localFilePath, buffer);
    const localUrl = `/uploads/${path2.basename(localFilePath)}`;
    return {
      key,
      url: localUrl,
      fileName: originalName,
      fileSize: buffer.length,
      mimeType
    };
  } catch {
    return {
      key,
      url: `data:${mimeType};base64,${buffer.toString("base64")}`,
      fileName: originalName,
      fileSize: buffer.length,
      mimeType
    };
  }
}
async function deleteFromR2(key) {
  if (s3Client && isR2Configured) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key
        })
      );
      return true;
    } catch (err) {
      console.warn("Failed to delete object from Cloudflare R2:", err.message);
      return false;
    }
  }
  return true;
}
async function createPresignedUploadUrl(fileName, mimeType, folder = "properties") {
  const ext = path2.extname(fileName) || ".jpg";
  const uniqueId = crypto.randomUUID();
  const safeName = path2.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const key = `${folder}/${Date.now()}-${uniqueId}-${safeName}${ext}`;
  if (s3Client && isR2Configured) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: mimeType
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicFileUrl = publicUrl ? `${publicUrl.replace(/\/$/, "")}/${key}` : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
    return { uploadUrl, key, publicFileUrl };
  }
  return {
    uploadUrl: `/api/upload/single`,
    key,
    publicFileUrl: `/uploads/${uniqueId}${ext}`
  };
}
async function getPresignedUploadUrl(key, mimeType, expiresInSeconds = 3600) {
  if (!s3Client || !isR2Configured) {
    throw new Error("Cloudflare R2 is not configured with live credentials.");
  }
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: mimeType
  });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}
var accountId, accessKeyId, secretAccessKey, bucketName, publicUrl, isVercel, localUploadsDir, isR2Configured, s3Client;
var init_r2 = __esm({
  "server/r2.ts"() {
    dotenv2.config();
    accountId = process.env.R2_ACCOUNT_ID;
    accessKeyId = process.env.R2_ACCESS_KEY_ID;
    secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    bucketName = process.env.R2_BUCKET_NAME || "medproperties-media";
    publicUrl = process.env.R2_PUBLIC_URL || "";
    isVercel = Boolean(process.env.VERCEL);
    localUploadsDir = isVercel ? path2.join("/tmp", "medproperties_uploads") : path2.join(process.cwd(), "uploads");
    try {
      if (!fs2.existsSync(localUploadsDir)) {
        fs2.mkdirSync(localUploadsDir, { recursive: true });
      }
    } catch {
    }
    isR2Configured = Boolean(
      accountId && accessKeyId && secretAccessKey && !accessKeyId.includes("your_") && !secretAccessKey.includes("your_")
    );
    s3Client = isR2Configured ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    }) : null;
  }
});

// server/index.ts
import express from "express";
import cors from "cors";
import path4 from "path";
import dotenv3 from "dotenv";

// server/db.ts
import pg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
var { Pool } = pg;
var connectionString = process.env.DATABASE_URL;
var pool = new Pool(
  connectionString ? { connectionString, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : void 0 } : {
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "medproperties"
  }
);
var isConnected = false;
async function initDb() {
  try {
    const client = await pool.connect();
    try {
      console.log("\u{1F50C} Connected successfully to PostgreSQL.");
      isConnected = true;
      const schemaPath = path.join(process.cwd(), "server", "schema.sql");
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, "utf8");
        await client.query(schemaSql);
        console.log("\u2705 PostgreSQL schema verified and up to date.");
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("\u26A0\uFE0F PostgreSQL connection not available directly:", err.message);
    console.log("\u2139\uFE0F Running with persistent local storage engine. Provide DATABASE_URL in .env to connect to live PostgreSQL.");
    isConnected = false;
  }
}
function isDbConnected() {
  return isConnected;
}
async function query(text, params) {
  if (!isConnected) {
    throw new Error("PostgreSQL database is currently disconnected.");
  }
  return pool.query(text, params);
}

// server/index.ts
init_r2();

// server/routes/properties.ts
import { Router } from "express";

// server/data/store.ts
import fs3 from "fs";
import path3 from "path";

// src/lib/mockData.ts
var INITIAL_PROPERTIES = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    title: "Palm Meadows Villa",
    address: "Whitefield Main Road, Bengaluru, KA",
    city: "Bengaluru",
    state: "KA",
    price: 65e3,
    period: "month",
    beds: 3,
    baths: 3,
    dimensions: "1,850 sq.ft",
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      { r2_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0, caption: "Living Pavilion with High Ceilings" },
      { r2_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", is_primary: false, display_order: 1, caption: "Quiet Courtyard & Private Garden" },
      { r2_url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", is_primary: false, display_order: 2, caption: "Acoustic-Isolated Study Room" }
    ],
    is_popular: true,
    category: "rent",
    property_type: "Luxury Villa",
    description: "Immaculately maintained 3 BHK gated villa situated 12 minutes from Manipal Hospital Whitefield. Tailored for senior consultants with an acoustic-isolated study room, triple-track blackout drapery for rotating shifts, and 100% automatic diesel generator power backup.",
    hospital_name: "Manipal Hospital Whitefield",
    hospital_distance: "1.8 km to Manipal Hospital Whitefield",
    commute_estimate: "Approx. 12 min drive at 8:00 AM",
    verified_date: "14 September 2026",
    verification_method: "Physical On-Site Inspection & Lease Title Verified",
    furnishing: "Semi-Furnished",
    deposit: 3e5,
    maintenance: 4500,
    workday_amenities: [
      "100% DG Power Backup",
      "Acoustic-Isolated Doctor Study",
      "Blackout Bedroom Drapery",
      "Covered Dedicated Parking (2 Cars)",
      "24/7 Gated Security & Rapid Exit",
      "Shift-Friendly Concierge Viewing"
    ],
    floor: "Independent G+1",
    facing: "East Facing",
    owner_email: "doctor.demo@medproperties.com",
    status: "active"
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    title: "Jubilee Enclave Villa",
    address: "Road No. 36, Jubilee Hills, Hyderabad, TS",
    city: "Hyderabad",
    state: "TS",
    price: 85e3,
    period: "month",
    beds: 4,
    baths: 4,
    dimensions: "2,400 sq.ft",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      { r2_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0, caption: "Architectural Facade & Private Portico" },
      { r2_url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80", is_primary: false, display_order: 1, caption: "Master Suite with Blackout Shading" },
      { r2_url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80", is_primary: false, display_order: 2, caption: "Chef Kitchen with Piped Gas" }
    ],
    is_popular: true,
    category: "rent",
    property_type: "Executive Villa",
    description: "Refined 4 BHK executive residence in prime Jubilee Hills, located 8 minutes from Apollo Health City. Features expansive master suite, dedicated medical reading desk, EV vehicle charger, dual water source, and quiet residential neighborhood.",
    hospital_name: "Apollo Hospitals Jubilee Hills",
    hospital_distance: "2.1 km to Apollo Hospitals Jubilee Hills",
    commute_estimate: "Approx. 8 min drive at 8:00 AM",
    verified_date: "22 September 2026",
    verification_method: "Structural & Title Audit Verified by Legal Counsel",
    furnishing: "Fully Furnished",
    deposit: 4e5,
    maintenance: 6e3,
    workday_amenities: [
      "100% DG Power Backup",
      "EV Charging Station Installed",
      "High-Speed Fiber Dual ISP",
      "Private Terrace Garden",
      "24/7 Monitored Access Control"
    ],
    floor: "Independent 2-Level Villa",
    facing: "North-East Facing",
    owner_email: "doctor.demo@medproperties.com",
    status: "active"
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    title: "Worli Sea Face Specialist Suite",
    address: "Khan Abdul Gaffar Khan Marg, Worli, Mumbai, MH",
    city: "Mumbai",
    state: "MH",
    price: 145e3,
    period: "month",
    beds: 3,
    baths: 3,
    dimensions: "1,700 sq.ft",
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    images: [
      { r2_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0, caption: "Panoramic Arabian Sea View" },
      { r2_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", is_primary: false, display_order: 1, caption: "Quiet Sunset Balcony" }
    ],
    is_popular: true,
    category: "rent",
    property_type: "Sea View Apartment",
    description: "High-floor sea-facing apartment offering deep calm and restorative rest for department heads and surgeons. Fast Bandra-Worli Sea Link connection provides seamless 18-minute transit to Lilavati Hospital Bandra.",
    hospital_name: "Lilavati Hospital & Research Centre",
    hospital_distance: "3.2 km to Lilavati Hospital Bandra via Sea Link",
    commute_estimate: "Approx. 18 min via Sea Link at 8:00 AM",
    verified_date: "18 September 2026",
    verification_method: "On-Site Decibel Noise Audit & Registered Society NOC",
    furnishing: "Fully Furnished",
    deposit: 6e5,
    maintenance: 12e3,
    workday_amenities: [
      "Double-Glazed Acoustic Glazing",
      "Direct Bandra-Worli Sea Link Ramp",
      "Dual High-Speed Elevators",
      "Reserved Podium Parking",
      "Concierge Parcel & Key Management"
    ],
    floor: "18th Floor of 24",
    facing: "West (Sea Facing)",
    status: "active"
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    title: "Saket Greens Contemporary Residence",
    address: "Press Enclave Road, Saket, New Delhi, DL",
    city: "Delhi NCR",
    state: "DL",
    price: 72e3,
    period: "month",
    beds: 3,
    baths: 3,
    dimensions: "1,950 sq.ft",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    is_popular: false,
    category: "rent",
    property_type: "Contemporary Floor",
    description: "Spacious 3 BHK builder floor situated directly opposite Max Super Speciality Hospital Saket, and 16 minutes from AIIMS New Delhi. Private balcony garden, Italian marble flooring, and modular pantry.",
    hospital_name: "Max Super Speciality Hospital Saket",
    hospital_distance: "1.1 km to Max Super Speciality Hospital Saket",
    commute_estimate: "Approx. 5 min drive / 12 min walk",
    verified_date: "10 September 2026",
    verification_method: "Physical Inspection & Land Title Registry Verification",
    furnishing: "Semi-Furnished",
    deposit: 2e5,
    maintenance: 3e3,
    workday_amenities: [
      "100% Inverter & DG Power Backup",
      "Elevator Direct to Floor",
      "Sound-Insulated Master Bedroom",
      "Covered Stilt Parking Slot",
      "Walking Distance to Max Hospital"
    ],
    floor: "2nd Floor of 4",
    facing: "North-East Facing",
    status: "active"
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    title: "Koramangala Medical Suites",
    address: "80 Feet Road, 4th Block Koramangala, Bengaluru, KA",
    city: "Bengaluru",
    state: "KA",
    price: 38e3,
    period: "month",
    beds: 2,
    baths: 2,
    dimensions: "1,150 sq.ft",
    image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    is_popular: false,
    category: "rent",
    property_type: "Furnished Apartment",
    description: "Turnkey fully-furnished 2 BHK apartment designed for fellows, residents, and visiting medical faculty. 900 meters from St. John\u2019s Medical College Hospital with high-speed Wi-Fi and weekly housekeeping option.",
    hospital_name: "St. John\u2019s Medical College Hospital",
    hospital_distance: "900 meters to St. John\u2019s Hospital",
    commute_estimate: "Approx. 4 min drive / 10 min walk",
    verified_date: "19 September 2026",
    verification_method: "Verified Clean Lease & Verified Landlord Agreement",
    furnishing: "Fully Furnished",
    deposit: 15e4,
    maintenance: 2500,
    workday_amenities: [
      "Dedicated Workstation with Dual Monitors",
      "High-Speed 300 Mbps Fiber Internet",
      "Blackout Room Curtains",
      "Covered Scooter & Car Parking",
      "Water Purifier & Washing Machine"
    ],
    floor: "3rd Floor of 5",
    facing: "North Facing",
    status: "active"
  },
  {
    id: "a6666666-6666-6666-6666-666666666666",
    title: "Anna Nagar Heritage Residence",
    address: "2nd Avenue, Anna Nagar, Chennai, TN",
    city: "Chennai",
    state: "TN",
    price: 48e3,
    period: "month",
    beds: 3,
    baths: 2,
    dimensions: "1,600 sq.ft",
    image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
    is_popular: false,
    category: "rent",
    property_type: "Heritage Villa",
    description: "Serene tree-lined residential home with private shaded courtyard garden. Convenient 12-minute commute to MGM Healthcare, Apollo Hospitals Greams Road, and Madras Medical College.",
    hospital_name: "MGM Healthcare & Apollo Hospitals",
    hospital_distance: "2.4 km to MGM Healthcare Chennai",
    commute_estimate: "Approx. 12 min drive at 8:00 AM",
    verified_date: "20 September 2026",
    verification_method: "Physical On-Site Lease & Water Potability Audit",
    furnishing: "Semi-Furnished",
    deposit: 24e4,
    maintenance: 2e3,
    workday_amenities: [
      "Private Tree-Lined Garden",
      "100% Inverter Backup System",
      "Dual Borewell and Corporation Water",
      "Covered Garage",
      "Quiet Residential Zone"
    ],
    floor: "Ground Floor Independent",
    facing: "South-East Facing",
    status: "active"
  },
  // Properties for BUY (Luxury Doctor Residences for Acquisition)
  {
    id: "b1111111-1111-1111-1111-111111111111",
    title: "Indiranagar Prestige Doctor Residence",
    address: "100 Feet Road, Indiranagar, Bengaluru, KA",
    city: "Bengaluru",
    state: "KA",
    price: 34e6,
    // ₹3.40 Cr
    period: "total",
    beds: 3,
    baths: 3,
    dimensions: "2,400 sq.ft",
    image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    images: [
      { r2_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", is_primary: true, display_order: 0, caption: "Modernist Architecture & Glass Balconies" },
      { r2_url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", is_primary: false, display_order: 1, caption: "Private Consultation Library" }
    ],
    is_popular: true,
    category: "buy",
    property_type: "Luxury Condominium",
    description: "Exclusive 3 BHK plus library residence situated 8 minutes from Manipal Hospital (HAL). Features A-Khata clear title, RERA certification, acoustic floor isolation, private basement parking, and clubhouse amenities.",
    hospital_name: "Manipal Hospital HAL Old Airport Rd",
    hospital_distance: "2.0 km to Manipal Hospital HAL",
    commute_estimate: "Approx. 8 min drive at 8:00 AM",
    verified_date: "02 September 2026",
    verification_method: "A-Khata Title Verified & Encumbrance Certificate Clean",
    furnishing: "Fully Furnished",
    deposit: 0,
    maintenance: 8500,
    workday_amenities: [
      "A-Khata Clear Freehold Title",
      "Doctor Consultation Home Office",
      "EV Supercharger in Basement",
      "100% Generator Backup 24/7",
      "Pre-Approved for Medical Professional Home Loans"
    ],
    floor: "5th Floor of 12",
    facing: "East Facing",
    status: "active"
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    title: "Golf Course Extension Doctors Haven",
    address: "Sector 65, Golf Course Extension Rd, Gurugram, HR",
    city: "Delhi NCR",
    state: "HR",
    price: 275e5,
    // ₹2.75 Cr
    period: "total",
    beds: 4,
    baths: 4,
    dimensions: "2,650 sq.ft",
    image_url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    is_popular: true,
    category: "buy",
    property_type: "High-Rise Penthouse",
    description: "Ultra-modern 4 BHK penthouse with wraparound deck offering unhindered green views. Located 14 minutes from Fortis Memorial Research Institute and Medanta The Medicity, with doctor home-loan subsidies pre-evaluated.",
    hospital_name: "Fortis Memorial Research Institute & Medanta",
    hospital_distance: "4.8 km to Fortis Gurugram",
    commute_estimate: "Approx. 14 min drive via SPR",
    verified_date: "08 September 2026",
    verification_method: "RERA Certified & Occupancy Certificate Received",
    furnishing: "Semi-Furnished",
    deposit: 0,
    maintenance: 9200,
    workday_amenities: [
      "Central Air Conditioning with HEPA Filtration",
      "Soundproof Triple-Glazed Facade",
      "High-Speed Elevators with Power Backup",
      "Dedicated Basement Stalls (2)",
      "Bank Loan Pre-Sanction Support"
    ],
    floor: "22nd Floor Penthouse",
    facing: "North-East Facing",
    status: "active"
  },
  {
    id: "b3333333-3333-3333-3333-333333333333",
    title: "Bandra West Specialist Penthouse",
    address: "Pali Hill, Bandra West, Mumbai, MH",
    city: "Mumbai",
    state: "MH",
    price: 58e6,
    // ₹5.80 Cr
    period: "total",
    beds: 4,
    baths: 4,
    dimensions: "2,900 sq.ft",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    is_popular: false,
    category: "buy",
    property_type: "Duplex Penthouse",
    description: "Premier duplex residence atop peaceful Pali Hill. Just 6 minutes from Lilavati Hospital and Hinduja Healthcare. Features private rooftop terrace, dedicated elevator lobby, and concierge security.",
    hospital_name: "Lilavati Hospital Bandra",
    hospital_distance: "1.4 km to Lilavati Hospital",
    commute_estimate: "Approx. 6 min drive / 15 min walk",
    verified_date: "16 September 2026",
    verification_method: "Clear Co-op Society Title & Occupancy Certificate Verified",
    furnishing: "Fully Furnished",
    deposit: 0,
    maintenance: 18e3,
    workday_amenities: [
      "Private Elevator Access to Penthouse",
      "Full Home Soundproofing & Double Glazing",
      "100% Diesel Generator Continuous Backup",
      "Valet Parking & Secured Car Port (3 Slots)",
      "Doctor Relocation Mortgage Advisory"
    ],
    floor: "Duplex 11th & 12th Floor",
    facing: "Sea Breeze West",
    status: "active"
  }
];

// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
var INITIAL_USERS = [
  {
    id: "user-doc-1",
    email: "rajesh.sharma@aiims.edu",
    full_name: "Dr. Rajesh Sharma, MD",
    role: "doctor",
    phone: "+91 98101 23456",
    hospital: "AIIMS New Delhi",
    location: "Ansari Nagar, New Delhi",
    last_login: new Date(Date.now() - 3 * 60 * 1e3).toISOString(),
    status: "online",
    device: "Desktop (Chrome / macOS)"
  },
  {
    id: "user-doc-2",
    email: "sneha.patel@manipal.org",
    full_name: "Dr. Sneha Patel, MS",
    role: "doctor",
    phone: "+91 98450 87654",
    hospital: "Manipal Hospital Bengaluru",
    location: "HAL Old Airport Rd, Bengaluru",
    last_login: new Date(Date.now() - 14 * 60 * 1e3).toISOString(),
    status: "online",
    device: "Mobile (iPhone 15 / Safari)"
  },
  {
    id: "user-doc-3",
    email: "priya.nair@apollo.com",
    full_name: "Dr. Priya Nair, MS",
    role: "doctor",
    phone: "+91 97412 34567",
    hospital: "Apollo Hospitals Jubilee Hills",
    location: "Jubilee Hills, Hyderabad",
    last_login: new Date(Date.now() - 2 * 3600 * 1e3).toISOString(),
    status: "offline",
    device: "Tablet (iPad Pro / Chrome)"
  },
  {
    id: "user-landlord-1",
    email: "kavitha.reddy@gmail.com",
    full_name: "Kavitha Reddy",
    role: "landlord",
    phone: "+91 99001 12233",
    location: "Indiranagar, Bengaluru, KA",
    hospital: "Near Manipal Hospital (HAL)",
    last_login: new Date(Date.now() - 25 * 60 * 1e3).toISOString(),
    status: "online",
    device: "Desktop (Windows / Edge)"
  },
  {
    id: "user-landlord-2",
    email: "vikram.malhotra@realty.in",
    full_name: "Vikram Malhotra",
    role: "landlord",
    phone: "+91 98200 44556",
    location: "Bandra West, Mumbai, MH",
    hospital: "Near Lilavati Hospital",
    last_login: new Date(Date.now() - 18 * 3600 * 1e3).toISOString(),
    status: "offline",
    device: "Desktop (Mac / Safari)"
  },
  {
    id: "user-admin-1",
    email: "superadmin@medproperties.com",
    full_name: "Super Admin Console",
    role: "superadmin",
    phone: "+91 1800 200 3627",
    location: "Central Headquarters, Bengaluru",
    hospital: "MedProperties Platform Operations",
    last_login: (/* @__PURE__ */ new Date()).toISOString(),
    status: "online",
    device: "Admin Workstation (Secure Session)"
  }
];

// server/data/store.ts
var memProperties = [...INITIAL_PROPERTIES];
var memUsers = [...INITIAL_USERS];
var memInquiries = [];
var memLeads = [];
var memFavorites = [];
var isVercel2 = Boolean(process.env.VERCEL);
var dataDir = isVercel2 ? path3.join("/tmp", "medproperties_data") : path3.join(process.cwd(), "data");
try {
  if (!fs3.existsSync(dataDir)) {
    fs3.mkdirSync(dataDir, { recursive: true });
  }
} catch {
}
var propsFile = path3.join(dataDir, "properties.json");
var usersFile = path3.join(dataDir, "users.json");
var inquiriesFile = path3.join(dataDir, "inquiries.json");
var leadsFile = path3.join(dataDir, "leads.json");
var favoritesFile = path3.join(dataDir, "favorites.json");
try {
  if (!fs3.existsSync(propsFile)) {
    fs3.writeFileSync(propsFile, JSON.stringify(INITIAL_PROPERTIES, null, 2));
  }
  if (!fs3.existsSync(usersFile)) {
    fs3.writeFileSync(usersFile, JSON.stringify(INITIAL_USERS, null, 2));
  }
  if (!fs3.existsSync(inquiriesFile)) {
    fs3.writeFileSync(inquiriesFile, JSON.stringify([], null, 2));
  }
  if (!fs3.existsSync(leadsFile)) {
    fs3.writeFileSync(leadsFile, JSON.stringify([], null, 2));
  }
  if (!fs3.existsSync(favoritesFile)) {
    fs3.writeFileSync(favoritesFile, JSON.stringify([], null, 2));
  }
} catch {
}
var store = {
  // Properties
  getProperties() {
    try {
      if (fs3.existsSync(propsFile)) {
        return JSON.parse(fs3.readFileSync(propsFile, "utf8"));
      }
    } catch {
    }
    return memProperties;
  },
  saveProperties(props) {
    memProperties = props;
    try {
      fs3.writeFileSync(propsFile, JSON.stringify(props, null, 2));
    } catch {
    }
  },
  getPropertyById(id) {
    return this.getProperties().find((p) => p.id === id);
  },
  createProperty(prop) {
    const properties = this.getProperties();
    const newProp = {
      id: prop.id || "prop-" + Math.random().toString(36).substring(2, 9),
      title: prop.title || "",
      address: prop.address || "",
      city: prop.city || "Bengaluru",
      state: prop.state || "KA",
      price: prop.price || 0,
      period: prop.period || "month",
      beds: prop.beds || 1,
      baths: prop.baths || 1,
      dimensions: prop.dimensions || "1,000 sq.ft",
      image_url: prop.image_url || "",
      images: prop.images || [],
      is_popular: prop.is_popular || false,
      category: prop.category || "rent",
      property_type: prop.property_type || "Apartment",
      description: prop.description || "",
      hospital_distance: prop.hospital_distance || "",
      created_at: prop.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      status: prop.status || "active",
      owner_email: prop.owner_email,
      owner_id: prop.owner_id
    };
    properties.unshift(newProp);
    this.saveProperties(properties);
    return newProp;
  },
  updateProperty(id, updates) {
    const properties = this.getProperties();
    const index = properties.findIndex((p) => p.id === id);
    if (index === -1) return null;
    properties[index] = { ...properties[index], ...updates };
    this.saveProperties(properties);
    return properties[index];
  },
  deleteProperty(id) {
    const properties = this.getProperties();
    const filtered = properties.filter((p) => p.id !== id);
    if (filtered.length === properties.length) return false;
    this.saveProperties(filtered);
    return true;
  },
  // Users
  getUsers() {
    try {
      if (fs3.existsSync(usersFile)) {
        return JSON.parse(fs3.readFileSync(usersFile, "utf8"));
      }
    } catch {
    }
    return memUsers;
  },
  getUserById(id) {
    return this.getUsers().find((u) => u.id === id);
  },
  getUserByEmail(email) {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: userData.id || "user-" + Math.random().toString(36).substring(2, 9),
      email: userData.email || "",
      role: userData.role || "doctor",
      full_name: userData.full_name || "",
      hospital: userData.hospital,
      phone: userData.phone,
      status: userData.status || "online",
      last_login: userData.last_login || (/* @__PURE__ */ new Date()).toISOString(),
      device: userData.device || "Web Session"
    };
    users.unshift(newUser);
    memUsers = users;
    try {
      fs3.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch {
    }
    return newUser;
  },
  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    memUsers = users;
    try {
      fs3.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch {
    }
    return users[index];
  },
  // Inquiries
  getInquiries() {
    try {
      if (fs3.existsSync(inquiriesFile)) {
        return JSON.parse(fs3.readFileSync(inquiriesFile, "utf8"));
      }
    } catch {
    }
    return memInquiries;
  },
  createInquiry(inq) {
    const inqs = this.getInquiries();
    const newInq = {
      ...inq,
      id: inq.id || "inq-" + Math.random().toString(36).substring(2, 9),
      created_at: inq.created_at || (/* @__PURE__ */ new Date()).toISOString()
    };
    inqs.unshift(newInq);
    memInquiries = inqs;
    try {
      fs3.writeFileSync(inquiriesFile, JSON.stringify(inqs, null, 2));
    } catch {
    }
    return newInq;
  },
  // Leads
  getLeads() {
    try {
      if (fs3.existsSync(leadsFile)) {
        return JSON.parse(fs3.readFileSync(leadsFile, "utf8"));
      }
    } catch {
    }
    return memLeads;
  },
  createLead(lead) {
    const leads = this.getLeads();
    const newLead = {
      id: "lead-" + Math.random().toString(36).substring(2, 9),
      email: lead.email,
      type: lead.type || "landlord",
      created_at: lead.created_at || (/* @__PURE__ */ new Date()).toISOString()
    };
    leads.unshift(newLead);
    memLeads = leads;
    try {
      fs3.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch {
    }
    return newLead;
  },
  // Favorites
  getFavorites(userId) {
    try {
      if (fs3.existsSync(favoritesFile)) {
        const allFavs = JSON.parse(fs3.readFileSync(favoritesFile, "utf8"));
        if (userId) {
          return allFavs.filter((f) => f.user_id === userId);
        }
        return allFavs;
      }
    } catch {
    }
    return userId ? memFavorites.filter((f) => f.user_id === userId) : memFavorites;
  },
  toggleFavorite(property_id, user_id) {
    const favs = this.getFavorites();
    const index = favs.findIndex((f) => f.property_id === property_id && f.user_id === user_id);
    if (index >= 0) {
      favs.splice(index, 1);
      memFavorites = favs;
      try {
        fs3.writeFileSync(favoritesFile, JSON.stringify(favs, null, 2));
      } catch {
      }
      return { favorited: false };
    } else {
      const newFav = {
        id: "fav-" + Math.random().toString(36).substring(2, 9),
        property_id,
        user_id,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      favs.unshift(newFav);
      memFavorites = favs;
      try {
        fs3.writeFileSync(favoritesFile, JSON.stringify(favs, null, 2));
      } catch {
      }
      return { favorited: true };
    }
  }
};
var localStore = store;

// server/routes/properties.ts
init_r2();
import crypto2 from "crypto";
var propertiesRouter = Router();
propertiesRouter.get("/", async (req, res) => {
  try {
    const {
      category,
      city,
      beds,
      search,
      page = "1",
      limit = "50"
    } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;
    if (isDbConnected()) {
      let sql = `
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', pi.id,
                'r2_key', pi.r2_key,
                'r2_url', pi.r2_url,
                'is_primary', pi.is_primary,
                'display_order', pi.display_order
              ) ORDER BY pi.display_order ASC
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'
          ) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE 1=1
      `;
      const params = [];
      let paramIdx = 1;
      if (category && category !== "all") {
        sql += ` AND p.category = $${paramIdx++}`;
        params.push(category);
      }
      if (city && city !== "all") {
        sql += ` AND LOWER(p.city) LIKE $${paramIdx++}`;
        params.push(`%${city.toLowerCase()}%`);
      }
      if (beds && beds !== "all") {
        sql += ` AND p.beds >= $${paramIdx++}`;
        params.push(parseInt(beds, 10));
      }
      if (search && search.trim()) {
        const term = `%${search.toLowerCase().trim()}%`;
        sql += ` AND (LOWER(p.title) LIKE $${paramIdx} OR LOWER(p.address) LIKE $${paramIdx} OR LOWER(p.city) LIKE $${paramIdx})`;
        params.push(term);
        paramIdx++;
      }
      sql += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
      params.push(limitNum, offset);
      const result = await query(sql, params);
      return res.json({
        success: true,
        properties: result.rows,
        data: result.rows,
        page: pageNum,
        limit: limitNum,
        source: "postgresql"
      });
    }
    let list = localStore.getProperties();
    if (category && category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (city && city !== "all") {
      list = list.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (beds && beds !== "all") {
      list = list.filter((p) => p.beds >= parseInt(beds, 10));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
      );
    }
    const paginated = list.slice(offset, offset + limitNum);
    return res.json({
      success: true,
      properties: paginated,
      data: paginated,
      total: list.length,
      page: pageNum,
      limit: limitNum,
      source: "local_persistence"
    });
  } catch (err) {
    console.error("Error in GET /api/properties:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});
propertiesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const sql = `
        SELECT 
          p.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', pi.id,
                'r2_key', pi.r2_key,
                'r2_url', pi.r2_url,
                'is_primary', pi.is_primary,
                'display_order', pi.display_order
              ) ORDER BY pi.display_order ASC
            ) FILTER (WHERE pi.id IS NOT NULL),
            '[]'
          ) as images
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        WHERE p.id = $1
        GROUP BY p.id
      `;
      const result = await query(sql, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Property not found" });
      }
      return res.json(result.rows[0]);
    }
    const item = localStore.getProperties().find((p) => p.id === id);
    if (!item) return res.status(404).json({ error: "Property not found" });
    return res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
propertiesRouter.post("/", async (req, res) => {
  try {
    const body = req.body;
    const propertyId = body.id || crypto2.randomUUID();
    const newProp = {
      ...body,
      id: propertyId,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      price: parseFloat(body.price),
      beds: parseInt(body.beds, 10),
      baths: parseFloat(body.baths),
      status: body.status || "active",
      category: body.category || "rent"
    };
    if (isDbConnected()) {
      const insertSql = `
        INSERT INTO properties (
          id, title, address, city, state, price, period, beds, baths,
          dimensions, image_url, is_popular, category, property_type,
          description, hospital_distance, virtual_tour_url, owner_email, owner_id, status, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW()
        ) RETURNING *
      `;
      const values = [
        newProp.id,
        newProp.title,
        newProp.address,
        newProp.city,
        newProp.state,
        newProp.price,
        newProp.period || "month",
        newProp.beds,
        newProp.baths,
        newProp.dimensions,
        newProp.image_url,
        newProp.is_popular || false,
        newProp.category,
        newProp.property_type,
        newProp.description,
        newProp.hospital_distance,
        newProp.virtual_tour_url || null,
        newProp.owner_email || null,
        newProp.owner_id || null,
        newProp.status || "active"
      ];
      const result = await query(insertSql, values);
      const created2 = result.rows[0];
      if (Array.isArray(body.images) && body.images.length > 0) {
        for (let i = 0; i < body.images.length; i++) {
          const img = body.images[i];
          await query(
            `INSERT INTO property_images (property_id, r2_key, r2_url, is_primary, display_order, file_name, file_size, mime_type)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              newProp.id,
              img.r2_key || img.key,
              img.r2_url || img.url,
              img.is_primary ?? i === 0,
              i,
              img.file_name || img.fileName || null,
              img.file_size || img.fileSize || null,
              img.mime_type || img.mimeType || null
            ]
          );
        }
      }
      return res.status(201).json({ success: true, property: created2 });
    }
    const created = localStore.createProperty(newProp);
    return res.status(201).json({ success: true, property: created });
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: err.message });
  }
});
propertiesRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const imgRes = await query("SELECT r2_key FROM property_images WHERE property_id = $1", [id]);
      for (const row of imgRes.rows) {
        if (row.r2_key) {
          await deleteFromR2(row.r2_key);
        }
      }
      await query("DELETE FROM properties WHERE id = $1", [id]);
      return res.json({ success: true, message: "Property deleted from PostgreSQL and R2." });
    }
    const success = localStore.deleteProperty(id);
    return res.json({ success, message: success ? "Property deleted successfully." : "Property not found." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
var properties_default = propertiesRouter;

// server/routes/upload.ts
init_r2();
import { Router as Router2 } from "express";
import multer from "multer";
var router = Router2();
var storage = multer.memoryStorage();
var fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, AVIF, GIF.`));
  }
};
var upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter
});
router.post("/presign", async (req, res) => {
  try {
    const { fileName, mimeType, folder = "properties" } = req.body || {};
    if (!fileName || !mimeType) {
      return res.status(400).json({ error: "fileName and mimeType are required" });
    }
    const { createPresignedUploadUrl: createPresignedUploadUrl2 } = await Promise.resolve().then(() => (init_r2(), r2_exports));
    const result = await createPresignedUploadUrl2(fileName, mimeType, folder);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message || "Presign generation failed" });
  }
});
router.post("/single", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }
    const folder = req.body.folder || "properties";
    const result = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );
    res.json({
      success: true,
      file: result
    });
  } catch (err) {
    console.error("Error in single image upload:", err);
    res.status(500).json({ error: err.message || "Image upload failed" });
  }
});
router.post("/multiple", upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }
    const folder = req.body.folder || "properties";
    const uploadPromises = files.map(
      (file) => uploadToR2(file.buffer, file.originalname, file.mimetype, folder)
    );
    const results = await Promise.all(uploadPromises);
    res.json({
      success: true,
      files: results
    });
  } catch (err) {
    console.error("Error in multiple images upload:", err);
    res.status(500).json({ error: err.message || "Multiple images upload failed" });
  }
});
router.delete("/", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: "Object key is required" });
    }
    const success = await deleteFromR2(key);
    res.json({ success });
  } catch (err) {
    console.error("Error deleting object from R2:", err);
    res.status(500).json({ error: err.message || "Failed to delete object" });
  }
});
var upload_default = router;

// server/routes/users.ts
import { Router as Router3 } from "express";
var router2 = Router3();
router2.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const result = await query(
        `SELECT id, email, role, full_name, phone, medical_council_reg_no, specialty, hospital, city, status, last_active_at, created_at 
         FROM users 
         ORDER BY created_at DESC`
      );
      return res.json({ users: result.rows });
    }
    const users = store.getUsers();
    return res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message || "Failed to fetch users" });
  }
});
router2.get("/stats/summary", async (req, res) => {
  try {
    let usersList = [];
    if (isDbConnected()) {
      const resUsers = await query(`SELECT role, status FROM users`);
      usersList = resUsers.rows;
    } else {
      usersList = store.getUsers();
    }
    const total = usersList.length;
    const online = usersList.filter((u) => u.status === "online").length;
    const doctors = usersList.filter((u) => u.role === "doctor").length;
    const landlords = usersList.filter((u) => u.role === "landlord").length;
    const superadmins = usersList.filter((u) => u.role === "superadmin").length;
    res.json({
      total,
      online,
      doctors,
      landlords,
      superadmins
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user stats" });
  }
});
router2.post("/login", async (req, res) => {
  try {
    const { email, password, role, full_name, hospital, phone } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const assignedRole = email.toLowerCase().includes("superadmin") || role === "superadmin" ? "superadmin" : role || "doctor";
    const name = full_name || email.split("@")[0];
    if (isDbConnected()) {
      const existing2 = await query(`SELECT * FROM users WHERE email = $1`, [email]);
      let user2;
      if (existing2.rows.length > 0) {
        const updateRes = await query(
          `UPDATE users 
           SET status = 'online', last_active_at = NOW(), role = COALESCE($2, role), full_name = COALESCE($3, full_name)
           WHERE email = $1 
           RETURNING *`,
          [email, assignedRole, name]
        );
        user2 = updateRes.rows[0];
      } else {
        const insertRes = await query(
          `INSERT INTO users (email, role, full_name, hospital, phone, status, last_active_at)
           VALUES ($1, $2, $3, $4, $5, 'online', NOW())
           RETURNING *`,
          [email, assignedRole, name, hospital || null, phone || null]
        );
        user2 = insertRes.rows[0];
      }
      return res.json({ success: true, user: user2 });
    }
    const existing = store.getUserByEmail(email);
    let user;
    if (existing) {
      user = store.updateUser(existing.id, {
        status: "online",
        last_active_at: (/* @__PURE__ */ new Date()).toISOString(),
        role: assignedRole,
        full_name: name
      });
    } else {
      user = store.createUser({
        email,
        role: assignedRole,
        full_name: name,
        hospital,
        phone,
        status: "online",
        last_active_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ error: err.message || "Login failed" });
  }
});
router2.post("/logout", async (req, res) => {
  try {
    const { email, id } = req.body;
    if (isDbConnected()) {
      if (id) {
        await query(`UPDATE users SET status = 'offline' WHERE id = $1`, [id]);
      } else if (email) {
        await query(`UPDATE users SET status = 'offline' WHERE email = $1`, [email]);
      }
      return res.json({ success: true });
    }
    if (id) {
      store.updateUser(id, { status: "offline" });
    } else if (email) {
      const u = store.getUserByEmail(email);
      if (u) store.updateUser(u.id, { status: "offline" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error logging out user:", err);
    res.status(500).json({ error: err.message || "Logout failed" });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user: result.rows[0] });
    }
    const user = store.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user by id:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user" });
  }
});
var users_default = router2;

// server/routes/inquiries.ts
import { Router as Router4 } from "express";
var router3 = Router4();
router3.get("/", async (req, res) => {
  try {
    const { property_id } = req.query;
    if (isDbConnected()) {
      let q = `
        SELECT i.*, p.title as property_title, p.city as property_city 
        FROM inquiries i
        LEFT JOIN properties p ON i.property_id = p.id
      `;
      const params = [];
      if (property_id) {
        q += ` WHERE i.property_id = $1`;
        params.push(property_id);
      }
      q += ` ORDER BY i.created_at DESC`;
      const result = await query(q, params);
      return res.json({ inquiries: result.rows });
    }
    let inquiries = store.getInquiries();
    if (property_id) {
      inquiries = inquiries.filter((inq) => inq.property_id === property_id);
    }
    res.json({ inquiries });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({ error: err.message || "Failed to fetch inquiries" });
  }
});
router3.post("/", async (req, res) => {
  try {
    const { property_id, name, email, phone, medical_role, tour_date, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    if (isDbConnected()) {
      const result = await query(
        `INSERT INTO inquiries (property_id, name, email, phone, medical_role, tour_date, message)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [property_id || null, name, email, phone || null, medical_role || null, tour_date || null, message || null]
      );
      return res.status(201).json({ success: true, inquiry: result.rows[0] });
    }
    const inquiry = store.createInquiry({
      property_id,
      name,
      email,
      phone,
      medical_role,
      tour_date,
      message
    });
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({ error: err.message || "Failed to create inquiry" });
  }
});
var inquiries_default = router3;

// server/routes/leads.ts
import { Router as Router5 } from "express";
var router4 = Router5();
router4.get("/", async (req, res) => {
  try {
    if (isDbConnected()) {
      const result = await query(`SELECT * FROM leads ORDER BY created_at DESC`);
      return res.json({ leads: result.rows });
    }
    const leads = store.getLeads();
    res.json({ leads });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ error: err.message || "Failed to fetch leads" });
  }
});
router4.post("/", async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (isDbConnected()) {
      const result = await query(
        `INSERT INTO leads (email, type) VALUES ($1, $2) RETURNING *`,
        [email, type || "landlord"]
      );
      return res.status(201).json({ success: true, lead: result.rows[0] });
    }
    const lead = store.createLead({ email, type: type || "landlord" });
    res.status(201).json({ success: true, lead });
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ error: err.message || "Failed to create lead" });
  }
});
var leads_default = router4;

// server/routes/favorites.ts
import { Router as Router6 } from "express";
var router5 = Router6();
router5.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "user_id query parameter is required" });
    }
    if (isDbConnected()) {
      const result = await query(
        `SELECT f.*, p.* 
         FROM favorites f
         JOIN properties p ON f.property_id = p.id
         WHERE f.user_id = $1
         ORDER BY f.created_at DESC`,
        [user_id]
      );
      return res.json({ favorites: result.rows });
    }
    const favs = store.getFavorites(user_id);
    res.json({ favorites: favs });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ error: err.message || "Failed to fetch favorites" });
  }
});
router5.post("/toggle", async (req, res) => {
  try {
    const { property_id, user_id } = req.body;
    if (!property_id || !user_id) {
      return res.status(400).json({ error: "property_id and user_id are required" });
    }
    if (isDbConnected()) {
      const existing = await query(
        `SELECT * FROM favorites WHERE property_id = $1 AND user_id = $2`,
        [property_id, user_id]
      );
      if (existing.rows.length > 0) {
        await query(
          `DELETE FROM favorites WHERE property_id = $1 AND user_id = $2`,
          [property_id, user_id]
        );
        return res.json({ favorited: false, message: "Removed from favorites" });
      } else {
        await query(
          `INSERT INTO favorites (property_id, user_id) VALUES ($1, $2)`,
          [property_id, user_id]
        );
        return res.json({ favorited: true, message: "Added to favorites" });
      }
    }
    const result = store.toggleFavorite(property_id, user_id);
    res.json(result);
  } catch (err) {
    console.error("Error toggling favorite:", err);
    res.status(500).json({ error: err.message || "Failed to toggle favorite" });
  }
});
var favorites_default = router5;

// server/index.ts
dotenv3.config();
var app = express();
var PORT = process.env.PORT || 5e3;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
var uploadsDir = path4.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));
app.get(["/", "/api"], (req, res) => {
  res.json({
    status: "ok",
    service: "MedProperties Serverless API",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get(["/api/health", "/health"], (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    database: {
      engine: "PostgreSQL",
      connected: isDbConnected(),
      mode: isDbConnected() ? "live" : "fallback-store"
    },
    storage: {
      engine: "Cloudflare R2",
      configured: isR2Configured,
      bucket: bucketName,
      mode: isR2Configured ? "live-r2" : "local-media"
    }
  });
});
app.use(["/api/properties", "/properties"], properties_default);
app.use(["/api/upload", "/upload"], upload_default);
app.use(["/api/users", "/users"], users_default);
app.use(["/api/inquiries", "/inquiries"], inquiries_default);
app.use(["/api/leads", "/leads"], leads_default);
app.use(["/api/favorites", "/favorites"], favorites_default);
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});
async function startServer() {
  try {
    await initDb();
  } catch (err) {
    console.warn("\u26A0\uFE0F Database init notice:", err.message);
  }
  app.listen(PORT, () => {
    console.log(`\u{1F680} MedProperties Server running on http://localhost:${PORT}`);
    console.log(`\u{1F4CA} Health check: http://localhost:${PORT}/api/health`);
    console.log(`\u{1F4E6} Database: PostgreSQL (${isDbConnected() ? "Connected" : "Fallback active"})`);
    console.log(`\u2601\uFE0F Storage: Cloudflare R2 (${isR2Configured ? "Connected" : "Local media fallback active"})`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var index_default = app;
export {
  index_default as default
};
