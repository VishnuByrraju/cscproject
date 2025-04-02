import logo450 from "../assets/logo_450x450.png"
import coinicon from '../assets/coin.webp'; 


function HeroLoginSignUp() {
  return (
        <div className="flex lg:my-0 my-10  flex-col w-full">

            <div className="flex flex-items items-center">

              <img className=" lg:h-44 lg:w-44 w-24 h-24 m-2 " src={logo450} alt="" />

              <div className="text-start">
                  {/* Title Text */}
                  <p className="w-3/4 lg:text-6xl text-3xl mx-4 mb-2 md:mx-1 font-bold text-gray-800">
                    PARLIAMO
                  </p>
                  {/* Description Text */}
                  <p className="w-3/4 mx-4 md:mx-1 text-gray-500 mb-2">
                  IL TUO COACH PERSONALE DI PRONUNCIA INGLESE A PORTATA DI CLICK
                  </p>

              </div>

            </div>
        </div>
  )
}

export default HeroLoginSignUp