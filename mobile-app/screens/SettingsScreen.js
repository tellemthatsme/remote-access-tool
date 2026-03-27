import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [pushToken, setPushToken] = useState(null);

  useEffect(() => {
    loadSettings();
    getPushToken();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("appSettings");
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.notificationsEnabled ?? true);
        setDarkMode(parsed.darkMode ?? true);
        setAutoRefresh(parsed.autoRefresh ?? true);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const currentSettings = {
        notificationsEnabled,
        darkMode,
        autoRefresh,
        ...newSettings,
      };
      await AsyncStorage.setItem(
        "appSettings",
        JSON.stringify(currentSettings),
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const getPushToken = async () => {
    try {
      const token = await AsyncStorage.getItem("pushToken");
      setPushToken(token);
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "RemotePC Test",
        body: "This is a test notification from RemotePC!",
        sound: true,
      },
      trigger: null,
    });
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    saveSettings({ notificationsEnabled: value });

    if (value) {
      // Request permissions if enabling
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings.",
        );
        setNotificationsEnabled(false);
        saveSettings({ notificationsEnabled: false });
      }
    }
  };

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    saveSettings({ darkMode: value });
    // In a real app, this would change the theme
    Alert.alert(
      "Theme",
      value
        ? "Dark mode enabled"
        : "Light mode would be enabled (not implemented yet)",
    );
  };

  const toggleAutoRefresh = (value) => {
    setAutoRefresh(value);
    saveSettings({ autoRefresh: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{user?.username}</Text>
          <Text style={styles.accountEmail}>{user?.email}</Text>
          <Text style={styles.accountPlan}>Plan: {user?.plan || "Basic"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDesc}>Receive alerts and updates</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#00d4aa" }}
            thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDesc}>Use dark theme</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#767577", true: "#00d4aa" }}
            thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto Refresh</Text>
            <Text style={styles.settingDesc}>
              Automatically refresh PC stats
            </Text>
          </View>
          <Switch
            value={autoRefresh}
            onValueChange={toggleAutoRefresh}
            trackColor={{ false: "#767577", true: "#00d4aa" }}
            thumbColor={autoRefresh ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing</Text>
        <TouchableOpacity style={styles.testBtn} onPress={testNotification}>
          <Text style={styles.testText}>Test Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Info</Text>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceText}>
            Push Token: {pushToken ? "Configured" : "Not set"}
          </Text>
          <Text style={styles.deviceText}>Platform: React Native</Text>
          <Text style={styles.deviceText}>Version: 1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>RemotePC Mobile</Text>
          <Text style={styles.aboutText}>Control your PC from anywhere</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  section: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00d4aa",
  },
  accountEmail: {
    fontSize: 14,
    color: "#8b8b9e",
    marginTop: 4,
  },
  accountPlan: {
    fontSize: 14,
    color: "#4f8cff",
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  settingDesc: {
    fontSize: 12,
    color: "#8b8b9e",
    marginTop: 2,
  },
  testBtn: {
    backgroundColor: "rgba(0, 212, 170, 0.1)",
    borderWidth: 1,
    borderColor: "#00d4aa",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  testText: {
    color: "#00d4aa",
    fontSize: 16,
    fontWeight: "500",
  },
  deviceInfo: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 8,
    padding: 12,
  },
  deviceText: {
    fontSize: 12,
    color: "#8b8b9e",
    marginBottom: 4,
  },
  about: {
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00d4aa",
  },
  aboutText: {
    fontSize: 14,
    color: "#8b8b9e",
    marginTop: 4,
  },
  aboutVersion: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});
