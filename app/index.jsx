import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import { ScrollView, Text, View, Image } from 'react-native';
import { Redirect, router } from "expo-router"
import { StatusBar } from 'expo-status-bar';
import { images } from '../constants'

import CustomButton from '../components/CustomButton';

export default function App() {

  const { loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.AILogo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white text-center font-bold">
            Discover Endless{"\n"}
            Possibilities with{" "}
              <Text className="text-[#5aff01]">AIVids</Text>
            </Text>
          
          </View>
          <Text  className="text-[13px] font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embar on a journey of limitless exploration with AiVids
          </Text>
          <CustomButton 
            title='Continue with Email'
            handlePress={() => {router.push('/sign-in')}}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar 
        backgroundColor='#161622'
        style='light'
      />
    </SafeAreaView>
  );
}

