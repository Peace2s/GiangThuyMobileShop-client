import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import "./Chatbot.css";

const API_KEY = "AIzaSyCKqWNdYS5Fl5PRk7vAPkvh3Llt3Y2HfHM";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        type: "bot",
        content: "Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const getGeminiResponse = async (userMessage) => {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userMessage,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
      return "Xin lỗi, tôi không hiểu câu hỏi của bạn.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const botResponse = await getGeminiResponse(inputMessage);

    const botMessage = {
      type: "bot",
      content: botResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <Button
          className="chatbot-button"
          type="primary"
          shape="circle"
          icon={<RobotOutlined />}
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Trợ lý ảo</h3>
            <Button type="text" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.type === "user" ? "user-message" : "bot-message"
                }`}
              >
                <Avatar
                  icon={
                    message.type === "user" ? (
                      <UserOutlined />
                    ) : (
                      <RobotOutlined />
                    )
                  }
                  className="message-avatar"
                />
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-timestamp">{message.timestamp}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <Avatar icon={<RobotOutlined />} className="message-avatar" />
                <div className="message-content">
                  <div className="message-text">Đang suy nghĩ...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              suffix={
                <Button
                  type="text"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={isLoading}
                />
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

