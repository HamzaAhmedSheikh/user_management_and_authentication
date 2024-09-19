import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function Page() {
  const messages = [
    {
      recipient: "John Doe",
      message: "Payment of $250 for freelance project has been received.",
      timestamp: "2024-09-04 14:35:22",
    },
    {
      recipient: "Jane Smith",
      message:
        "Payment of $120 for design services has been successfully sent.",
      timestamp: "2024-09-04 13:21:17",
    },
    {
      recipient: "Acme Corp",
      message: "Invoice payment of $1,500 for August has been processed.",
      timestamp: "2024-09-04 10:05:43",
    },
    {
      recipient: "Michael Johnson",
      message: "Refund of $75 has been issued to your account.",
      timestamp: "2024-09-04 09:42:10",
    },
    {
      recipient: "Olivia Brown",
      message: "Payment of $200 for consulting services has been sent.",
      timestamp: "2024-09-04 08:29:56",
    },
    {
      recipient: "Liam Garcia",
      message: "Payment of $320 for software development services received.",
      timestamp: "2024-09-03 17:15:33",
    },
    {
      recipient: "Noah Davis",
      message:
        "Your payment of $50 for the subscription renewal has been processed.",
      timestamp: "2024-09-03 15:47:21",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-2xl font-semibold">Payments</h1>
      <div className="grid gap-4">
        {messages.map((msg, index) => (
          <div key={index} className="rounded bg-white p-4 shadow-md">
            <p className="text-gray-600">
              Recipient: <span className="font-semibold">{msg.recipient}</span>
            </p>
            <p className="mt-2 text-gray-800">Message: {msg.message}</p>
            <p className="mt-2 text-gray-500">Timestamp: {msg.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
