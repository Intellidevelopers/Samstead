import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import colors from "@/components/colors";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Ensure the dependency is installed
import { push } from "expo-router/build/global-state/routing";
import { api } from "@/api";

const ResetPassword = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { email: expectedEmail } = useLocalSearchParams();

  useEffect(() => {
    if (expectedEmail && typeof expectedEmail === "string") {
      setEmail(expectedEmail);
    }
  }, [expectedEmail]);

  const handleResetPassword = async () => {
    setLoading(true);

    try {
      const response = await fetch(api("auth/set-new-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.message === "Password Changed Successfully") {
        console.log("Password Changed Successfully");
        // Navigate to the main screen or dashboard
        router.push("/LoginScreen"); // Replace with your actual navigation method
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "An error occurred during login."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-10">
      {/* Logo & Close Icon */}
      <View className="flex-row justify-between items-center mb-4 mt-4">
        <Image
          source={require("../assets/icons/logo.png")} // Replace with your logo path
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text className="text-2xl font-bold mb-1 text-center">
        Reset Your Password
      </Text>
      <Text className="text-gray-500 text-lg font-semibold text-center mb-8">
        Enter New Password
      </Text>

      {/* Password */}
      <Text className="text-lg text-gray-600 font-semibold mb-2">
        New Password
      </Text>
      <View className="flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-3 mb-4">
        <FontAwesome name="lock" color={"#666"} size={20} />
        <TextInput
          placeholder="Create new password"
          secureTextEntry
          className="flex-1"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Text className="text-lg text-gray-600 font-semibold mb-2">
        Confirm New Password
      </Text>
      <View className="flex-row gap-4 items-center border border-gray-300 rounded-lg px-4 py-3 mb-4">
        <FontAwesome name="lock" color={"#666"} size={20} />
        <TextInput
          placeholder="Confirm new password"
          secureTextEntry
          className="flex-1"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Create Account Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          className="py-4 rounded-lg mb-6"
          style={{ backgroundColor: colors.primary }}
          onPress={handleResetPassword}
        >
          <Text className="text-white text-center text-lg font-semibold text-base">
            Reset
          </Text>
        </TouchableOpacity>
      )}

      {/* Login Link */}
      <Text className="text-center text-lg font-semibold text-gray-500">
        Already have an account?{" "}
        <Text
          onPress={() => router.push("/LoginScreen")} // Make sure this route exists
          className="text-green-700 font-semibold"
        >
          Login
        </Text>
      </Text>
      <StatusBar style="dark" backgroundColor="white" />
    </ScrollView>
  );
};

export default ResetPassword;
