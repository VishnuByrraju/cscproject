function TabButton({ name, isActive }) {
  return (
    <>
    <button
      className={`w-full text-left p-3 rounded-md ${
        isActive ? 'text-white bg-gray-800 font-bold' : 'text-gray-200 font-normal'
      } hover:bg-gray-600`}
    >
      {name}
    </button>
    </>
  );
}

export default TabButton;
