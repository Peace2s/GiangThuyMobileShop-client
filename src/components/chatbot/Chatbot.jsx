import React, { useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  useEffect(() => {
    // Load Coze SDK script
    const script = document.createElement("script");
    script.src =
      "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.CozeWebSDK) {
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7510037481980035079",
          },
          componentProps: {
            title: "Coze",
          },
          auth: {
            type: "token",
            token:
              "pat_TeDURJ4UWGPn51maLPhzBPSDh0OANjb9cntb42nMw4QmwgCFxKTdapAQ2gyzuB6A",
            onRefreshToken: function () {
              return "pat_TeDURJ4UWGPn51maLPhzBPSDh0OANjb9cntb42nMw4QmwgCFxKTdapAQ2gyzuB6A";
            },
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="coze-chat-container" style={{ height: "calc(100% - 50px)" }} />
  );
};

export default Chatbot;

