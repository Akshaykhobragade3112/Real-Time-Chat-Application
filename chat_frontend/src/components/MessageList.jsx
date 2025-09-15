
export default function MessageList({ messages, userId }) {
  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto p-2">
      {messages.map((m, i) => {
        const isSystem = m.username === "System";
        const isMine = m.user_id === userId;

        if (isSystem) {
          return (
            <div
              key={i}
              className="text-center text-gray-500 text-sm italic my-2"
            >
              {m.message}
            </div>
          );
        }

        return (
          <div
            key={i}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                isMine
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {!isMine && (
                <div className="text-xs text-gray-600 font-semibold">
                  {m.username}
                </div>
              )}
              <div>{m.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
