import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import {icons} from '../constants'
import { useState } from 'react'

import React from 'react'

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
  }) => {

    const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#5aff01] flex flex-row items-center">
        <TextInput 
            className="flex-1 text-white font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && !showPassword}
            {...props}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() => 
                setShowPassword(!showPassword)}>
                    <Image 
                        source={!showPassword ? icons.eye : icons.eyeHide}
                        className='w-6 h-6'
                    />

            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField