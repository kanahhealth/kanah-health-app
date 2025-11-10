# Fonts Usage Guide

## 🎨 **Custom Fonts Setup**

Your app now uses **Inter** (for body text) and **Montserrat** (for headings).

---

## 📚 **Available Font Families**

### **From Theme:**
```typescript
import { FONTS } from '@/constants/theme';

// Usage through theme
const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

// Available fonts:
theme.fonts.regular        // Inter_400Regular
theme.fonts.medium         // Inter_500Medium  
theme.fonts.semiBold       // Inter_600SemiBold
theme.fonts.bold           // Inter_700Bold
theme.fonts.heading        // Montserrat_700Bold (for main headings)
theme.fonts.headingMedium  // Montserrat_600SemiBold (for subheadings)
```

### **Direct Import:**
```typescript
// Import directly in StyleSheet
fontFamily: 'Inter_400Regular'
fontFamily: 'Inter_500Medium'
fontFamily: 'Inter_600SemiBold'
fontFamily: 'Inter_700Bold'
fontFamily: 'Montserrat_600SemiBold'
fontFamily: 'Montserrat_700Bold'
```

---

## 💡 **Best Practices**

### **1. Headings (Titles)**
Use **Montserrat Bold** for main headings:
```typescript
title: {
  fontSize: 28,
  fontFamily: 'Montserrat_700Bold',
  // or
  fontFamily: theme.fonts.heading,
}
```

### **2. Subheadings**
Use **Montserrat SemiBold**:
```typescript
subtitle: {
  fontSize: 18,
  fontFamily: 'Montserrat_600SemiBold',
  // or
  fontFamily: theme.fonts.headingMedium,
}
```

### **3. Body Text**
Use **Inter Regular**:
```typescript
bodyText: {
  fontSize: 14,
  fontFamily: 'Inter_400Regular',
  // or
  fontFamily: theme.fonts.regular,
}
```

### **4. Buttons & Labels**
Use **Inter SemiBold**:
```typescript
buttonText: {
  fontSize: 16,
  fontFamily: 'Inter_600SemiBold',
  // or
  fontFamily: theme.fonts.semiBold,
}
```

### **5. Important/Bold Text**
Use **Inter Bold**:
```typescript
importantText: {
  fontSize: 14,
  fontFamily: 'Inter_700Bold',
  // or
  fontFamily: theme.fonts.bold,
}
```

---

## 🔧 **How to Update Existing Screens**

Replace `fontWeight` with `fontFamily`:

**Before:**
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',  // ❌ Remove this
  }
});
```

**After:**
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',  // ✅ Use this
  }
});
```

---

## 📋 **Font Weight → Font Family Mapping**

| Old (fontWeight)     | New (fontFamily)              | Use Case                |
|----------------------|-------------------------------|-------------------------|
| `'400'` or `'normal'`| `Inter_400Regular`            | Body text               |
| `'500'`              | `Inter_500Medium`             | Secondary text          |
| `'600'` or `'semibold'` | `Inter_600SemiBold`        | Buttons, labels         |
| `'700'` or `'bold'`  | `Inter_700Bold`               | Bold body text          |
| Headings             | `Montserrat_700Bold`          | Main titles             |
| Subheadings          | `Montserrat_600SemiBold`      | Subtitles               |

---

## ✅ **Already Updated Screens**

- ✅ `app/index.tsx` (Splash Screen)
- ✅ `app/(auth)/forgot-password.tsx` (Forgot Password)

---

## 📝 **To Update**

Update these screens to use the new fonts:
- [ ] `app/(auth)/login.tsx`
- [ ] `app/(auth)/signup.tsx`
- [ ] `app/(tabs)/index.tsx`
- [ ] `app/(tabs)/appointments.tsx`
- [ ] `app/(tabs)/calendar.tsx`
- [ ] `app/(tabs)/settings.tsx`
- [ ] All UI components in `components/ui/`

---

## 🎯 **Example: Full Screen Update**

```typescript
import { darkTheme, lightTheme } from '@/constants/theme';

export default function MyScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View>
      <Text style={[styles.title, { fontFamily: theme.fonts.heading }]}>
        Main Title
      </Text>
      <Text style={[styles.subtitle, { fontFamily: theme.fonts.headingMedium }]}>
        Subtitle
      </Text>
      <Text style={[styles.body, { fontFamily: theme.fonts.regular }]}>
        Body text content
      </Text>
      <TouchableOpacity>
        <Text style={[styles.button, { fontFamily: theme.fonts.semiBold }]}>
          Button Text
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    // fontFamily will be set inline from theme
  },
  subtitle: {
    fontSize: 18,
  },
  body: {
    fontSize: 14,
  },
  button: {
    fontSize: 16,
  },
});
```

---

## 🚀 **Fonts are Automatically Loaded**

The fonts are loaded in `app/_layout.tsx` and will be available throughout your app. No additional setup needed!

