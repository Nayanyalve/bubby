import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function PagamentoScreen({ route, navigation }) {
  const { user } = useAuth();
  const { evento } = route.params;
  const [quantidade, setQuantidade] = useState(1);

  const precoNumerico = parseFloat(
    (evento?.price || "").replace("€", "").replace(",", ".").trim()
  );

  const total = isNaN(precoNumerico) ? 0 : precoNumerico * quantidade;

  const handleConfirmarCompra = async () => {
    if (!user?.uid) {
      Alert.alert("Erro", "Você precisa estar logado.");
      return;
    }

    try {
      const ref = database
        .collection("compras")
        .doc(user.uid)
        .collection("items")
        .doc(`${evento.id || Date.now()}`);

      await ref.set({
        ...evento,
        quantidade,
        total: isNaN(total) ? "Grátis" : `${total.toFixed(2)}€`,
        compradoEm: new Date().toISOString(),
      });

      Alert.alert("✅ Compra concluída com sucesso!", "", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
      Alert.alert("Erro", "Não foi possível concluir a compra.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Pagamento</Text>

        <Text style={styles.label}>Evento:</Text>
        <Text style={styles.value}>{evento?.title || "Sem título"}</Text>

        <Text style={styles.label}>Preço unitário:</Text>
        <Text style={styles.value}>
          {isNaN(precoNumerico) ? "Grátis" : `${precoNumerico.toFixed(2)}€`}
        </Text>

        <Text style={styles.label}>Quantidade:</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantidade}</Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantidade(quantidade + 1)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Total:</Text>
        <Text style={styles.total}>
          {isNaN(total) ? "Grátis" : `${total.toFixed(2)}€`}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleConfirmarCompra}>
          <Text style={styles.buttonText}>Confirmar Compra</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#8A5FBF",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#8A5FBF",
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 16,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    color: "#444",
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B497D6",
    marginTop: 8,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  qtyButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyValue: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: "#8A5FBF",
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

