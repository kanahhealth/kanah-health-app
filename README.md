# 🏥 Kanah Health - React Native (Expo)

A comprehensive postnatal health companion platform designed specifically for mothers in Kenya. This React Native mobile application provides essential health services and support during the postnatal journey.

> 🚀 **Migration Status**: Converting from Next.js to React Native Expo
> 
> **Phase 1: Database Connection** - ✅ **COMPLETE**  
> **Phase 2: Authentication** - ⏳ Pending  
> **Phase 3: Onboarding** - ⏳ Pending

## Features

- **Symptom Checker**: Monitor and track postnatal symptoms
- **Baby Growth Tracking**: Track your baby's development milestones
- **Health Tips**: Access valuable health information and guidance
- **Appointments**: Schedule and manage healthcare appointments
- **Call Nurse**: Direct access to nursing support
- **Multi-language Support**: Available in multiple languages
- **User Authentication**: Secure login and signup system
- **Personalized Dashboard**: Track your health journey

## Tech Stack

- **Framework**: React Native with Expo (~54.0.23)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Storage**: Expo SecureStore
- **Icons**: Lucide React Native
- **State Management**: React Context

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or pnpm (Package manager)
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ekirira22/kanah-health.git
cd kanah-health-1.0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

📖 **Detailed Setup Guide**: See `ENV_SETUP_GUIDE.md` for step-by-step instructions

4. Start the development server:
```bash
npm start
```

5. Run on your device:
```bash
# iOS (macOS only)
npm run ios

# Android
npm run android

# Web
npm run web
```

### ✅ Verify Phase 1 Setup

After installation, test your database connection:

1. Run the app on iOS/Android
2. Navigate to the Login screen
3. Tap **"🔧 Test Database Connection"** (bottom of screen, dev mode only)
4. Tap **"Run Connection Test"**
5. You should see: ✅ **"Connected Successfully!"**

📚 **Need help?** Check:
- `QUICK_START.md` - Fast setup (3 steps)
- `PHASE_1_SETUP.md` - Technical details
- `README_PHASE1.md` - Complete overview

## Available Scripts

- `npm start`: Start the Expo development server
- `npm run ios`: Run on iOS simulator (macOS only)
- `npm run android`: Run on Android emulator
- `npm run web`: Run in web browser
- `npm run lint`: Run ESLint for code linting

## Project Structure

```
kanah-health-1.0/
├── app/                        # Expo Router pages
│   ├── (auth)/                # Authentication screens
│   │   ├── login.tsx          # Login screen
│   │   ├── signup.tsx         # Signup screen
│   │   ├── forgot-password.tsx
│   │   └── test-connection.tsx # ✅ Database test screen (Phase 1)
│   ├── (tabs)/                # Main app tabs
│   │   ├── index.tsx          # Home/Dashboard
│   │   ├── appointments.tsx
│   │   ├── calendar.tsx
│   │   └── settings.tsx
│   └── _layout.tsx            # Root layout
├── lib/                       # ✅ NEW: Utility functions (Phase 1)
│   ├── supabase.ts           # Supabase client config
│   ├── auth.ts               # Authentication utilities
│   ├── database.ts           # Database operations
│   └── index.ts              # Central exports
├── components/                # Reusable UI components
│   └── ui/                   # UI component library
├── constants/                # App constants
│   ├── types.ts             # Database type definitions
│   └── theme.ts             # Theme configuration
├── contexts/                 # React context providers
│   └── AuthContext.tsx
├── types/                    # TypeScript definitions
│   └── env.d.ts             # ✅ NEW: Environment types (Phase 1)
├── assets/                   # Static assets (images, fonts)
├── .env                      # Environment variables (YOU CREATE)
└── Documentation/            # ✅ NEW: Setup guides (Phase 1)
    ├── QUICK_START.md
    ├── ENV_SETUP_GUIDE.md
    ├── PHASE_1_SETUP.md
    └── README_PHASE1.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📋 Implementation Phases

### ✅ Phase 1: Database Connection (COMPLETE)
- Supabase client configuration
- Database connection utilities
- Authentication helper functions
- Test screen with visual feedback
- Comprehensive documentation

### ⏳ Phase 2: Authentication - Sign In (NEXT)
- Email/password sign-in
- Google/Apple OAuth
- Session management
- Onboarding status check
- Navigation flow

### ⏳ Phase 3: Authentication - Sign Up
- Email/password sign-up
- Email verification flow
- OAuth sign-up
- New user handling

### ⏳ Phase 4: Onboarding Flow
- Phone verification
- Mother details form
- Baby details form
- Birth type selection
- Multi-step progress tracking

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | ⚡ 3-step quick setup guide |
| `ENV_SETUP_GUIDE.md` | 📖 Detailed environment configuration |
| `PHASE_1_SETUP.md` | 🔍 Phase 1 technical implementation |
| `README_PHASE1.md` | 📋 Complete Phase 1 overview |

---

## 🧪 Testing Phase 1

```bash
# 1. Create .env file with Supabase credentials
# 2. Restart Expo server
npm start

# 3. Run app
npm run ios    # or npm run android

# 4. Navigate to: Login → "🔧 Test Database Connection"
# 5. Tap "Run Connection Test"
# 6. Verify: ✅ "Connected Successfully!"
```

---

## Support

For support, please contact info@kanah.health

---

## 🎯 Current Status

**Last Updated**: Phase 1 Complete  
**Next Steps**: Awaiting Phase 1 verification before proceeding to Phase 2  
**Ready for Testing**: Yes ✅