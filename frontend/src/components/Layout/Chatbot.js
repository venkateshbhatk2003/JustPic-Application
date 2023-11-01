import React, { useState } from 'react';

const DialogflowChatbot = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setChatbotVisible((prevVisible) => !prevVisible);
  };

  return (
    <div>
      <button onClick={toggleChatbot}>
        {chatbotVisible ? 'Close Chatbot' : 'Open Chatbot'}
      </button>
      {chatbotVisible && (
        <iframe
          title="Dialogflow Chatbot"
          width="350"
          height="430"
          allow="microphone;"
          src="https://console.dialogflow.com/api-client/demo/embedded/81ab237a-48d5-4301-bc58-dd1654258671"
        ></iframe>
      )}
    </div>
  );
};

export default DialogflowChatbot;
