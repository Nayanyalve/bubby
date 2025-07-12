import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EditarEvento() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { eventoId } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const carregarEvento = useCallback(async () => {
    try {
      const doc = await database.collection("eventos").doc(eventoId).get();
      if (doc.exists) {
        const data = doc.data();
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.date);
        setLocation(data.location);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category || "");
      } else {
        Alert.alert("Evento não encontrado.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro ao carregar evento:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do evento.");
    }
  }, [eventoId, navigation]);

  useEffect(() => {
    carregarEvento();
  }, [carregarEvento]);

  const handleSalvar = async () => {
    if (!title || !description || !date || !location || !price || !image || !category) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    try {
      await database.collection("eventos").doc(eventoId).update({
        title,
        description,
        date,
        location,
        price,
        image,
        category,
      });
      Alert.alert("✅ Evento atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      Alert.alert("Erro", "Não foi possível atualizar o evento.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título do evento"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição"
          multiline
        />

        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/AAAA"
        />

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Local do evento"
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Ex: 10 ou 0 para grátis"
        />

        <Text style={styles.label}>Imagem (URL)</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
          placeholder="URL da imagem"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryContainer}>
          {["Festa", "Eventos", "Música"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonSelected,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  voltar: {
    paddingTop: 16,
    paddingLeft: 16,
  },
  voltarText: {
    color: "#B497D6",
    fontSize: 18,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  categoryButtonSelected: {
    backgroundColor: "#7B2CBF",
  },
  categoryButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  categoryButtonTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#7B2CBF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

