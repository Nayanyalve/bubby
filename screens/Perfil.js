import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [nome, setNome] = useState("Usuário");
  const [telefone, setTelefone] = useState("");
  const [fotoURL, setFotoURL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const ref = database.collection("usuarios").doc(user.uid);
        const doc = await ref.get();
        if (doc.exists) {
          const data = doc.data();
          if (data.nome) setNome(data.nome);
          if (data.telefone) setTelefone(data.telefone);
          if (data.fotoURL) setFotoURL(data.fotoURL);
        }
      } catch (error) {
        console.log("Erro ao carregar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) carregarDados();
  }, [user?.uid]);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

  if (loading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={
          fotoURL
            ? { uri: fotoURL }
            : require("../assets/avatar-default.png") 
        }
        style={styles.avatar}
      />

      <Text style={styles.name}>{nome}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.phone}>📞 {telefone}</Text>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate("EditarPerfil")}
      >
        <Text style={styles.actionText}>✏️ Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate("RedefinirSenha")}
      >
        <Text style={styles.actionText}>🔐 Redefinir senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate("Favoritos")}
      >
        <Text style={styles.actionText}>❤️ Meus Favoritos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate("MinhasCompras")}
      >
        <Text style={styles.actionText}>💳 Minhas Compras</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate("CriarEvento")}
      >
        <Text style={styles.actionText}>➕ Criar Evento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate("MeusEventos")}
      >
        <Text style={styles.actionText}>📌 Meus Eventos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  phone: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  action: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
