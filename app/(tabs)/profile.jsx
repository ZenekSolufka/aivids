import { View, FlatList, Image, TouchableOpacity } from 'react-native'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut, userPosts } from '../../lib/appwrite'
import { icons } from '../../constants'
import { useState } from 'react'

import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import useAppwrite from '../../lib/useAppwrite'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { data: posts, refetch } = useAppwrite(() => userPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false)

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({item}) => (
          <VideoCard
            key={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator?.username}
            avatar={item.creator?.avatar}
            refreshing={refreshing}
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity 
              className='w-full items-end mb-10'
              onPress={logout}
            >
            <Image
                source={icons.logout}
                resizeMode="contain"
                className='w-6 h-6'
            />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-[#5aff01] rounded-lg justify-center items-center'>
              <Image
                  source={{ uri: user?.avatar }}
                  className='w-full h-full rounded-[6.5px]'
                  resizeMode='cover'
              />
            </View>
              <InfoBox 
                title={user?.username}
                containerStyles='mt-5'
                titleStyles='text-lg'
              />
            <View className='mt-5 flex-row'>
              <InfoBox 
                title={posts.length || 0}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              <InfoBox 
                title='1.5k'
                subtitle='Followers'
                titleStyles='text-xl'
              />

            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          
          <EmptyState 
            title='No Videos Found'
            subtitle='No videos found for this search query'
          />
        )}
        

      />
    </SafeAreaView>
  )
}

export default Profile