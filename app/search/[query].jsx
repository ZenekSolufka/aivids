import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, FlatList } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { searchPosts} from "../../lib/appwrite";
import { useEffect, useState } from 'react'

import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import useAppwrite from '../../lib/useAppwrite'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    refetch()
  }, [query])
  

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
            <Text className='font-pmedium text-sm text-gray-100'>Search result for:</Text>
            <Text className='text-2xl font-psemibold text-white'>"{query}"</Text>
                
            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query} />
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

export default Search