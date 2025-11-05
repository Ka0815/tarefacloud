import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  
  const CLOUD_NAME = "dfkvrl2y9"; 
  const UPLOAD_PRESET = "atividade3"; 

  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  // ☁ Upload
  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const data = new FormData();
      const publicId = `legal3_${Date.now()}`;

      data.append("file", blob);
      data.append("upload_preset", UPLOAD_PRESET);
      data.append("public_id", publicId);
      data.append("folder", "legal3");
      data.append("tags", "legal3");

      const upload = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await upload.json();
      console.log("Resultado do upload:", result);

      if (result.secure_url) {
        setImages((prev) => [
          ...prev,
          { url: result.secure_url, public_id: result.public_id },
        ]);
      } else {
        Alert.alert("Erro ao fazer upload", JSON.stringify(result));
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      Alert.alert("Erro no upload!");
    } finally {
      setUploading(false);
    }
  };

 
  const deleteImage = async (publicId) => {
    try {
      const BACKEND_URL = "http://localhost:4000/delete-image";

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const result = await response.json();
      console.log("Resultado da exclusão:", result);

      if (result.result === "ok") {
        setImages((prev) => prev.filter((img) => img.public_id !== publicId));
        Alert.alert("Imagem excluída com sucesso!");
      } else {
        Alert.alert("⚠ Erro ao excluir imagem no servidor!", JSON.stringify(result));
      }
    } catch (error) {
      console.log("Erro ao excluir:", error);
      Alert.alert("Não foi possível excluir a imagem.");
    }
  };



  return (
    <View style={styles.container}>
      <Button
        title={uploading ? "Enviando..." : "Selecionar Imagem"}
        onPress={pickImage}
      />

      <FlatList
        data={images}
        keyExtractor={(item) => item.public_id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteImage(item.public_id)}
            >
              <Text style={{ color: "#fff" }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },
});
