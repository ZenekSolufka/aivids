import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants' 
import { useState } from 'react'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import Trending from '../../components/Trending'
import useAppwrite from '../../lib/useAppwrite'

const Home = () => {

  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user, setUser, setIsLoggedIn } = useGlobalContext()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
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
            postId={item.$id}
            liked={item.liked}
          />
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>Welcone Back</Text>
                <Text className='text-2xl font-psemibold text-white'>{user?.username}</Text>
              </View>

              <View className='my-1.5'>
                <Image 
                  source={images.smallLogo}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>
            <SearchInput />

            <View className='w-full flex-1'>
              <Text className='text-gray-100 text-lg font-pmedium pb-3'>
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          
          <EmptyState 
            title='No Videos Found'
            subtitle='No videos created yet'
          />
        )}
        refreshControl={
        <RefreshControl 
          refreshing={refreshing}
          onRefresh={onRefresh}
        
        />}

      />
    </SafeAreaView>
  )
}

export default Home