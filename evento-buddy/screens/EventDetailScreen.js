import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { evento } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!user?.uid || !evento?.id) return;

    const ref = database
      .collection("favoritos")
      .doc(user.uid)
      .collection("items")
      .doc(evento.id);

    const unsubscribe = ref.onSnapshot((doc) => {
      setIsFavorite(doc.exists);
    });

    return () => unsubscribe();
  }, [user?.uid, evento?.id]);

  const toggleFavorite = async () => {
    try {
      const favRef = database
        .collection("favoritos")
        .doc(user.uid)
        .collection("items")
        .doc(evento.id);

      if (isFavorite) {
        await favRef.delete();
        setIsFavorite(false);
      } else {
        await favRef.set({
          eventId: evento.id,
          title: evento.title,
          price: evento.price,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
    }
  };

  const formatarPreco = (valor) => {
    if (!valor) return "Valor não informado";
    if (typeof valor === "string" && valor.includes("Grátis")) return "Grátis";
    return `${valor.replace(/[^\d,\.]/g, "")}€`;
  };

  const handleComprar = () => {
    if (!user?.uid) {
      Alert.alert("Erro", "Você precisa estar logado para comprar.");
      return;
    }

    navigation.navigate("Pagamento", { evento });
  };

  const abrirMapa = () => {
    if (evento.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        evento.location
      )}`;
      Linking.openURL(url);
    } else {
      Alert.alert("Localização não disponível");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {evento.image && (
          <Image
            source={{ uri: evento.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{evento.title}</Text>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={26}
                color={isFavorite ? "#FF3B30" : "#999"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.detail}>📍 {evento.location}</Text>

          <TouchableOpacity onPress={abrirMapa}>
            <Text style={styles.mapaLink}>📌 Mapa</Text>
          </TouchableOpacity>

          <Text style={styles.detail}>📅 {evento.date}</Text>
          <Text style={styles.price}>💰 {formatarPreco(evento.price)}</Text>

          <Text style={styles.description}>{evento.description}</Text>

          <TouchableOpacity style={styles.button} onPress={handleComprar}>
            <Text style={styles.buttonText}>Comprar bilhete</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  mapaLink: {
    fontSize: 16,
    color: "#B497D6",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B497D6",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#7B2CBF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
