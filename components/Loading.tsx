const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full shadow-lg animate-spin"></div>
        <p className="mt-4 text-gray-700 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
