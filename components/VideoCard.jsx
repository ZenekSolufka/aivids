import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState, useEffect } from 'react'
import { icons } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider';
import { toggleLike } from '../lib/appwrite';

const VideoCard = ({ 
  postId, 
  title, 
  creator, 
  avatar, 
  thumbnail, 
  video, 
  refreshing,
  liked 
}) => {
  const { user } = useGlobalContext();
  const [isLiked, setIsLiked] = useState(liked?.includes(user?.$id) || false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoSource = { uri: video };
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.staysActiveInBackground = true;
    })

  useEffect(() => {
    if (!refreshing) {
      setIsPlaying(false);
      player.pause(); 
      player.currentTime = 0;
    }
  }, [refreshing]);

  useEffect(() => {
    if (isPlaying) {
      player.play(); 
    } else {
      player.pause(); 
      player.currentTime = 0;
    }
  }, [isPlaying]);

  const handleLike = async () => {
    if (!user) return;
    
    const originalState = isLiked;
    setIsLiked(!originalState);
    
    try {
      await toggleLike(postId, user.$id);
    } catch (error) {
      setIsLiked(originalState);
      Alert.alert('Error', 'Could not update like status');
    }
  };

  useEffect(() => {
    setIsLiked(liked?.includes(user?.$id));
  }, [liked, user]);

    return (
      <View className="flex flex-col items-center px-4 mb-14">
        <View className="flex flex-row gap-3 items-start">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-[#5aff01] flex justify-center items-center">
            <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-[6.5px]"
                resizeMode="cover"
              />
            </View>
  
            <View className="flex justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="font-psemibold text-sm text-white"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {creator}
              </Text>
            </View>
          </View>
  
          <TouchableOpacity onPress={handleLike} className="pt-2">
            <Image 
            source={!isLiked ? icons.unliked : icons.liked} 
            className="w-5 h-5" 
            resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>
        {isPlaying ? (
            <VideoView 
              className='w-full h-60 rounded-xl mt-3'
              player={player}
            />
        ) : (
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsPlaying(!isPlaying)}
                className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
            >
                <Image
                    source={{ uri: thumbnail}}
                    className='w-full h-full rounded-xl mt-3'
                    resizeMode='cover'
                />
                <Image
                    source={icons.play}
                    className='w-12 h-12 absolute'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
        </View>
  )
}

export default VideoCard