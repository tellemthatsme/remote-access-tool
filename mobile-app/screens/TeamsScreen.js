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

export default function TeamsScreen({ navigation }) {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert("Error", "Please enter a team name");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/teams`,
        {
          name: newTeamName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Alert.alert("Success", "Team created successfully!");
      setNewTeamName("");
      setShowCreateTeam(false);
      loadTeams();
    } catch (error) {
      Alert.alert("Error", "Failed to create team");
    }
  };

  const inviteMember = async (teamId) => {
    const username = await new Promise((resolve) => {
      Alert.prompt("Invite Member", "Enter username to invite:", [
        { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
        { text: "Invite", onPress: (text) => resolve(text) },
      ]);
    });

    if (!username) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/teams/${teamId}/members`,
        {
          username,
          role: "member",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Alert.alert("Success", "Member invited successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to invite member");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setShowCreateTeam(!showCreateTeam)}
        >
          <Text style={styles.createText}>
            {showCreateTeam ? "Cancel" : "+ Create Team"}
          </Text>
        </TouchableOpacity>
      </View>

      {showCreateTeam && (
        <View style={styles.createForm}>
          <TextInput
            style={styles.input}
            placeholder="Team name"
            placeholderTextColor="#666"
            value={newTeamName}
            onChangeText={setNewTeamName}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={createTeam}>
            <Text style={styles.submitText}>Create Team</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.teamsList}>
        {teams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No teams yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first team to collaborate with others
            </Text>
          </View>
        ) : (
          teams.map((team) => (
            <View key={team.id} style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamRole}>
                  {team.owner_id === team.user_id ? "Owner" : team.role}
                </Text>
              </View>
              <View style={styles.teamActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => inviteMember(team.id)}
                >
                  <Text style={styles.actionText}>Invite</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate("TeamDetails", { team })}
                >
                  <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  createBtn: {
    backgroundColor: "#00d4aa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createText: {
    color: "#000",
    fontWeight: "bold",
  },
  createForm: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
  teamsList: {
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
  teamCard: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  teamRole: {
    fontSize: 12,
    color: "#00d4aa",
    backgroundColor: "rgba(0, 212, 170, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamActions: {
    flexDirection: "row",
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
});
