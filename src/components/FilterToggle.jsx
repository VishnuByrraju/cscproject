
// eslint-disable-next-line react/prop-types
function FilterToggle({name="Filter Name", noOfError=1, id, onClick, errCountClassName}) {

    

    return (
            <div className='flex items-center mt-2 justify-between'>
                <div className='mr-3'>
                    <span className={`${errCountClassName} no-of-error bg-gray-200 px-3 py-1 text`}>{noOfError}</span>
                    <span className="ms-2  font-medium text-gray-900 ">{name}</span>
                </div>

                <label className="block inline-flex items-center cursor-pointer">
                <input type="checkbox" onClick={onClick} id={id} value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-red-500"></div>
                </label>
            </div>
    )
}

export default FilterToggle