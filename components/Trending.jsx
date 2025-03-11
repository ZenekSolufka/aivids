import { FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video';
import * as Animatable from "react-native-animatable";
import React, { useState } from 'react'
import { icons } from "../constants";


const zoomIn = {
  0: { scale: 0.9},
  1: {scale: 1.1},
};

const zoomOut = {
  0: {scale: 1},
  1: {scale: 0.9},
};

//https://player.vimeo.com/video/949582778?h=d60220d68d

const TrendingItem = ({ activeItem, item }) => {
  const videoSource = { uri: item.video };

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.staysActiveInBackground = true;
  })

  const [play, setPlay] = useState(false)

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <VideoView 
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
          player={player}

        />
      ) : (

        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id.toString()}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      contentOffset={{ x: 155 }}
    />
  )
}

export default Trending