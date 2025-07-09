import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function MinhasComprasScreen() {
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

  if (compras.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Você ainda não comprou nenhum ingresso.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={compras}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.info}>🎟️ Quantidade: {item.quantidade || 1}</Text>
          <Text style={styles.info}>💰 Total: {item.total || item.price}</Text>
          <Text style={styles.data}>📅 {formatDate(item.compradoEm)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  info: {
    fontSize: 15,
    marginBottom: 4,
    color: "#333",
  },
  data: {
    fontSize: 14,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
