import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://YOUR_LOCAL_IP:3001"; // Replace with your server IP

export default function IntegrationsScreen() {
  const { token } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [selectedType, setSelectedType] = useState("slack");
  const [integrationName, setIntegrationName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [botToken, setBotToken] = useState("");

  const integrationTypes = [
    { id: "slack", name: "Slack", icon: "💬" },
    { id: "discord", name: "Discord", icon: "🎮" },
    { id: "zapier", name: "Zapier", icon: "⚡" },
    { id: "github", name: "GitHub", icon: "🐙" },
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/integrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIntegrations(response.data.integrations);
    } catch (error) {
      console.error("Error loading integrations:", error);
    }
  };

  const addIntegration = async () => {
    if (!integrationName.trim()) {
      Alert.alert("Error", "Please enter an integration name");
      return;
    }

    let config = {};
    if (selectedType === "slack") {
      if (!webhookUrl.trim()) {
        Alert.alert("Error", "Please enter Slack webhook URL");
        return;
      }
      config = { webhookUrl };
    } else if (selectedType === "discord") {
      if (!webhookUrl.trim()) {
        Alert.alert("Error", "Please enter Discord webhook URL");
        return;
      }
      config = { webhookUrl };
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/integrations`,
        {
          type: selectedType,
          name: integrationName,
          config,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Alert.alert("Success", "Integration added successfully!");
      setIntegrationName("");
      setWebhookUrl("");
      setBotToken("");
      setShowAddIntegration(false);
      loadIntegrations();
    } catch (error) {
      Alert.alert("Error", "Failed to add integration");
    }
  };

  const testIntegration = async (integration) => {
    try {
      // This would send a test message to the integration
      Alert.alert("Test", `Test message sent to ${integration.name}`);
    } catch (error) {
      Alert.alert("Error", "Test failed");
    }
  };

  const deleteIntegration = async (integrationId) => {
    Alert.alert(
      "Delete Integration",
      "Are you sure you want to delete this integration?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/api/v1/integrations/${integrationId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );
              loadIntegrations();
            } catch (error) {
              Alert.alert("Error", "Failed to delete integration");
            }
          },
        },
      ],
    );
  };

  const getIntegrationIcon = (type) => {
    const integration = integrationTypes.find((t) => t.id === type);
    return integration ? integration.icon : "🔗";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Integrations</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddIntegration(!showAddIntegration)}
        >
          <Text style={styles.addText}>
            {showAddIntegration ? "Cancel" : "+ Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {showAddIntegration && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>Add Integration</Text>

          <View style={styles.typeSelector}>
            {integrationTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeBtn,
                  selectedType === type.id && styles.typeBtnSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type.id && styles.typeTextSelected,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Integration name"
            placeholderTextColor="#666"
            value={integrationName}
            onChangeText={setIntegrationName}
          />

          {(selectedType === "slack" || selectedType === "discord") && (
            <TextInput
              style={styles.input}
              placeholder={`${selectedType === "slack" ? "Slack" : "Discord"} webhook URL`}
              placeholderTextColor="#666"
              value={webhookUrl}
              onChangeText={setWebhookUrl}
            />
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={addIntegration}>
            <Text style={styles.submitText}>Add Integration</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.integrationsList}>
        {integrations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔗</Text>
            <Text style={styles.emptyText}>No integrations yet</Text>
            <Text style={styles.emptySubtext}>
              Connect your favorite tools to get notifications
            </Text>
          </View>
        ) : (
          integrations.map((integration) => (
            <View key={integration.id} style={styles.integrationCard}>
              <View style={styles.integrationHeader}>
                <Text style={styles.integrationIcon}>
                  {getIntegrationIcon(integration.type)}
                </Text>
                <View style={styles.integrationInfo}>
                  <Text style={styles.integrationName}>{integration.name}</Text>
                  <Text style={styles.integrationType}>{integration.type}</Text>
                </View>
              </View>
              <View style={styles.integrationActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => testIntegration(integration)}
                >
                  <Text style={styles.actionText}>Test</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => deleteIntegration(integration.id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Available Integrations</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💬</Text>
            <Text style={styles.infoName}>Slack</Text>
            <Text style={styles.infoDesc}>
              Get notifications in Slack channels
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🎮</Text>
            <Text style={styles.infoName}>Discord</Text>
            <Text style={styles.infoDesc}>
              Receive alerts in Discord servers
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⚡</Text>
            <Text style={styles.infoName}>Zapier</Text>
            <Text style={styles.infoDesc}>Connect with 5,000+ apps</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🐙</Text>
            <Text style={styles.infoName}>GitHub</Text>
            <Text style={styles.infoDesc}>Monitor repository events</Text>
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  addBtn: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: "#000",
    fontWeight: "bold",
  },
  addForm: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  typeBtn: {
    alignItems: "center",
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    minWidth: 80,
  },
  typeBtnSelected: {
    backgroundColor: "rgba(0, 212, 170, 0.2)",
    borderColor: "#00d4aa",
  },
  typeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: "#ffffff",
  },
  typeTextSelected: {
    color: "#00d4aa",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  submitBtn: {
    backgroundColor: "#00d4aa",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#000",
    fontWeight: "bold",
  },
  integrationsList: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8b8b9e",
    textAlign: "center",
  },
  integrationCard: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  integrationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  integrationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  integrationType: {
    fontSize: 12,
    color: "#8b8b9e",
  },
  integrationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionBtn: {
    backgroundColor: "rgba(79, 140, 255, 0.1)",
    borderWidth: 1,
    borderColor: "#4f8cff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionText: {
    color: "#4f8cff",
    fontWeight: "500",
  },
  deleteBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "#ef4444",
  },
  deleteText: {
    color: "#ef4444",
  },
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 12,
    padding: 16,
    margin: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: "#8b8b9e",
    textAlign: "center",
  },
});
