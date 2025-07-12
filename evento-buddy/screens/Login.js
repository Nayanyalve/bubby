import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const handleLogin = async () => {
    console.log("🔁 handleLogin foi chamado");

    if (!email || !password) {
      Alert.alert("Campos obrigatórios", "Preencha email e senha.");
      return;
    }

    try {
      const fakeUser = { uid: "abc123", email };
      console.log("✅ Simulando login:", fakeUser);
      setUser(fakeUser);
    } catch (error) {
      console.log("❌ Erro no login:", error.message);
      Alert.alert("Erro ao entrar", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Bloco logo + título centralizado */}
        <View style={styles.logoTitleContainer}>
          <Image
            source={require("../assets/logo.png")} // 👈 Coloque sua imagem em assets/logo.png
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Event Bubby</Text>
        </View>

        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.text}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.registerText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  innerContainer: {
    width: "100%",
  },
  logoTitleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  forgotText: {
    textAlign: "right",
    color: "#B497D6", // roxo claro
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#7B2CBF", // roxo escuro
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  registerText: {
    fontSize: 14,
    color: "#B497D6", // roxo claro
    fontWeight: "bold",
  },
});

