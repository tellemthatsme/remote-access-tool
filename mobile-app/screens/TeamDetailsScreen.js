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
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://YOUR_LOCAL_IP:3001"; // Replace with your server IP

export default function TeamDetailsScreen({ route }) {
  const { team } = route.params;
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [pcs, setPcs] = useState([]);

  useEffect(() => {
    loadTeamDetails();
  }, []);

  const loadTeamDetails = async () => {
    try {
      const [membersRes, pcsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/teams/${team.id}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/pcs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMembers(membersRes.data.members || []);
      setPcs(pcsRes.data.filter((pc) => pc.team_id === team.id));
    } catch (error) {
      console.error("Error loading team details:", error);
    }
  };

  const removeMember = async (memberId) => {
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/api/v1/teams/${team.id}/members/${memberId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );
              loadTeamDetails();
            } catch (error) {
              Alert.alert("Error", "Failed to remove member");
            }
          },
        },
      ],
    );
  };

  const assignPC = async (pcId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/teams/${team.id}/pcs`,
        {
          pcId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      loadTeamDetails();
    } catch (error) {
      Alert.alert("Error", "Failed to assign PC");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamRole}>
          {team.owner_id === team.user_id ? "Team Owner" : "Team Member"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members ({members.length})</Text>
        {members.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.username}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            {team.owner_id === team.user_id &&
              member.user_id !== team.user_id && (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeMember(member.id)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team PCs ({pcs.length})</Text>
        {pcs.map((pc) => (
          <View key={pc.id} style={styles.pcCard}>
            <Text style={styles.pcName}>{pc.name}</Text>
            <Text
              style={[
                styles.pcStatus,
                pc.status === "online" ? styles.online : styles.offline,
              ]}
            >
              {pc.status}
            </Text>
          </View>
        ))}
        {pcs.length === 0 && (
          <Text style={styles.emptyText}>No PCs assigned to this team</Text>
        )}
      </View>

      {team.owner_id === team.user_id && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Invite Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>Assign PCs</Text>
          </TouchableOpacity>
        </View>
      )}
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
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 14,
    color: "#00d4aa",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  memberRole: {
    fontSize: 12,
    color: "#8b8b9e",
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  pcCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  pcName: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  pcStatus: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  online: {
    color: "#00d4aa",
  },
  offline: {
    color: "#ef4444",
  },
  emptyText: {
    textAlign: "center",
    color: "#8b8b9e",
    fontStyle: "italic",
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionBtn: {
    backgroundColor: "#00d4aa",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  actionText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
