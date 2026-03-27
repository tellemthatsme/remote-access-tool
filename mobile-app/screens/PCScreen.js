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

export default function PCScreen({ route }) {
  const { pc, token } = route.params;
  const [stats, setStats] = useState(null);
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    fetchPCData();
    const interval = setInterval(fetchPCData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPCData = async () => {
    try {
      const [statsRes, processesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/pc/${pc.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/v1/processes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data);
      setProcesses(processesRes.data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching PC data:", error);
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

  const killProcess = async (processName) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/kill-process`,
        { name: processName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Alert.alert("Success", `Killed ${processName}`);
      fetchPCData();
    } catch (error) {
      Alert.alert("Error", "Failed to kill process");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pcTitle}>{pc.name}</Text>
        <Text
          style={[
            styles.pcStatus,
            pc.status === "online" ? styles.online : styles.offline,
          ]}
        >
          {pc.status}
        </Text>
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
            <Text style={styles.statIcon}>🌡️</Text>
            <Text style={styles.statValue}>{stats.uptime}</Text>
            <Text style={styles.statLabel}>Uptime</Text>
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
          style={[styles.actionButton, styles.killBtn]}
          onPress={() => killProcess("node")}
        >
          <Text style={styles.actionIcon}>☠️</Text>
          <Text style={styles.actionText}>Kill Node</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.dockerBtn]}
          onPress={() => killProcess("docker")}
        >
          <Text style={styles.actionIcon}>🐳</Text>
          <Text style={styles.actionText}>Kill Docker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shutdownBtn]}
          onPress={() => handleAction("shutdown")}
        >
          <Text style={styles.actionIcon}>🔴</Text>
          <Text style={styles.actionText}>Shutdown</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.processesSection}>
        <Text style={styles.sectionTitle}>Top Processes</Text>
        {processes.map((process, index) => (
          <View key={index} style={styles.processCard}>
            <View style={styles.processInfo}>
              <Text style={styles.processName}>{process.name}</Text>
              <Text style={styles.processMem}>{process.memory} GB</Text>
            </View>
            <TouchableOpacity
              style={styles.killProcessBtn}
              onPress={() => killProcess(process.name)}
            >
              <Text style={styles.killProcessText}>Kill</Text>
            </TouchableOpacity>
          </View>
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
  pcTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  pcStatus: {
    fontSize: 16,
    textTransform: "uppercase",
  },
  online: {
    color: "#00d4aa",
  },
  offline: {
    color: "#ef4444",
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
    flexWrap: "wrap",
    padding: 20,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 15,
    padding: 15,
    margin: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  killBtn: {
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  dockerBtn: {
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  shutdownBtn: {
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  processesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  processCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  processInfo: {
    flex: 1,
  },
  processName: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  processMem: {
    fontSize: 12,
    color: "#8b8b9e",
    marginTop: 2,
  },
  killProcessBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  killProcessText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
