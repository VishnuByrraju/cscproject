// eslint-disable-next-line react/prop-types
const ProgressBar = ({ percentage , name}) => {
    return (

      <div>
          <p className="flex justify-between"> <span className='text-sm'>{name}</span> <span>{percentage}/100</span> </p>
                                               {/* <ProgressBar percentage={accuracyScore} /> */}
                
          <div className="w-full h-4 bg-gray-200 rounded-full ">
            <div
              className="bg-green-700 h-4 text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${percentage}%` }}
            >
            </div>
          </div>
      </div>


    );
  };
  
  export default ProgressBar;