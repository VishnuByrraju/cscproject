/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
const BigButton = ({id, placeholder, onClickBehavior }) => {
    return (
        <button
            id={id}
            onClick={onClickBehavior}
            className="w-full py-4 bg-green-600 rounded-lg bg-primary text-white hover:bg-red-600" >
            <div className="flex flex-row items-center justify-center">
                <div className="mr-2"> </div>
                <div className="font-bold text-xl">{placeholder} </div>
            </div>
      </button>
    );
  }
  
  export default BigButton;
  