import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const API_BASE_URL = "http://YOUR_LOCAL_IP:3001"; // Replace with your local IP

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { username, password }
        : { username, email: "", password };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      if (response.data.token) {
        // Store token and navigate to dashboard
        navigation.replace("Dashboard", {
          user: response.data.user,
          token: response.data.token,
        });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Authentication failed",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.logo}>🖥️</Text>
        <Text style={styles.title}>RemotePC</Text>
        <Text style={styles.subtitle}>Mobile Control</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isLogin ? "Login" : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
    justifyContent: "center",
    padding: 20,
  },
  loginBox: {
    backgroundColor: "rgba(26, 26, 36, 0.8)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00d4aa",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8b8b9e",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(18, 18, 26, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#00d4aa",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: "#4f8cff",
    fontSize: 14,
  },
});
