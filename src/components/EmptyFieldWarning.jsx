// EmptyFieldWarning.js
const EmptyFieldWarning = ({ children, isEmpty }) => {
  return (
      <div className={`w-full ${isEmpty ? 'border-red-500' : 'border-gray-300'} border rounded-md`}>
          {children}
      </div>
  );
};

export default EmptyFieldWarning;
