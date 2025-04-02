// InputBox.js
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
const InputBox = ({ boxsize = 'w-full', label, type, id, placeholder, isEmpty }) => {
  return (
    <div id="input" className={`flex flex-col ${boxsize} my-1`}>
      <label htmlFor={id} className="text-gray-600 mb-1.5 text-start">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`appearance-none border-2 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:shadow-s ${
          isEmpty ? 'border-red-500' : 'border-gray-100'
        }`}
      />
    </div>
  );
}

export default InputBox;
