// client/src/components/ApiMessage.tsx
import React, { useEffect, useState } from "react";

export default function ApiMessage() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data: { message: string }) => setMessage(data.message))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to fetch API");
      });
  }, []);

  return <p className="text-lg mb-6">{message}</p>;
}
