import { View, Text, Image } from 'react-native'
import { icons } from "../../constants"
import { Tabs } from 'expo-router'

const TabIcon = ({color, icon, name, focused}) => {
    return (
        <View className='items-center justify-center pt-6 gap-1 w-[100vw]'>
            <Image 
                source={icon}
                tintColor={color}
                className='w-6 h-6'
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular' }  text-[10px]`} style={{color: color}}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#5aff01',
                tabBarInactiveTintColor: '#CDCDE0',
                tabBarStyle: {
                    backgroundColor: '#161622',
                    borderTopColor: '#232533',
                    borderTopWidth: 1,
                    height: 84
                }
                
            }}
        >
            <Tabs.Screen 
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name='Home'
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name="bookmark"
                options={{
                    title: 'Bookmark',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                            icon={icons.bookmark}
                            color={color}
                            name='Bookmark'
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name="create"
                options={{
                    title: 'Create',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                            icon={icons.plus}
                            color={color}
                            name='Create'
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen 
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({color, focused}) => (
                        <TabIcon 
                            icon={icons.profile}
                            color={color}
                            name='Profile'
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout