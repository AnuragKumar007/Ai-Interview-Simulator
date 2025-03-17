import Button from "./button.jsx"
import { useNavigate } from "react-router-dom";

const hero = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] w-full bg-gradient-to-br from-[#2C3E50]/50 via-[#16A085]/50 to-[#2C3E50]/50 px-6">
            <h1 className="text-5xl font-bold text-center text-[#2D3748]">AI-Powered Interview Simulator</h1>
            <p className="text-xl text-center mt-4 max-w-2xl text-[#4A5568]">
                Practice your technical and behavioral interviews with AI-driven insights.
                Get real-time feedback and ace your next job interview!
            </p>
            <div className="mt-8">
                <Button children={"Start Practicing for Free"} 
                onClick={()=>{navigate('/signup')}} // Change krna hai
                className={"px-10 py-3 bg-gradient-to-r from-[#16A085] to-[#2C3E50] text-white text-lg font-bold rounded-lg hover:from-[#2C3E50] hover:to-[#16A085] transition-all duration-300 shadow-lg transform hover:scale-105 "}/>
            </div>
        </div>
    )
}

export default hero;
