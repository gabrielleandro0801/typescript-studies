import { Producer } from "@confluentinc/kafka-javascript/types/kafkajs";
import { createProducer, createTopic, TOPIC_NAME } from "./client";

(async () => {
    await createTopic();

    const producer: Producer = createProducer();

    await producer.connect();
    console.log("🚀 Producer connected");

    console.log("🔥 Sending messages...");
    await producer.send({
        topic: TOPIC_NAME,
        messages: [
            {
                key: "my-key",
                value: JSON.stringify({ date: new Date().toISOString() }),
                headers: {
                    "header-key-1": "header-value-2",
                },
            },
            {
                key: "my-key",
                value: JSON.stringify({ date: new Date().toISOString() }),
                headers: {
                    "header-key-2": "header-value-2",
                },
            }
        ],
    });

    await producer.disconnect();
    console.log("🚀 Producer disconnected");
})();
