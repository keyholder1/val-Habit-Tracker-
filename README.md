# Private Habit & Life Analytics Tracker

A premium, whitelist-only habit tracking web application with interactive analytics and continuous timeline tracking.

 Features

- **Premium UI/UX**: Glass morphism design, smooth animations, and vibrant color palette
- **Interactive Landing Page**: WebGL particle system for special user (Nandini)
- **Continuous Timeline**: No resets - infinite scroll through historical data
- **Flexible Goal System**: User-defined goals with customizable weekly targets
- **Real-time Progress**: Live progress bars and completion calculations
- **Floating Notes**: Draggable, auto-saving notes system
- **Advanced Analytics**: 23 auto-generated graph types including:
  - Time Trends (Daily, Weekly, Monthly, Yearly, Rolling Averages)
  - Goal Comparisons (Weekly, Monthly, Stacked)
  - Consistency Metrics (Streaks, Miss Frequency, Radar Charts)
  - Distribution (Pie Charts, Scatter Plots)
  - Heatmaps (Calendar, Weekly Density, Time-of-Week)
  - Premium Insights (Momentum, Stability, Lifetime Cumulative)

Authentication

- **Google OAuth** only
- **Whitelist restricted** to:
  - nandini.zunder@gmail.com
  - arnav.nishant.deshpande@gmail.com

 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Graphics**: Three.js, Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js

 Setup

1. **Clone and install**:
   ```bash
   cd Val
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables**:
   Copy `.env.local.example` to `.env.local` and fill in:
   - `DATABASE_URL`: PostgreSQL connection string
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000` for local dev

3. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open**: [http://localhost:3000](http://localhost:3000)

 Usage

1. Sign in with whitelisted Google account
2. Add goals from the sidebar (goal name + weekly target)
3. Check off daily completions in the timeline
4. View analytics dashboard for insights
5. Take notes with floating notes feature

## 🗄 Database Schema

- **Users**: Email, authentication data
- **Goals**: User-defined goals with default targets
- **WeeklyLogs**: Checkbox states (7 days) per goal per week
- **Notes**: User notes with optional linking

 Development Notes

- Continuous timeline (no weekly resets)
- All graphs use mock data - implement real aggregation in `lib/analytics.ts`
- Interactive background optimized for 60fps
- Prisma migrations in `prisma/` directory

 Design Philosophy

- Soft, calm color palette
- Premium glass morphism effects
- Smooth animations throughout
- Data-rich, analytics-heavy interface
- Mobile responsive

 License

Private project - not for public use

