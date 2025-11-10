import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { darkTheme, lightTheme } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, useColorScheme } from 'react-native';

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
  tabBarActiveColor: string;
  tabBarInactiveColor: string;
}

const TabIcon = React.memo<TabIconProps>(({ focused, icon, title, tabBarActiveColor, tabBarInactiveColor }) => {
  if (focused) {
    return (  
      <ImageBackground 
        source={images.highlight}
        style={styles.focusedContainer}
        imageStyle={styles.focusedImage}
      >
        <Image 
          source={icon} 
          tintColor={tabBarActiveColor}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={[styles.focusedText, { color: tabBarActiveColor }]}>
          {title}
        </Text>                  
      </ImageBackground>
    );
  } 
  
  return (
    <View style={styles.unfocusedContainer}>
      <Image 
        source={icon} 
        tintColor={tabBarInactiveColor}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
});

TabIcon.displayName = 'TabIcon';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  // Memoize theme-dependent values
  const tabBarStyle = useMemo(() => ({
    backgroundColor: theme.background,
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 36,
    height: 52,
    position: 'absolute' as const,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  }), [theme]);

  const tabBarActiveColor = colorScheme === 'dark' ? '#FFFFFF' : '#151312';
  const tabBarInactiveColor = theme.primary;

  return (
    <Tabs 
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle,
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.home} 
              title="Home"
              tabBarActiveColor={tabBarActiveColor}
              tabBarInactiveColor={tabBarInactiveColor}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="appointments"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.search} 
              title="Bookings"
              tabBarActiveColor={tabBarActiveColor}
              tabBarInactiveColor={tabBarInactiveColor}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.save} 
              title="Calendar"
              tabBarActiveColor={tabBarActiveColor}
              tabBarInactiveColor={tabBarInactiveColor}
            />
          )
        }}
      />

      <Tabs.Screen 
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.person} 
              title="Settings"
              tabBarActiveColor={tabBarActiveColor}
              tabBarInactiveColor={tabBarInactiveColor}
            />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    minWidth: 112,
    minHeight: 64,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
  },
  focusedImage: {
    borderRadius: 50,
  },
  icon: {
    width: 20,
    height: 20,
  },
  focusedText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  unfocusedContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 50,
  },
});
