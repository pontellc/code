import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView, Alert } from "react-native"; // CHANGED: added Alert
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // CHANGED: store logged-in user info after backend success
import { Colors } from "../styles/colors";


export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState(""); // CHANGED: was Username, now email
  const [password, setPassword] = useState("");

  const API_URL = "http://192.168.1.162:5000"; // CHANGED: local backend URL for phone testing

  const handleLogin = async () => { // CHANGED: now checks backend instead of always routing
    try {
      if (!email.trim() || !password.trim()) { // CHANGED: basic validation
        Alert.alert("Error", "Please enter your email and password.");
        return;
      }

      const response = await fetch(`${API_URL}/api/login`, { // CHANGED: call backend login route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(), // CHANGED: send email instead of username
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) { // CHANGED: do not let user in unless backend says login worked
        Alert.alert("Login Failed", data.error || "Invalid email or password.");
        return;
      }

      await AsyncStorage.setItem("userId", String(data.userId)); // CHANGED: save backend-confirmed user info
      await AsyncStorage.setItem("userName", data.name || "");
      await AsyncStorage.setItem("userEmail", data.email || email.trim().toLowerCase());
      await AsyncStorage.setItem("userPreferences", JSON.stringify(data.preferences || {}));

      router.replace("/main_dashboard"); // CHANGED: only route after successful backend login
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <Image
          source={require("../assets/images/SafeBitesLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email" // CHANGED: was Name
          placeholderTextColor={"#674f5d"}
          value={email} // CHANGED: was Username
          onChangeText={setEmail} // CHANGED: was setUsername
          autoCapitalize="none"
          keyboardType="email-address" // CHANGED: email keyboard
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#674f5d"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable onPress={() => console.log("Forgot password pressed")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>

      <View style={styles.bottomText}>
        <Text style={styles.extraText}>
          Don't have an account?{" \n"}
          <Text style={styles.link} onPress={() => router.push("/Sign_up")}>
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: "space-between",
  },

  top: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    color: Colors.secondaryText,
    fontFamily: "Quicksand-Medium",
    paddingLeft: 7
  },

  form: {
    gap: 16,

  },

  input: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
    color: Colors.secondaryText,
  },

  forgot: {
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: -8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",

  },

  button: {
    backgroundColor: Colors.secondaryButton,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
    width: "60%",
    fontFamily: "Quicksand-Medium",
  },

  buttonText: {
    color: Colors.thirdText,
    fontSize: 20,
    fontFamily: "Quicksand-Medium",
  },

  bottomText: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  extraText: {
    color: Colors.secondaryText,
    fontSize: 14,
    textAlign: "center"
  },

  link: {
    color: Colors.secondaryText,
    fontWeight: "bold",
    textAlign: "center"
  },
});