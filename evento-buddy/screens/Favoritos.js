import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = database
      .collection("favoritos")
      .doc(user.uid)
      .collection("items")
      .onSnapshot((snapshot) => {
        const favs = snapshot.docs.map((doc) => ({
          id: doc.id, // ID do documento do Firestore (necessário para deletar)
          ...doc.data(), // dados do evento, incluindo eventId
        }));
        setFavorites(favs);
      });

    return () => unsubscribe();
  }, [user?.uid]);

  const removeFavorite = async (id) => {
    try {
      console.log("Removendo favorito com ID:", id);
      await database
        .collection("favoritos")
        .doc(user.uid)
        .collection("items")
        .doc(id)
        .delete();
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Ionicons name="heart" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      <Text style={styles.price}>
        💰 {item.price === 0 ? "Grátis" : `${item.price}€`}
      </Text>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() =>
          navigation.navigate("EventDetailScreen", {
            eventId: item.eventId || item.id,
          })
        }
      >
        <Text style={styles.buttonText}>ℹ️ Informações</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Perfil")}
        style={styles.voltarButton}
      >
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>❤️ Meus Favoritos</Text>

      {favorites.length === 0 ? (
        <Text style={{ color: "#999", fontSize: 16 }}>Nenhum favorito.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  voltarButton: {
    marginBottom: 10,
  },
  voltarText: {
    color: "#B497D6", // Roxo claro para links
    fontSize: 18,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    color: "#B497D6", // Preço em roxo claro
    marginBottom: 10,
  },
  infoButton: {
    backgroundColor: "#7B2CBF", // Botão roxo escuro
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


