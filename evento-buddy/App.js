// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";

// Telas
import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/Signup";
import ForgotPasswordScreen from "./screens/ForgotPassword";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/Perfil";
import EventDetailScreen from "./screens/EventDetailScreen";
import FavoritesScreen from "./screens/Favoritos";
import RedefinirSenha from "./screens/RedefinirSenha";
import PagamentoScreen from "./screens/Pagamento";
import MinhasComprasScreen from "./screens/MinhasCompras";
import CriarEvento from "./screens/CriarEvento";
import MeusEventos from "./screens/MeusEventos";
import EditarPerfil from "./screens/EditarPerfil";
import EditarEvento from "./screens/EditarEvento";

// Auth context
import { AuthProvider, useAuth } from "./context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegação empilhada da aba Home
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Eventos" component={HomeScreen}options={{ headerShown: false }}  />
      <Stack.Screen name="Detalhes" component={EventDetailScreen}options={{ headerShown: false }}  />
      <Stack.Screen
        name="MinhasCompras"
        component={MinhasComprasScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Pagamento" component={PagamentoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CriarEvento" component={CriarEvento} options={{ headerShown: false }} />
      <Stack.Screen name="MeusEventos" component={MeusEventos} options={{ headerShown: false }} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} options={{ headerShown: false }} />
      <Stack.Screen name="EditarEvento" component={EditarEvento}options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Abas principais após login
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Favoritos") iconName = "heart";
          else if (route.name === "Perfil") iconName = "person";
          else if (route.name === "Criar") iconName = "add-circle";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Criar" component={CriarEvento} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navegação com login/cadastro/autenticação
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}


