# AIRAC Cycles Explorer - Modern Edition

A completely redesigned, modern web application built with React and TypeScript that displays all AIRAC (Aeronautical Information Regulation And Control) cycle start and end dates from 2025 to 2099.

## 🚀 New Features in v2.0

### Modern Architecture
- **React 18** with TypeScript for robust, type-safe development
- **Tailwind CSS** for modern, responsive design
- **Framer Motion** for smooth animations and transitions
- **Vite** for lightning-fast development and optimized builds

### Enhanced User Experience
- **Multi-view modes**: Grid, List, Timeline, and Calendar views
- **Advanced filtering**: By year, status, or search terms
- **Smart pagination** with customizable items per page
- **Real-time current cycle tracking** with countdown timers
- **Dark/Light theme** with system preference detection
- **Responsive design** optimized for all devices

### Interactive Features
- **Detailed cycle information** with modal views
- **Quick navigation** to current or specific cycles
- **Export functionality** (CSV, JSON, PDF)
- **Print-optimized** layouts
- **Keyboard shortcuts** for power users
- **Accessibility** compliant with WCAG guidelines

### Data Visualization
- **Interactive charts** showing cycle distributions
- **Timeline visualization** with current position indicators
- **Statistical insights** and analytics
- **Progress tracking** through cycle periods

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns
- **UI Components**: Headless UI

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd airac-cycles
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 🎯 About AIRAC Cycles

The AIRAC (Aeronautical Information Regulation and Control) cycle is a standardized 28-day schedule for updating aeronautical data, ensuring that information like navigation data and procedures is synchronized across the globe.

### Key Information
- **Cycle Duration**: 28 days
- **Annual Cycles**: 13 cycles per year
- **Coverage**: 2025-2099 (975 total cycles)
- **Reference Date**: January 23, 2025 (Cycle 2501)

## 📅 2025 Reference Calendar

| Cycle | Ident | Start Date | End Date |
|-------|-------|------------|----------|
| 1     | 2501  | 23 JAN 25  | 19 FEB 25 |
| 2     | 2502  | 20 FEB 25  | 19 MAR 25 |
| 3     | 2503  | 20 MAR 25  | 16 APR 25 |
| 4     | 2504  | 17 APR 25  | 14 MAY 25 |
| 5     | 2505  | 15 MAY 25  | 11 JUN 25 |
| 6     | 2506  | 12 JUN 25  | 09 JUL 25 |
| 7     | 2507  | 10 JUL 25  | 06 AUG 25 |
| 8     | 2508  | 07 AUG 25  | 03 SEP 25 |
| 9     | 2509  | 04 SEP 25  | 01 OCT 25 |
| 10    | 2510  | 02 OCT 25  | 29 OCT 25 |
| 11    | 2511  | 30 OCT 25  | 26 NOV 25 |
| 12    | 2512  | 27 NOV 25  | 24 DEC 25 |
| 13    | 2513  | 25 DEC 25  | 21 JAN 26 |

## 🎨 Design System

The application follows a modern design system with:
- **Consistent spacing** using Tailwind's spacing scale
- **Accessible color palette** with dark mode support
- **Semantic component structure** for maintainability
- **Motion design** principles for enhanced UX

## 🔧 Development

### Project Structure
```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── contexts/          # React contexts
└── styles/            # Global styles
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checking

### Key Files
- `src/utils/airacCalculator.ts` - Core AIRAC calculation logic
- `src/hooks/useAirac.ts` - Main data management hook
- `src/types/airac.ts` - TypeScript type definitions
- `tailwind.config.js` - Tailwind configuration
- `vite.config.ts` - Vite configuration

## ♿ Accessibility

This application is built with accessibility in mind:
- **ARIA labels** and semantic HTML
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** compliance
- **Focus management** for interactive elements

## 📱 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## ⚠️ Important Notice

This application is designed for reference and educational purposes. For actual operational use in aviation, please refer to official aviation authority sources such as:
- International Civil Aviation Organization (ICAO)
- Federal Aviation Administration (FAA)
- European Union Aviation Safety Agency (EASA)
- Your local aviation authority

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- ICAO for AIRAC standards and specifications
- Aviation community for feedback and requirements
- Open source community for the excellent tools and libraries 