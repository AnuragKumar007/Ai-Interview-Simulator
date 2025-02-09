import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../button";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import Footer from "../footer";

const About = () => {
    const navigate = useNavigate();

    const teamMembers = [
        {
            name: "Anurag Papa",
            role: "Founder & CEO",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            linkedin: "#",
            github: "#"
        },
        {
            name: "Abhinav Singh",
            role: "Lead Developer",
            image: "https://randomuser.me/api/portraits/men/13.jpg",
            linkedin: "#",
            github: "#"
        },
        {
            name: "Dhananjay Yadav",
            role: "Water Boy",
            image: "https://randomuser.me/api/portraits/men/12.jpg",
            linkedin: "#",
            github: "#"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2C3E50]/5 to-[#16A085]/5">
            <Navbar />
            
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-5xl font-bold text-center text-[#2C3E50] mb-6">About Us</h1>
                <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
                    We're on a mission to revolutionize interview preparation using artificial intelligence.
                    Our platform helps candidates practice and improve their interview skills with real-time feedback.
                </p>
            </div>

            {/* Mission Section */}
            <div className="mx-auto bg-white/10 shadow-black/35 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">Our Mission</h2>
                        <p className="text-gray-600 mb-6">
                            We believe everyone deserves a fair chance at their dream job. Our AI-powered
                            interview simulator provides personalized feedback and helps candidates build
                            confidence through practice.
                        </p>
                        <p className="text-gray-600">
                            By leveraging cutting-edge AI technology, we're making professional interview
                            preparation accessible to everyone, regardless of their background or experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">Meet Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center transform transition-transform hover:scale-105">
                            <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                            />
                            <h3 className="text-xl font-bold text-[#2C3E50] mb-2">{member.name}</h3>
                            <p className="text-gray-600 mb-4">{member.role}</p>
                            <div className="flex justify-center space-x-4">
                                <a href={member.linkedin} className="text-[#2C3E50] hover:text-[#16A085]">
                                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                </a>
                                <a href={member.github} className="text-[#2C3E50] hover:text-[#16A085]">
                                    <FontAwesomeIcon icon={faGithub} size="lg" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default About;