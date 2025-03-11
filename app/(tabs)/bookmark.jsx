import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton';
import VideoCard from '../../components/VideoCard';
import { getLikedPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite'
import { images } from '../../constants'
import { useState } from 'react'

const Bookmark = () => {
  const { user } = useGlobalContext()
  const { data: posts, loading, refetch } = useAppwrite(
    () => getLikedPosts(user?.$id),
    [user?.$id]
  );

  const [refreshing, setRefreshing] = useState(false)
  
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (!user) {
    return (
      <SafeAreaView className='bg-primary h-full justify-center items-center'>
        <Text className='text-white text-lg'>Please login to view bookmarks</Text>
      </SafeAreaView>
    )
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
          <View className='my-6 px-4'>
            <Text className='text-2xl font-psemibold text-white'>Saved Videos</Text>
                
            <View className='mt-6 mb-8'>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          
          <View className='justyfy-center items-center px-4'>
        <Image 
            source={images.empty}
            className='w-[270px] h-[215px]'
            resizeMode='contain'
        />
        <Text className='text-xl text-center font-psemibold text-white mt-2'>No Videos Found</Text>
        <Text className='font-pmedium text-sm text-gray-100'>Go like somee videos to find them here</Text>
        <CustomButton 
            title='Create video'
            handlePress={() => router.push('/create')}
            containerStyles='w-full my-4'
        />
    </View>
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

export default Bookmark