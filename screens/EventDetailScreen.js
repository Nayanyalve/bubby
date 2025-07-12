import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
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

  const formatarPreco = (valor) => {
    if (!valor) return "Valor não informado";
    if (typeof valor === "string" && valor.includes("Grátis")) return "Grátis";
    return `${valor.replace(/[^\d,\.]/g, "")}€`;
  };

  const handleComprar = async () => {
    try {
      const uid = user?.uid;
      if (!uid) {
        Alert.alert("Erro", "Você precisa estar logado para comprar.");
        return;
      }

      const ref = database
        .collection("compras")
        .doc(uid)
        .collection("items")
        .doc(evento.id || `${Date.now()}`);

      await ref.set({
        ...evento,
        compradoEm: new Date().toISOString(),
      });

      Alert.alert("✅ Bilhete registrado!");
      navigation.navigate("Pagamento", { evento });
    } catch (error) {
      console.log("Erro ao registrar compra:", error);
      Alert.alert("Erro", "Não foi possível completar a compra.");
    }
  };

  return (
    <ScrollView style={styles.container}>
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
          {/* Ícone de favorito local, não funcional aqui */}
          <Ionicons name="heart-outline" size={26} color="#999" />
        </View>

        <Text style={styles.detail}>📍 {evento.location}</Text>
        <Text style={styles.detail}>📅 {evento.date}</Text>
        <Text style={styles.price}>💰 {formatarPreco(evento.price)}</Text>

        <Text style={styles.description}>{evento.description}</Text>

        <TouchableOpacity style={styles.button} onPress={handleComprar}>
          <Text style={styles.buttonText}>Comprar bilhete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 220,
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
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E90FF",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#1E90FF",
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


