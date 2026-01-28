import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { API_URL } from "./config/appconf";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatbotProps {
  isLoggedIn: boolean;
  backendUrl: string; // just the type
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isLoggedIn,
  backendUrl = API_URL, // default value here
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) return null;

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { sender: "user" as const, text: message }];
    setChatHistory(newHistory);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backendUrl}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});

      const data = await res.json();
      setChatHistory([...newHistory, { sender: "bot" as const, text: data.reply }]);
    } catch (err) {
      console.error(err);
      setChatHistory([...newHistory, { sender: "bot" as const, text: "Error: Could not reach server" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setVisible(true)}>
        <Text style={styles.floatingButtonText}>💬</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.chatContainer}>
            <FlatList
              data={chatHistory}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user" ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
                <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196f3",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: { fontSize: 28, color: "#fff" },
  modalContainer: { flex: 1, justifyContent: "flex-end" },
  chatContainer: {
    height: "50%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
  },
  messageBubble: { padding: 10, borderRadius: 12, marginVertical: 5, maxWidth: "80%" },
  userBubble: { backgroundColor: "#4caf50", alignSelf: "flex-end" },
  botBubble: { backgroundColor: "#e0e0e0", alignSelf: "flex-start" },
  messageText: { color: "#000" },
  inputContainer: { flexDirection: "row", paddingTop: 10, borderTopWidth: 1, borderColor: "#ddd" },
  input: { flex: 1, backgroundColor: "#f5f5f5", borderRadius: 20, paddingHorizontal: 15 },
  sendButton: { justifyContent: "center", alignItems: "center", paddingHorizontal: 15 },
  sendButtonText: { color: "#2196f3", fontWeight: "bold" },
  closeButton: { marginTop: 5, alignSelf: "center" },
  closeButtonText: { color: "#f44336", fontWeight: "bold" },
});
