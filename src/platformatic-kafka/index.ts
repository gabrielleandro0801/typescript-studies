import { Producer } from "@platformatic/kafka";
import { KafkaProducer } from "./producer";

async function main(): Promise<void> {
    const clientId = "kafka-client";
    const brokers = ["localhost:9092"]
    const topic = "platformatic";

    new Producer({
        clientId,
        bootstrapBrokers: brokers,
    })

    const producer = new KafkaProducer(clientId, brokers);

    await producer.send(clientId, brokers, [{
        topic,
        value: JSON.stringify({ hello: "world" }),
        headers: { hi: "world" },
        key: "my-key"
    }])

}

(async () => {
    await main()
})()