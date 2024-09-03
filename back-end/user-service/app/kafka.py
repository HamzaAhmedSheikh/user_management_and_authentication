#kafka.py
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer


async def get_kafka_producer():
    producer = AIOKafkaProducer(bootstrap_servers='broker:19092')
    await producer.start()
    try:
        yield producer
    finally:
        await producer.stop()


async def consume_messages(topic, bootstrap_servers):
    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers,
        group_id="my-group",
        auto_offset_reset='earliest'
    )

    await consumer.start()
    try:
        async for message in consumer:
            print(f"Received message: {
                  message.value.decode()} on topic {message.topic}"
                  )
    finally:
        await consumer.stop()
