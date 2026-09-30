# MedProperties — Healthcare Real Estate Application

A pixel-perfect, responsive real estate web application modeled directly after **ui.pdf** featuring the **MedProperties** brand (`logo.png`) and backed by **Supabase PostgreSQL**.

---

## 🌟 Features

### 1. UI & Visual Design (Pixel-Perfect to `ui.pdf`)
- **Brand Identity**: Features the MedProperties logo ("BUILT FOR THOSE WHO CARE") in header navigation and footer.
- **Hero Section**:
  - Exact headline: *"Exclusive Real Estate Solutions for Healthcare Professionals"*.
  - Subtitle: *"Founded by doctors, for doctors..."*
  - Stats badges: `50k+ renters` & `10k+ properties`.
  - Multi-tab search card (`Rent` / `Buy` / `Sell`, Location selector with Barcelona/Palm Harbor/Highland Lake/Michigan, and move-in date picker).
  - Map background with location route pins and floating live cards for **Beverly Springfield** (\$2,700/mo) and **Tarpon Bay** (\$1,600/mo).
- **"We make it easy for tenants and landlords"**:
  - Toggle between `[For tenants]` and `[For landlords]` with dynamic content.
  - Floating feature badges: *"Virtual home tour"* and *"Find the best deal"*.
- **"Residential Real Estate Tailored to a Doctor's Lifestyle"**:
  - Live metric counters: `7.4% Property Return Rate`, `3,856 Property in Sell & Rent`, `2,540 Daily Completed Transactions`.
  - Doctor lifestyle perks: Hospital commute < 15 min, 0% down physician mortgage loans, soundproof sleep zones.
- **"Based on your location" (6 Exact Properties from UI)**:
  1. **Palm Harbor** — \$2,095/mo (POPULAR)
  2. **Beverly Springfield** — \$2,700/mo (POPULAR)
  3. **Faulkner Ave** — \$4,550/mo (POPULAR)
  4. **St. Crystal** — \$2,400/mo
  5. **Cove Red** — \$1,500/mo
  6. **Tarpon Bay** — \$1,600/mo
  - Interactive specs on each card: Beds, Bathrooms, Area dimensions ($m^2$).
  - One-click Favorite heart toggle saved into database/storage.
- **Interactive Property Modal**:
  - Photo gallery and 360° Virtual Tour viewer.
  - Hospital proximity indicator (e.g. 1.8 miles to Highland Regional Medical Center).
  - Tour booking & inquiry request form saving directly to Supabase.
- **Testimonials Section**:
  - Featured quote by **Dr. Sarah Jenkins, MD** with avatar and carousel navigation.
- **Landlord Lead Generation Banner**:
  - Deep teal background with *"No Spam Promise"* pill badge.
  - Email capture form connected directly to Supabase `leads` table.
- **Footer**:
  - Complete 6-column directory matching `ui.pdf` (Sell a Home, Buy a Home, Buy/Rent/Sell, Terms & Privacy, About, Resources) + Social links.

---

## 🗄️ Supabase Database Integration

The application is equipped with full Supabase integration.

### Database Tables:
1. `properties`: Stores listings (title, address, city, state, price, beds, baths, dimensions, image, category, popular badge).
2. `leads`: Captures landlord emails from the banner.
3. `inquiries`: Stores private tour requests and messages from healthcare professionals.
4. `favorites`: Stores saved properties.

### Setup Instructions:
1. Open your Supabase Dashboard: [https://supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`. Run the script.
3. In the application:
   - Click the **"Supabase: Ready"** pill in the top navigation bar.
   - Enter your **Project URL** and **Anon Public Key**.
   - Click **"Test Connection"** and **"Save & Connect"**.
   - Alternatively, add them to your `.env` file:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
4. **Built-in Offline / Demo Mode**: The application works immediately out of the box with the 6 properties pre-populated even before connecting your Supabase project.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
