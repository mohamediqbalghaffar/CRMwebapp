# CRMwebapp — Showcase Edition 🛏️📊

> **A modern, full-featured Kurdish/English CRM & Warehouse Management Web Application** designed for bedding, furniture, and retail enterprises.
>
> This repository is a standalone **Showcase Edition** configured for testing and demonstration.

---

## 🌟 Highlights for Testers & Reviewers

1. **Zero-Auth Showcase Mode (No Sign-Up / Login Required)**:
   - Testers immediately access the full application upon opening.
   - Automatically signed in as **Demo Admin** with access to every section and feature.
   - Includes a quick **Role Switcher** in the sidebar (Admin, Data Manager, Salesman, Program Previewer) so you can preview the UI from different permissions without logging out.

2. **Rich, Realistic Kurdish Mock Data**:
   - **100% Mock Data**: None of the actual business data or credentials have been migrated.
   - Pre-populated with realistic mattresses, beds, pillows, covers, customers across Kurdistan (Sulaymaniyah, Erbil, Duhok), suppliers, multi-month sales orders, purchase invoices, and expenses.
   - Realistic transactions allow the Dashboard KPIs, trend charts, and Break-Even Point (BEP) metrics to display meaningful analytics.

3. **In-Memory & LocalStorage Reactive Store**:
   - Built-in reactive mock store that simulates Firestore queries (`where`, `orderBy`, `limit`), real-time snapshots, transactions, and batch writes.
   - You can add sales, create customers, transfer stock between Warehouse and Showroom, record expenses, and generate receipts — changes persist in your browser's `localStorage`.
   - Click **"نوێکردنەوەی داتای دێمۆ" (Reset Demo Data)** in the sidebar anytime to restore factory mock data.

4. **Zero Cloud Dependencies**:
   - Runs completely client-side without needing Firebase API keys or external databases.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript 5)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `tailwindcss-animate` and RTL support
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/) (shadcn/ui style components)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Form Management**: `react-hook-form` + `zod`
- **Spreadsheets & Receipts**:
  - `xlsx` (SheetJS) for Excel imports and exports
  - `html2canvas` for printable thermal/A4 receipt generation
- **Date Handling**: `date-fns` with Sorani Kurdish (`ckb`) locale support

---

## 🚀 Key Modules & Features

| Module | Route | Key Features |
|---|---|---|
| **Dashboard** | `/dashboard` | Total Sales, Net Profit, Operational Costs vs COGS, Low-Stock alerts, Recent Activity timeline, Profit Margin Trend, Cost Breakdown donut chart, Break-Even Point (BEP) analysis. |
| **Sales** | `/sales` | Order list, interactive sale creation dialog, discount calculator, payment tracking (Fully Paid, Partially Paid, Unpaid), printable receipt preview. |
| **Purchases** | `/purchases` | Supplier invoices, landed cost allocation, bulk Excel import with automatic product matching. |
| **Stock & Warehouse** | `/stock` | Multi-location inventory (Warehouse vs. Shop Showroom), low-stock warnings, zero-stock filter, stock transfer dialog with audit tracking, Excel report export. |
| **Products Catalog** | `/products` | Master SKU catalog, categories (Mattress, Bed, Pillow, Cover), supplier linking, default pricing, Excel export/import. |
| **Customers** | `/customers` | Directory of retail customers, phone numbers, neighborhood addresses, order history. |
| **Suppliers** | `/suppliers` | Supplier directory (BedArt, Armis, ViscoTex, Yatas, etc.) and purchase history. |
| **Expenses** | `/expenses` | Multi-currency operational expense tracking (USD & IQD at live exchange rate), categories: Rent, Salary, Electricity, Transport, Daily. |
| **Tutorial** | `/tutorial` | Interactive walkthrough explaining business workflows, financial formulas, and a toggleable **Confidential Mode** (blurs numbers for screen sharing). |
| **Settings** | `/settings` | General business information, user roles management, data backup tools. |

---

## 💻 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/mohamediqbalghaffar/CRMwebapp.git
cd CRMwebapp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Notice
This project is configured exclusively with mock demonstration data. No confidential business records, customer phone numbers, or proprietary Firebase secrets are contained in this repository.

---

## 📄 License
MIT License. Created by [mohamediqbalghaffar](https://github.com/mohamediqbalghaffar).
