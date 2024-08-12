import React, { useState } from "react";

function ChatComponent() {
  const [input, setInput] = useState("");
  const [responseArray, setResponseArray] = useState([]);

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
        session_id: "abc123",
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let completeResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      completeResponse += chunk;

      // Split the chunks and update the state
      setResponseArray((prevArray) => [...prevArray, chunk]);
    }

    // Process the completeResponse if needed
    console.log("Complete Response:", completeResponse);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Send</button>
      <div>
        <h3>Response:</h3>
        {responseArray.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;
