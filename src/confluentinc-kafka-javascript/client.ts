import { KafkaJS } from "@confluentinc/kafka-javascript";
import { logLevel } from "@confluentinc/kafka-javascript/lib/kafkajs";
import { Consumer, Kafka, Producer } from "@confluentinc/kafka-javascript/types/kafkajs";

const { Kafka: KafkaClient } = KafkaJS;

export const TOPIC_NAME = "my-topic";

export function createClient(): Kafka {
    return new KafkaClient({
        "bootstrap.servers": "172.17.0.1:9092",
        log_level: logLevel.ERROR,
    });
}

export function createProducer(): Producer {
    const client: Kafka = createClient();

    return client.producer();
}

export function createConsumer(groupId: string, clientId: string): Consumer {
    const client: Kafka = createClient();

    return client.consumer({
        "group.id": groupId,
        "client.id": clientId,
        "auto.commit.enable": true,
        "auto.offset.reset": "earliest",
    });
}

export async function createTopic(): Promise<void> {
    const client: Kafka = createClient();
    const admin = client.admin();

    await admin.connect();
    const existingTopics: string[] = await admin.listTopics();

    if (!existingTopics.includes(TOPIC_NAME)) {
        console.log("🚀 Creating topic", TOPIC_NAME);
        await admin.createTopics({ topics: [{ topic: TOPIC_NAME, numPartitions: 3 }] })
    }
}
