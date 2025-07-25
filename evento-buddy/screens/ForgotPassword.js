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
import { auth } from "../firebaseConfig";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }

    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert(
        "Email enviado",
        "Verifique sua caixa de entrada para redefinir sua senha."
      );
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro ao enviar e-mail", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        {/* Logo acima do título */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.subtitle}>
          Informe seu e-mail para receber um link de redefinição.
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Enviar e-mail</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backText}>Voltar para login</Text>
        </TouchableOpacity>
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
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7B2CBF", // Roxo escuro
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backText: {
    textAlign: "center",
    color: "#B497D6", // Roxo claro
    fontSize: 14,
    marginTop: 8,
  },
});

