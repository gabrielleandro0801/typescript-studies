import { Producer } from "@platformatic/kafka";



export class KafkaProducer {
    private producer;

    constructor(clientId: string, brokers: string[]) {
    }

    async send(clientId: string, brokers: string[], messages: { topic: string, value: any, headers?: any, key?: any }[]) {

        this.producer = new Producer({
            clientId,
            bootstrapBrokers: brokers,

        })
        const response = await this.producer.send({
            messages,
        })

        console.log("Current offset:", response.offsets)

    }
}
