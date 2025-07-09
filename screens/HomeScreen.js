import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { database } from "../firebaseConfig";

const categories = ["Todos", "Dançar", "Filmes", "Música"];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [eventos, setEventos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  useEffect(() => {
    const unsubscribe = database
      .collection("eventos")
      .orderBy("criadoEm", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEventos(data);
      });

    return () => unsubscribe();
  }, []);

  const eventosFiltrados = eventos.filter((event) => {
    const matchCategoria =
      categoriaSelecionada !== "Todos"
        ? event.category === categoriaSelecionada
        : true;

    const matchBusca = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategoria && matchBusca;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.location}>📍 Aveiro - Portugal</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar eventos"
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              categoriaSelecionada === cat && styles.selectedCategory,
            ]}
            onPress={() => setCategoriaSelecionada(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                categoriaSelecionada === cat && styles.selectedCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <EventSection
        title={
          categoriaSelecionada === "Todos"
            ? "Todos os Eventos"
            : `Eventos de ${categoriaSelecionada}`
        }
        data={eventosFiltrados}
        navigation={navigation}
      />
    </ScrollView>
  );
}

const EventSection = ({ title, data, navigation }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>

    {data.length === 0 ? (
      <Text style={{ color: "#888" }}>Nenhum evento encontrado.</Text>
    ) : (
      data.map((event) => {
        const preco =
          typeof event.price === "string"
            ? event.price.includes("Grátis")
              ? "Grátis"
              : `${event.price.replace(/[^\d,\.]/g, "")}€`
            : "Valor não definido";

        return (
          <View key={event.id} style={styles.card}>
            {event.image && (
              <Image
                source={{ uri: event.image }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.cardInfo}>📍 {event.location}</Text>
            <Text style={styles.cardInfo}>📝 {event.description}</Text>
            <Text style={styles.cardPrice}>💰 {preco}</Text>

            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => navigation.navigate("Detalhes", { evento: event })}
            >
              <Text style={styles.cardButtonText}>ℹ️ Informações</Text>
            </TouchableOpacity>
          </View>
        );
      })
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  location: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  categories: {
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  eventImage: {
    width: "100%",
    height: 160,
    borderRadius: 6,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardInfo: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 14,
    color: "#1E90FF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

