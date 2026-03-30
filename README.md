# 🎯 Mission Control - Ryan Darby

**Personal Command Center for 2026 Goal Achievement**

A military-grade dashboard for tracking CISSP certification, fitness goals, financial targets, and career progression with real-time intelligence and accountability systems.

![Mission Control Dashboard](https://img.shields.io/badge/Status-Active-green) ![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## 🚀 Overview

This Mission Control system is designed specifically for:
- **CISSP Certification tracking** with study accountability 
- **1,000-mile running goal** with pace monitoring
- **$45k HYSA target** with automated financial tracking
- **Body composition goals** (visible 6-pack by 2026)
- **Reading progression** (10 books annually)

Built for a structured 5am-9:30pm military schedule with no-BS accountability and tough love messaging.

## 📊 Key Features

### **Goal Progress Dashboard**
- Real-time tracking of all 2026 objectives
- Visual progress bars with status indicators
- Performance analytics and trend analysis
- Smart alerting for off-track goals

### **Daily Intelligence Brief**
- 5am pre-workout briefings
- Cybersecurity industry updates
- Fitness and health recommendations  
- Financial optimization opportunities
- Career advancement intel

### **Accountability System**
- Tough love messaging for missed targets
- "Air Force Academy graduate can't handle 30min/day?" alerts
- Recovery protocols for getting back on track
- Performance compliance scoring

### **Operations Status**
- Real-time agent monitoring
- System health metrics
- Local AI model status (Qwen 2.5 7B)
- API connectivity and uptime tracking

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 + TypeScript
- **Styling:** Tailwind CSS
- **Database:** Convex (real-time)
- **Icons:** Lucide React
- **Deployment:** Vercel
- **AI Integration:** Local Qwen 2.5 7B + Cloud models

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/r-darby57/mission-control.git
cd mission-control

# Install dependencies
npm install

# Set up Convex
npx convex dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access Mission Control.

## 📱 Mobile Access

The dashboard is built as a Progressive Web App (PWA) for command center access during:
- Morning commutes (8:30-9:30am)
- Evening commutes (4:30-5:30pm) 
- Travel and remote operations
- Emergency accountability checks

## 🎯 Goal Integration

### **CISSP Certification**
- 30-minute daily study minimum
- Domain-focused practice tracking
- Exam readiness analytics
- Study streak monitoring

### **1,000 Mile Running**
- Weekly pace requirements (19.2 miles)
- Apple Watch data integration
- Weather-optimized scheduling
- Ironman preparation tracking

### **Financial Targets**
- HYSA progression to $45k
- Monthly saving requirements ($1,250)
- Investment performance monitoring
- Financial freedom timeline

### **Body Composition**
- Weekly progress photos
- Body fat percentage tracking
- Sustainable approach (no calorie counting burnout)
- Strength + cardio optimization

## 🔧 Configuration

### **Environment Variables**
```bash
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url
APPLE_HEALTH_API_KEY=your-key
BANKING_API_KEY=your-key
```

### **Customization**
- Modify goals in `src/components/goal-progress-dashboard.tsx`
- Update tough love messages in `src/components/accountability-alerts.tsx`
- Adjust briefing content in `src/components/daily-intel-brief.tsx`
- Configure agent operations in `src/components/operations-status.tsx`

## 📈 Performance Metrics

- **Goal Completion Rate:** Track progress across all 2026 objectives
- **Accountability Compliance:** Monitor adherence to daily/weekly targets
- **System Uptime:** Ensure 24/7 operation for continuous monitoring
- **Intelligence Accuracy:** Validate briefing relevance and actionability

## 🎖️ Military-Grade Features

### **Structured Operations**
- 0500 hours: Automated intelligence briefing
- 0545-0700: Workout window optimization
- 2000 hours: Evening accountability review
- 2130-2200: Mission planning for next day

### **Tough Love Protocols**
- Academy-standard accountability messaging
- Performance deficiency alerting
- Recovery operation recommendations
- Mission-critical priority flagging

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Self-Hosted**
```bash
npm run build
npm start
```

## 🔐 Security

- Local AI processing for sensitive data
- Encrypted API communications
- No external data sharing
- Privacy-first architecture

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [Goal Configuration](./docs/goals.md)
- [API Integration](./docs/api-integration.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

This is a personal mission control system, but feel free to:
- Fork for your own goal tracking
- Submit issues for bugs
- Suggest feature improvements
- Share deployment experiences

## 📄 License

MIT License - Feel free to adapt for your own goal achievement missions.

## 🎯 Success Metrics

**2026 Campaign Objectives:**
- [ ] CISSP Certification: December 2026
- [ ] 1,000 Miles Running: December 31, 2026
- [ ] $45k Emergency Fund: Target by Q4 2026
- [ ] 10 Books Read: Steady monthly pace
- [ ] Visible 6-Pack: Body recomposition by year-end

---

**Mission Statement:** *Providing military-grade accountability and intelligence systems for systematic achievement of personal and professional objectives.*

**Built by:** Ryan Darby | Air Force Academy Graduate | Future CISO