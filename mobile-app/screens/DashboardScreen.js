import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://YOUR_LOCAL_IP:3001"; // Replace with your local IP

export default function DashboardScreen({ route, navigation }) {
  const { user, token } = route.params;
  const [stats, setStats] = useState(null);
  const [pcs, setPcs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pcsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/pcs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data);
      setPcs(pcsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleAction = async (action) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/control/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Alert.alert(
        "Success",
        `${action.charAt(0).toUpperCase() + action.slice(1)} initiated`,
      );
    } catch (error) {
      Alert.alert("Error", "Action failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user.username}!</Text>
        <Text style={styles.plan}>Plan: {user.plan}</Text>
      </View>

      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={[styles.statValue, styles.cpu]}>{stats.cpu}%</Text>
            <Text style={styles.statLabel}>CPU</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🧠</Text>
            <Text style={[styles.statValue, styles.ram]}>{stats.ram}%</Text>
            <Text style={styles.statLabel}>RAM</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💾</Text>
            <Text style={styles.statValue}>
              {stats.memUsed}/{stats.memTotal}G
            </Text>
            <Text style={styles.statLabel}>Memory</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{pcs.length + 1}</Text>
            <Text style={styles.statLabel}>PCs</Text>
          </View>
        </View>
      )}

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionButton, styles.killBtn]}
          onPress={() => handleAction("restart")}
        >
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shutdownBtn]}
          onPress={() => handleAction("shutdown")}
        >
          <Text style={styles.actionIcon}>🔴</Text>
          <Text style={styles.actionText}>Shutdown</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pcsSection}>
        <Text style={styles.sectionTitle}>Connected PCs</Text>
        {pcs.map((pc) => (
          <TouchableOpacity
            key={pc.id}
            style={styles.pcCard}
            onPress={() => navigation.navigate("PC", { pc, token })}
          >
            <Text style={styles.pcName}>{pc.name}</Text>
            <Text
              style={[
                styles.pcStatus,
                pc.status === "online" ? styles.online : styles.offline,
              ]}
            >
              {pc.status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  plan: {
    fontSize: 16,
    color: "#00d4aa",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 15,
    padding: 20,
    margin: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  cpu: {
    color: "#f59e0b",
  },
  ram: {
    color: "#06b6d4",
  },
  statLabel: {
    fontSize: 12,
    color: "#8b8b9e",
    textTransform: "uppercase",
  },
  actionsGrid: {
    flexDirection: "row",
    padding: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 15,
    padding: 20,
    margin: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  killBtn: {
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  shutdownBtn: {
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },
  pcsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  pcCard: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  pcName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  pcStatus: {
    fontSize: 12,
    marginTop: 5,
    textTransform: "uppercase",
  },
  online: {
    color: "#00d4aa",
  },
  offline: {
    color: "#ef4444",
  },
});
