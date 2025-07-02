import { Consumer } from "@confluentinc/kafka-javascript/types/kafkajs";
import { createConsumer, createTopic, TOPIC_NAME } from "./client";

(async () => {
    await createTopic();

    const groupId = "my-consumer";
    const clientId = "consumer-1";
    const consumer: Consumer = createConsumer(groupId, clientId);

    await consumer.connect();
    console.log("🚀 Consumer connected");

    await consumer.subscribe({
        topic: TOPIC_NAME,
    })
    console.log("🚀 Consumer subscribed in topic", TOPIC_NAME);

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("🔥 Mensagem recebida:");
            console.log({
                topic,
                partition,
                offset: message.offset,
                key: message.key?.toString(),
                value: message.value?.toString(),
            });
        },
    });

    console.log("🚀 Consumer is running...");
})();
