"use client";

export default function ControlError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("💥 Control Panel Error:", error);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <h1 className="text-2xl font-bold text-red-400">Algo deu errado 😬</h1>
      <p className="text-white/70">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white"
      >
        Tentar novamente
      </button>
    </div>
  );
}

