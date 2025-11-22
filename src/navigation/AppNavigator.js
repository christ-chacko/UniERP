// src/navigation/AppNavigator.js
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

// Screens
import LoginScreen from "../views/LoginScreen"; //real login screen
import DashboardScreen from "../views/more/DashboardScreen";
import AttendanceScreen from "../views/more/AttendanceScreen";
import FeesScreen from "../views/more/FeesScreen";
import ResultsScreen from "../views/more/ResultsScreen";
import TeacherAttendanceDetailScreen from "../views/more/TeacherAttendanceDetailScreen";
import MarkAttendanceScreen from "../views/more/MarkAttendanceScreen";
import StudentAttendanceScreen from "../views/more/StudentAttendanceScreen";

// Notice Board
import NoticeBoardScreen from "../views/notice/NoticeBoardScreen";
import NewNoticeScreen from "../views/notice/NewNoticeScreen";
import NoticeThreadScreen from "../views/notice/NoticeThreadScreen";

// Chat / Servers
import HomeContainer from "../views/channels/HomeContainer";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* NOTICE STACK*/
function NoticeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NoticeBoard"
        component={NoticeBoardScreen}
        options={{ title: "Notice Board" }}
      />
      <Stack.Screen
        name="NewNotice"
        component={NewNoticeScreen}
        options={{ title: "New Post" }}
      />
      <Stack.Screen
        name="NoticeThread"
        component={NoticeThreadScreen}
        options={{ title: "Comments" }}
      />
    </Stack.Navigator>
  );
}

/* MORE (ERP) STACK*/
function MoreStack() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {user.role === "student" ? (
        <Stack.Screen
          name="Attendance"
          component={StudentAttendanceScreen}
          options={{ title: "My Attendance" }}
        />
      ) : (
        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{ title: "Attendance" }}
        />
      )}
      <Stack.Screen
        name="TeacherAttendanceDetail"
        component={TeacherAttendanceDetailScreen}
      />
      <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
      <Stack.Screen name="Fees" component={FeesScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

/*  MAIN APP (TABS)*/
function MainApp() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Notice"
        component={NoticeStack}
        options={{ title: "Notice" }}
      />
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{ title: "More" }}
      />
    </Tab.Navigator>
  );
}

/* ROOT NAVIGATOR*/
export default function AppNavigator() {
  const { session, user, loading } = useAuth(); // from AuthContext

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLORS.bgLight,
    },
  };

  // Loading screen while checking session
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Navigation structure
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // Not logged in → Show Login
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Logged in → Main App
          <Stack.Screen name="MainApp" component={MainApp} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
