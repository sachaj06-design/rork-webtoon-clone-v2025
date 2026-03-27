import { Tabs } from "expo-router";
import { Home, LayoutGrid, Brush, BookOpen, MoreHorizontal } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

import { Colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandGreen,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.backgroundMain,
          borderTopColor: Colors.surfaceGrey,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ORIGINALS",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="genres"
        options={{
          title: "GENRES",
          tabBarIcon: ({ color }) => <LayoutGrid color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="canvas"
        options={{
          title: "CANVAS",
          tabBarIcon: ({ color }) => <Brush color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="my-series"
        options={{
          title: "MES SÉRIES",
          tabBarIcon: ({ color }) => <BookOpen color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "PLUS",
          tabBarIcon: ({ color }) => <MoreHorizontal color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
