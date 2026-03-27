import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://YOUR_LOCAL_IP:3001"; // Replace with your server IP

export default function FilesScreen() {
  const { token } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    // In a real implementation, this would fetch from the server
    // For now, we'll show a placeholder
    setUploadedFiles([]);
  };

  const pickAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        await uploadFile(result);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const uploadFile = async (fileData) => {
    setIsUploading(true);
    try {
      const formData = new FormData();

      // Create file object for upload
      const fileToUpload = {
        uri: fileData.uri,
        name: fileData.name,
        type: "application/octet-stream",
      };

      formData.append("file", fileToUpload);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", "File uploaded successfully!");
        loadUploadedFiles();
      } else {
        Alert.alert("Error", result.error || "Upload failed");
      }
    } catch (error) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFile = async (fileName) => {
    try {
      // In a real implementation, this would download from the server
      Alert.alert("Info", "File download would be implemented here");
    } catch (error) {
      Alert.alert("Error", "Download failed");
    }
  };

  const renderFileItem = ({ item }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileSize}>{item.size}</Text>
      </View>
      <TouchableOpacity
        style={styles.downloadBtn}
        onPress={() => downloadFile(item.name)}
      >
        <Text style={styles.downloadText}>↓</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[styles.uploadBtn, isUploading && styles.uploadBtnDisabled]}
          onPress={pickAndUploadFile}
          disabled={isUploading}
        >
          <Text style={styles.uploadIcon}>📤</Text>
          <Text style={styles.uploadText}>
            {isUploading ? "Uploading..." : "Upload File"}
          </Text>
          <Text style={styles.uploadSubtext}>Max 100MB</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filesSection}>
        <Text style={styles.sectionTitle}>Uploaded Files</Text>
        {uploadedFiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyText}>No files uploaded yet</Text>
            <Text style={styles.emptySubtext}>
              Upload files to transfer them to your PC
            </Text>
          </View>
        ) : (
          <FlatList
            data={uploadedFiles}
            renderItem={renderFileItem}
            keyExtractor={(item) => item.name}
            style={styles.filesList}
          />
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
  uploadSection: {
    padding: 20,
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: "rgba(0, 212, 170, 0.1)",
    borderWidth: 2,
    borderColor: "#00d4aa",
    borderStyle: "dashed",
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
  },
  uploadBtnDisabled: {
    opacity: 0.5,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00d4aa",
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#8b8b9e",
  },
  filesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
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
  filesList: {
    maxHeight: 400,
  },
  fileItem: {
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
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 12,
    color: "#8b8b9e",
    marginTop: 4,
  },
  downloadBtn: {
    backgroundColor: "#4f8cff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  downloadText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
