import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'

import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'

// Custom Functions

const TabIcons = ({ focused, icon, title }: any) => {

  if (focused) {

    return (  
      <ImageBackground 
        source={images.highlight}
        className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'
      >
        <Image 
          source={icon} 
          tintColor='#151312' 
          className='size-5'
        ></Image>
        <Text className='text-[#333] text-base font-semibold ml-1'> {title} </Text>                  
      </ImageBackground>
    )
  } 
  
  return (
    <View className='size-full justify-center items-center mt-4 rounded-full'>
      <Image source={icon} tintColor='#c26dbc' className='size-5'></Image>
    </View>
  )
}

// ---

const _layout = () => {
  return (
    <Tabs 
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        },
        tabBarStyle: { //Set Dark mode and light mode features
          backgroundColor: '#0f0D23',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '0f0d23'
        }
      }}
    >
      <Tabs.Screen 
        name='index'
        options={{
          title: "Home",
          headerShown : false,
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} icon={icons.home} title="Home" />
          )
        }}
      />

      <Tabs.Screen 
        name='appointments'
        options={{
          title: "Bookings",
          headerShown : false,
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} icon={icons.search} title="Bookings" />
          )
        }}
      />

      <Tabs.Screen 
        name='calendar'
        options={{
          title: "Calendar",
          headerShown : false,
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} icon={icons.save} title="Calendar" />
          )
        }}
      />

      <Tabs.Screen 
        name='settings'
        options={{
          title: "Settings",
          headerShown : false,
          tabBarIcon: ({ focused }) => (
            <TabIcons focused={focused} icon={icons.person} title="Settings" />
          )
        }}
      />
    </Tabs>
  )
}

export default _layout