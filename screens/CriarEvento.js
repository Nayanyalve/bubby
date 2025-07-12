import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function CriarEvento({ navigation }) {
  const { user } = useAuth();

  const categories = ["Dançar", "Filmes", "Música"];

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagemURL, setImagemURL] = useState("");

  const handleCriar = async () => {
    if (!titulo || !descricao || !preco || !local || !data || !categoria || !imagemURL) {
      Alert.alert("⚠️ Atenção", "Preencha todos os campos!");
      return;
    }

    try {
      const uid = user?.uid;
      if (!uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const precoFormatado =
        preco.trim().toLowerCase() === "grátis"
          ? "Grátis"
          : parseFloat(preco.replace("€", "").replace(",", ".")) || 0;

      await database.collection("eventos").add({
        title: titulo,
        description: descricao,
        price: precoFormatado,
        location: local,
        date: data,
        category: categoria,
        image: imagemURL,
        createdBy: uid,
        criadoEm: new Date().toISOString(),
      });

      Alert.alert("✅ Sucesso", "Evento publicado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Erro ao criar evento:", error);
      Alert.alert("Erro", `Não foi possível criar o evento.\n${error.message}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Criar Evento</Text>

          <TextInput
            placeholder="Título"
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            placeholder="Descrição"
            style={[styles.input, { height: 80 }]}
            multiline
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            placeholder="Preço (ex: 10 ou Grátis)"
            style={styles.input}
            keyboardType="default"
            value={preco}
            onChangeText={setPreco}
          />
          <TextInput
            placeholder="Local"
            style={styles.input}
            value={local}
            onChangeText={setLocal}
          />
          <TextInput
            placeholder="Data (dd/mm/yyyy)"
            style={styles.input}
            value={data}
            onChangeText={setData}
          />
          <TextInput
            placeholder="URL da imagem"
            style={styles.input}
            value={imagemURL}
            onChangeText={setImagemURL}
          />

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categories}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  categoria === cat && styles.selectedCategory,
                ]}
                onPress={() => setCategoria(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    categoria === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCriar}>
            <Text style={styles.buttonText}>Criar Evento</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#1E90FF",
  },
  categoryText: {
    color: "#333",
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

