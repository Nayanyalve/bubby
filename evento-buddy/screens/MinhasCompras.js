import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function MinhasComprasScreen({ navigation }) {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const snapshot = await database
          .collection("compras")
          .doc(user.uid)
          .collection("items")
          .orderBy("compradoEm", "desc")
          .get();

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCompras(data);
      } catch (error) {
        console.error("Erro ao buscar compras:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchCompras();
    }
  }, [user]);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>Carregando suas compras...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Botão Voltar */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Perfil")}
        style={styles.voltarButton}
      >
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Minhas Compras</Text>

      {compras.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Você ainda não comprou nenhum ingresso.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={compras}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>
                {item.title || "Evento sem título"}
              </Text>
              <Text style={styles.info}>
                🎟️ Quantidade: {item.quantidade || 1}
              </Text>
              <Text style={styles.info}>
                💰 Total: {item.total || item.price || "—"}
              </Text>
              <Text style={styles.data}>
                📅 {formatDate(item.compradoEm)}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  voltarButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  voltarText: {
    color: "#B497D6", // roxo claro
    fontSize: 18,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    color: "#8A5FBF", // roxo escuro opcional
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#F5F0FA", // fundo roxo suave
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#8A5FBF", // título em roxo escuro
  },
  info: {
    fontSize: 15,
    marginBottom: 4,
    color: "#444",
  },
  data: {
    fontSize: 14,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
