import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { database } from "../firebaseConfig";

const categories = ["Todos", "Festa", "Eventos", "Música"];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [eventos, setEventos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [cidade, setCidade] = useState(null);
  const [pais, setPais] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    // Obter localização
    const obterLocalizacao = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão negada", "Não foi possível acessar sua localização.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });

        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const lugar = reverseGeocode[0];
          setCidade(lugar.city || lugar.subregion);
          setPais(lugar.country);
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
      }
    };

    obterLocalizacao();
  }, []);

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

  const abrirLocalizacaoNoMapa = () => {
    if (!coords) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url);
  };

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {cidade && pais ? (
          <TouchableOpacity onPress={abrirLocalizacaoNoMapa}>
            <Text
              style={[
                styles.location,
                { textDecorationLine: "underline", color: "#007AFF" },
              ]}
            >
              📍 {cidade}, {pais}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.location}>📍 Localização...</Text>
        )}

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
    </SafeAreaView>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  location: {
    fontSize: 16,
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
    flexDirection: "row",
    flexWrap: "wrap",
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
    backgroundColor: "#7B2CBF",
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
    color: "#7B2CBF",
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: "#7B2CBF",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


