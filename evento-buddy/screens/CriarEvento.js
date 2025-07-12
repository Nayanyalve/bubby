import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CriarEvento({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const handleCreate = async () => {
    if (!title || !description || !date || !location || !price || !image || !category) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    try {
      await database.collection("eventos").add({
        title,
        description,
        date,
        location,
        price: price.toLowerCase() === "grátis" ? "Grátis" : parseFloat(price).toFixed(2),
        image,
        category,
        createdBy: user.uid,
        criadoEm: new Date().toISOString(),
        id: "", // será preenchido depois se quiser
      });

      Alert.alert("✅ Evento criado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      Alert.alert("Erro", "Não foi possível criar o evento.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botão Voltar */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Perfil")}
          style={styles.voltarButton}
        >
          <Text style={styles.voltarText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Criar Evento</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Título do evento"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Av. Paulista, São Paulo"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          placeholder='Ex: "Grátis" ou "10.00"'
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Imagem (URL)</Text>
        <TextInput
          style={styles.input}
          placeholder="URL da imagem"
          value={image}
          onChangeText={setImage}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {["Música", "Dança", "Filmes"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categorySelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Criar Evento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  voltarButton: {
    marginBottom: 16,
  },
  voltarText: {
    color: "#B497D6", // Roxo claro (para links)
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7B2CBF", // Roxo escuro (botões principais)
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  categorySelected: {
    backgroundColor: "#7B2CBF",
    borderColor: "#7B2CBF",
  },
  categoryText: {
    color: "#333",
    fontWeight: "bold",
  },
  categoryTextSelected: {
    color: "#fff",
  },
});

