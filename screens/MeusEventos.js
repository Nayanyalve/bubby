import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { database } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function MeusEventos() {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const snapshot = await database
        .collection("eventos")
        .where("createdBy", "==", user?.uid)
        .get();

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEventos(lista);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar seus eventos.");
      console.log("❌ Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (eventoId) => {
    Alert.alert("Excluir evento", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => excluirEvento(eventoId),
      },
    ]);
  };

  const excluirEvento = async (eventoId) => {
    try {
      await database.collection("eventos").doc(eventoId).delete();
      Alert.alert("Evento excluído com sucesso.");
      carregarEventos(); // recarrega a lista
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir.");
      console.log("❌ Erro ao excluir:", error);
    }
  };

useEffect(() => {
  const carregarEventos = async () => {
    // seu código de carregamento
  };
  carregarEventos();
}, []);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (eventos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>Você ainda não criou eventos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.details}>📍 {item.location}</Text>
            <Text style={styles.details}>💰 {item.price}</Text>
            <Text style={styles.details}>📅 {item.date}</Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmarExclusao(item.id)}
            >
              <Text style={styles.deleteText}>Excluir</Text>
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
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
