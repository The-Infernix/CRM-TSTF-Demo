

## 🏢 Overview

**TSFS Growth Engine** is a complete Security Operations & Facility Management System designed to help TSFS transform from a security guard supplier into a comprehensive security operations and facility management company.

Built with modern web technologies, this system serves as the operating system for acquiring, closing, and retaining security contracts across Vizag, Hyderabad, and Kakinada.

---

## 🎯 Primary Goals

1. **Generate Leads** - Intelligent lead scoring and tracking
2. **Close Contracts** - Professional proposals and pricing
3. **Retain Clients** - Client portal, contract management, and incident tracking

---

## ✨ Features

### Core Modules

| Module | Description | Key Features |
|--------|-------------|--------------|
| **Dashboard** | Central command center | Real-time KPIs, revenue charts, sales funnel, follow-up alerts |
| **CRM** | Lead management | Add/edit/delete leads, status tracking, intelligent lead scoring |
| **Lead Intelligence** | AI-powered scoring | Hot/Warm/Cold classification based on industry, contact, pain points, budget |
| **Security Audit** | Site assessment | Checklist, risk score (0-100), automated recommendations |
| **Pricing Engine** | Cost calculator | 9 cost components, 20/25/35% margins, PDF export |
| **Proposal Generator** | Professional PDFs | Industry-specific proposals, contract duration options |
| **Marketing Center** | Brand tracking | LinkedIn posts, Google reviews, engagement metrics |
| **Contract Management** | Renewal tracking | 90/60/30 day alerts, one-click renewal |
| **Client Portal** | Client self-service | Attendance, incidents, invoices, reports |
| **Guard Deployment** | Personnel management | Guard database, site assignments, shift management |
| **Incident Reporting** | Security tracking | Severity levels, resolution status, critical alerts |
| **Client Invoices** | Billing | Auto-generation from contracts, GST, PDF download, status tracking |

### User Roles

| Role | Permissions |
|------|-------------|
| **CEO** | Full access to all modules and data |
| **BDM** | Own leads only, proposals, follow-ups |
| **Operations Manager** | Contracts, deployments, incidents, attendance |
| **Marketing Manager** | Marketing metrics, source leads |

---

## 🚀 Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Database** | localStorage (Client-side) |
| **Hosting** | Vercel (Recommended) |
| **Authentication** | Basic (localStorage) |

---

## 📁 Project Structure

```
tsfs-growth/
├── app/
│   ├── page.tsx                    # Login page
│   ├── dashboard/page.tsx          # Dashboard + CRM
│   ├── lead-intelligence/page.tsx  # Lead scoring & AI recommendations
│   ├── audit/page.tsx              # Security audit module
│   ├── pricing/page.tsx            # Pricing engine
│   ├── proposal/page.tsx           # Proposal generator
│   ├── marketing/page.tsx          # Marketing center
│   ├── contracts/page.tsx          # Contract management
│   ├── deployment/page.tsx         # Guard deployment
│   ├── incidents/page.tsx          # Incident reporting
│   ├── invoices/page.tsx           # Client invoices
│   └── client/
│       ├── login/page.tsx          # Client portal login
│       └── dashboard/page.tsx      # Client dashboard
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tailwind.config.js              # Tailwind configuration
└── next.config.js                  # Next.js configuration
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tsfs-growth.git
cd tsfs-growth

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Login Credentials

### Admin Portal

| Email | Password | Role |
|-------|----------|------|
| Any | Any | Select role from dropdown |

### Client Portal

| Email | Password |
|-------|----------|
| `client1@apollohospitals.com` | `123456` |
| `client2@vizagsez.com` | `123456` |
| `client3@cmrmall.com` | `123456` |

---

## 💾 Data Storage

All data is stored in the browser's `localStorage`. This provides:

| Benefit | Limitation |
|---------|------------|
| ✅ Works offline | ⚠️ Data is device-specific |
| ✅ No database setup required | ⚠️ Different computer = different data |
| ✅ Fast performance | ⚠️ Not suitable for production scaling |
| ✅ Easy backup | |

### Data Keys

| Key | Stores |
|-----|--------|
| `tsfs_leads` | All leads |
| `tsfs_audits` | Security audit reports |
| `tsfs_proposals` | Generated proposals |
| `tsfs_contracts` | Active contracts |
| `tsfs_guards` | Guard personnel |
| `tsfs_sites` | Deployment sites |
| `tsfs_deployments` | Guard assignments |
| `tsfs_clients` | Client portal accounts |
| `tsfs_incidents` | Incident reports |
| `tsfs_invoices` | Client invoices |
| `tsfs_linkedin_posts` | Marketing posts |
| `tsfs_google_reviews` | Client reviews |

---

## 📱 Navigation Structure

```
Dashboard
├── CRM
├── Lead Intelligence
├── Security Audit
├── Proposal Generator
├── Pricing Engine
├── Marketing Center
├── Contracts
├── Guard Deployment
├── Incident Reporting
├── Client Invoices
├── Client Portal
└── Reports (Coming Soon)
```

---

## 🧪 Testing

```bash
# Run the app
npm run dev

# Open in browser
http://localhost:3000
```

### Test Scenarios

1. **Login as CEO** - See all leads and modules
2. **Login as BDM** - See only assigned leads
3. **Login as Operations** - See contracts and deployments
4. **Login as Marketing** - See marketing metrics
5. **Client Portal** - Use demo credentials above

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to complete deployment
```

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the .next folder to your hosting provider
```

---

## 🔒 Security Considerations

⚠️ **Important:** This is a demo/development version with localStorage.

For production, consider:

- [ ] Implement server-side authentication
- [ ] Use a real database (PostgreSQL, MongoDB, etc.)
- [ ] Add JWT or session-based auth
- [ ] Implement proper role-based access control (RBAC)
- [ ] Add rate limiting
- [ ] Use environment variables for sensitive data
- [ ] Add HTTPS (via Vercel or other providers)

---

## 🛠️ Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

| Contact | Details |
|---------|---------|
| **Email** | support@tsfs.com |
| **Phone** | +91 XXXXXXXXXX |
| **Website** | https://tsfs.com |

---

## 📋 Changelog

### v1.0.0 (Current)

**Core Features:**
- ✅ Full CRM with lead scoring
- ✅ Security audit module
- ✅ Pricing engine with margins
- ✅ Proposal generator with PDF
- ✅ Contract management with renewal alerts
- ✅ Client portal with reports
- ✅ Guard deployment system
- ✅ Incident reporting
- ✅ Client invoices
- ✅ Marketing center
- ✅ Role-based permissions
- ✅ Dashboard with real-time metrics

**Upcoming Features:**
- 🔲 AI Pitch Builder
- 🔲 Meeting scheduler
- 🔲 Email notifications
- 🔲 Export to Excel
- 🔲 Mobile responsive
- 🔲 Multi-region support
- 🔲 Dark mode
- 🔲 Activity timeline

---

## 📊 System Flow

```
Lead Generation → Lead Scoring → Site Audit → Proposal → Pricing → Contract 
→ Deployment → Attendance → Incident Tracking → Invoicing → Client Portal
```

---

## 🏆 Success Metrics

### For Sales
- Lead conversion rate
- Deal velocity
- Win/loss ratio

### For Operations
- Guard attendance rate
- Incident resolution time
- Contract renewal rate

### For Clients
- Portal usage
- Review ratings
- Retention rate

### For CEO
- Revenue growth
- Pipeline value
- Team performance

---

**Built with ❤️ for TSFS Security Services**

*This software is designed to be the operating system for acquiring, closing, and retaining security contracts across Vizag, Hyderabad, and Kakinada.*
