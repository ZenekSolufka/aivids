import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCurrentUser } from '../../lib/appwrite'
import { signIn } from '../../lib/appwrite'
import { Link, router } from 'expo-router'
import { images } from '../../constants'
import React, { useState } from 'react'

import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'

const SignIn = () => {

  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6" >
          <Image source={images.AILogo} resizeMode='contain' className='w-[115px] h-[35px]'/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to AIVids</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardTyle="email-addres"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e})}
            otherStyles="mt-7"
          />
          <CustomButton 
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have account?
            </Text>
            <Link href='sign-up' className='text-lg font-psemibold text-[#5aff01]'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn