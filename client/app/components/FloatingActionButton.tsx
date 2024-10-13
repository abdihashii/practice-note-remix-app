const FloatingActionButton = () => {
  return (
    <button
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg"
      aria-label="Add Note"
    >
      <span className="text-3xl">+</span>
    </button>
  );
};

export default FloatingActionButton;
