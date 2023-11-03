import React, { useState } from 'react';

const DialogflowChatbot = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const openChatbot = () => {
    setChatbotVisible(true);
  };

  const closeChatbot = () => {
    setChatbotVisible(false);
  };

  return (
    <div>
      <button onClick={openChatbot}>Open Chatbot</button>
      {chatbotVisible && (
        <div className="chatbot-modal">
          <div className="chatbot-content">
            <button onClick={closeChatbot} className="close-button">Close</button>
            <iframe
              title="Dialogflow Chatbot"
              width="350"
              height="430"
              allow="microphone;"
              src="https://console.dialogflow.com/api-client/demo/embedded/81ab237a-48d5-4301-bc58-dd1654258671"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogflowChatbot;
