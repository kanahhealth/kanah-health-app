# ⚡ Quick Start - Phase 1: Database Connection

## 🎯 What You Need To Do Now

### 1️⃣ Create `.env` File (2 minutes)

Create a file named `.env` in your project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_very_long_anon_key_here
```

**Where to get these values:**
- Go to [https://app.supabase.com](https://app.supabase.com)
- Select your project → Settings ⚙️ → API
- Copy **Project URL** and **anon public** key

### 2️⃣ Restart Expo Server (30 seconds)

```bash
# Stop current server (Ctrl+C)
npm start
```

### 3️⃣ Test Connection (1 minute)

1. Run your app: `npm run ios` or `npm run android`
2. Go to Login screen
3. Tap **"🔧 Test Database Connection"** at the bottom
4. Tap **"Run Connection Test"**
5. You should see: ✅ **"Connected Successfully!"**

---

## ✅ Phase 1 Complete!

Once you see the success message, **Phase 1 is done**. Let me know and we'll proceed to:

🚀 **Phase 2: Authentication - Sign In**
- Email/password authentication
- OAuth providers (Google/Apple)
- Session management
- Onboarding flow routing

---

## 📚 Detailed Guides

- **Environment Setup:** See `ENV_SETUP_GUIDE.md`
- **Phase 1 Details:** See `PHASE_1_SETUP.md`
- **Troubleshooting:** Both guides have troubleshooting sections

---

## 🆘 Quick Troubleshooting

**Error: "Missing Supabase environment variables"**
→ Create `.env` file and restart server

**Error: "Failed to connect to database"**
→ Double-check your Supabase URL and API key

**Test screen not showing**
→ Make sure you're on the Login screen (it only shows in dev mode)

---

## 🎉 What's Been Set Up

✅ Supabase client configuration
✅ Database connection utilities
✅ Authentication helper functions
✅ Test screen for verification
✅ Error handling and logging
✅ TypeScript types for database schema
✅ Secure token storage with Expo SecureStore

---

**Ready for next phase?** Let me know once your connection test passes! 🚀

