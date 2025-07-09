import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";

export default function EditarPerfil({ navigation }) {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotoURL, setFotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const ref = database.collection("usuarios").doc(user.uid);
      ref.get().then((doc) => {
        if (doc.exists) {
          const dados = doc.data();
          setNome(dados?.nome || "");
          setTelefone(dados?.telefone || "");
          setFotoURL(dados?.fotoURL || "");
        }
        setLoading(false);
      }).catch((err) => {
        console.log("Erro ao carregar perfil:", err);
        setLoading(false);
      });
    }
  }, [user?.uid]);

  const salvarAlteracoes = async () => {
    if (!nome || !telefone || !fotoURL) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setSalvando(true);
      const ref = database.collection("usuarios").doc(user.uid);
      await ref.set(
        {
          nome,
          telefone,
          fotoURL,
        },
        { merge: true }
      );
      Alert.alert("✅ Sucesso", "Perfil atualizado com sucesso.");
      navigation.goBack();
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{
          uri: fotoURL || "https://i.pravatar.cc/150?img=12",
        }}
        style={styles.avatar}
      />

      <Text style={styles.label}>URL da Imagem</Text>
      <TextInput
        value={fotoURL}
        onChangeText={setFotoURL}
        placeholder="Cole a URL da sua foto"
        style={styles.input}
      />

      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
        style={styles.input}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Seu número"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: "#ccc",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

