// client/src/components/ApiMessage.jsx
import React, { useEffect, useState } from "react";

export default function ApiMessage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to fetch API");
      });
  }, []);

  return <p className="text-lg mb-6">{message}</p>;
}
