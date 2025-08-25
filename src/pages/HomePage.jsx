
import HoverableGrid from "@/components/pages/HoverableGrid.jsx";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import Logo from "@/assets/PixelLogo.png"

function HomePage() {

  
  return (
      <div className="realtive text-white h-full w-full flex flex-col items-center justify-center">
          <HoverableGrid/>
          <div className="flex flex-col gap-4 items-center  justify-center fixed top-1/2 -translate-y-1/2">
         <div className="flex justify-start items-center gap-4">
            <img src={Logo} alt="Pixelkriti Logo"  width={100} height={100}/>
            <div className="text-white text-5xl select-none  font-pixel"> 
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">P</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">I</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">X</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">E</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">L</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out ml-3 font-pixel"> K</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">R</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">I</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">T</span>
                  <span className=" hover:text-gmain transition-colors duration-500 ease-in-out font-pixel">I</span>
            </div>
         </div>
          <div className="text-white text-lg select-none hover:text-gmain transition-colors duration-500 ease-in-out">Design with purpose, build for growth.</div>
                <div className="flex gap-4 justify-center w-full mt-4">
                      <a href="http://instagram.com/pixel.kriti" rel="noopener noreferrer"  target="_blank"><FaInstagram className="size-10 select-none hover:text-gmain transition-colors duration-500 ease-in-out cursor-pointer"/></a>
                      <a href="http://linkedin.com/company/pixelkriti" rel="noopener noreferrer" target="_blank"><FaLinkedin className="size-10 select-none hover:text-gmain transition-colors duration-500 ease-in-out cursor-pointer"/></a>
                      <a href="http://youtube.com/@pixelkriti" rel="noopener noreferrer" target="_blank"><FaYoutube className="size-10 select-none hover:text-gmain transition-colors duration-500 ease-in-out cursor-pointer"/></a>
                      <a href="https://www.facebook.com/pixelkriti" rel="noopener noreferrer" target="_blank"><FaFacebook className="size-10 select-none hover:text-gmain transition-colors duration-500 ease-in-out cursor-pointer"/></a>
                </div>
          </div>
        </div>
  )
}

export default HomePage