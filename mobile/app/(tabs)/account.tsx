import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Ionicons,
  Feather,
  Entypo,
  FontAwesome6,
  AntDesign,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import colors from "@/components/colors";
import { router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const account = () => {
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        console.log("User ID not found");
        return;
      }

      const response = await fetch(api(`user/fetch-user/${userId}`), {
        method: "GET",
      });

      const data = await response.json();
      console.log(data);
      setUser(data.data);
    } catch (error) {
      console.log("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) return <ActivityIndicator />;

  interface UserProfile {
    name: string;
    email: string;
    phoneNumber: string;
    deliveryAddress?: string;
    country?: string;
    profilePicture?: string;
    subscription: string;
    subscriptionExpiryDate: string;
  }

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: "#f6f6f6" }}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 mt-12">
        <View className="flex-row items-center gap-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="text-2xl font-bold">My account</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/Notifications")}>
          <MaterialCommunityIcons name="bell" size={30} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <View className="flex-row items-center mt-4 gap-4">
        <Image
          source={
            user?.profilePicture
              ? { uri: user.profilePicture }
              : require("../../assets/icons/Avatars.png") // fallback image
          }
          className="w-20 h-20 rounded-full"
        />
        <View>
          <Text className="text-lg font-bold">{user?.name}</Text>
          <Text className="font-semibold text-sm text-gray-500">
            {user?.phoneNumber}
          </Text>

          <View
            className="bg-green-100 items-center rounded-full"
            style={{ padding: 1, width: 88 }}
          >
            <Text className="text-green-600 text-sm font-semibold">
              Elite Member
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="rounded-lg p-3 mt-4 items-center"
        style={{ backgroundColor: colors.primary }}
        onPress={() => router.push("/EditProfile")}
      >
        <Text className="text-lg text-white font-semibold">Edit Profile</Text>
      </TouchableOpacity>

      {/* Membership Details */}
      <View className="mt-8 bg-white p-4 rounded-lg">
        <Text className="text-black text-lg font-bold mb-4">
          Membership Details
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="bg-green-100 p-2 rounded-lg">
              <FontAwesome6 name="crown" size={20} color="#10b981" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text className="font-bold">{user?.subscription}</Text>
              <Text className="font-regular text-gray-500 text-sm">
                Valid until {user?.subscriptionExpiryDate}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push("/Pricing")}>
            <Text className="text-green-600 font-bold">Renew</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View className="mt-6 bg-white rounded-lg">
        {/* Order Card */}
        <TouchableOpacity
          onPress={() => router.push("/TrackOrder")}
          className="p-4 rounded-lg "
        >
          <Text className="font-bold text-lg mb-4">Recent Orders</Text>
          <View
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-bold text-black">#ORDER2025</Text>
              <View className="bg-yellow-200 px-2 py-1 rounded-full">
                <Text className="text-xs font-semibold text-yellow-800">
                  Processing
                </Text>
              </View>
            </View>
            <Text className="text-gray-700 mb-1 font-semibold">Carrot</Text>
            <View
              className="flex-row items-center justify-between mt-2 mb-4"
              style={{
                borderBottomWidth: 1,
                borderColor: "#ddd",
                paddingBottom: 10,
              }}
            >
              <Text className="font-semibold text-gray-500">15 items</Text>
              <Text className="font-bold text-lg text-black">₦25,000</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="items-center flex-row gap-2">
                <MaterialCommunityIcons color={"red"} size={16} name="clock" />
                <Text className="text-sm font-semibold text-red-600">
                  Next Day Delivery
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-medium font-semibold text-green-700">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center mt-4 mb-4"
          onPress={() => router.push("/Orders")}
        >
          <Text className="font-bold text-green-600">View All Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Support */}
      <View className="bg-white mt-4 rounded-lg p-4 mb-4">
        <Text className="text-lg font-bold mb-4">Support</Text>
        <TouchableOpacity
          className="flex-row justify-between items-center mb-8"
          onPress={() => router.replace("/Support")}
        >
          <View className="flex-row items-center gap-4">
            <MaterialIcons name="support-agent" size={20} color="#4B5563" />
            <Text className="font-bold">Contact Support</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center mb-8"
          onPress={() => router.replace("/Faq")}
        >
          <View className="flex-row items-center gap-4">
            <AntDesign name="questioncircle" size={20} color="#4B5563" />
            <Text className="font-bold">FAQs</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center mb-8"
          onPress={() => router.replace("/TermsCondition")}
        >
          <View className="flex-row items-center gap-4">
            <MaterialIcons name="my-library-books" size={20} color="#4B5563" />
            <Text className="font-bold">Terms & Conditions</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row justify-between items-center mb-2"
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("user_id");
              logout(); // clear state
              router.replace("/Onboarding"); // navigate to onboarding/login screen
            } catch (err) {
              console.log("Error during logout:", err);
            }
          }}
        >
          <View className="flex-row items-center gap-4">
            <MaterialIcons name="lock" size={20} color="red" />
            <Text className="font-bold" style={{ color: "red" }}>
              Log Out
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default account;
