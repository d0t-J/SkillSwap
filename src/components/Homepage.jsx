import React from "react";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: "🎯",
            title: "Find Perfect Matches",
            description:
                "Connect with learners who offer what you want to learn and want to learn what you offer",
        },
        {
            icon: "💬",
            title: "Interactive Learning",
            description:
                "Chat with your learning partner and get help from our AI tutor",
        },
        {
            icon: "🌟",
            title: "Skill Exchange",
            description:
                "Teach what you know, learn what you want - it's a win-win for everyone",
        },
        {
            icon: "🤖",
            title: "AI Assistant",
            description:
                "Get personalized tips and guidance from our intelligent tutoring system",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            skill: "JavaScript ↔ Design",
            quote: "Found an amazing design mentor while teaching JavaScript. The AI tutor made learning so much easier!",
        },
        {
            name: "Mike Rodriguez",
            skill: "Spanish ↔ Guitar",
            quote: "Learned guitar from a native Spanish speaker while helping them with Spanish. Perfect exchange!",
        },
        {
            name: "Emma Johnson",
            skill: "Photography ↔ Marketing",
            quote: "The matching system is incredible. Found exactly what I was looking for in minutes!",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="flex justify-center items-center mb-6">
                            <div className="text-6xl mr-4">🤝</div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white">
                                SkillSwap
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Learn together, grow together. Connect with people
                            worldwide to exchange skills and knowledge.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate("/match")}
                                className="px-8 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg"
                            >
                                Start Learning Now →
                            </button>
                            <button
                                onClick={() =>
                                    document
                                        .getElementById("how-it-works")
                                        .scrollIntoView({ behavior: "smooth" })
                                }
                                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-700 transition-all duration-200 font-semibold text-lg"
                            >
                                How It Works
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
                <div
                    className="absolute bottom-20 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute top-40 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                ></div>
            </div>

            {/* How It Works */}
            <div id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            How SkillSwap Works
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Three simple steps to start your learning journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                Share Your Skills
                            </h3>
                            <p className="text-slate-600">
                                Tell us what you can teach and what you want to
                                learn
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                Find Partners
                            </h3>
                            <p className="text-slate-600">
                                Browse and connect with people who match your
                                learning goals
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                Start Learning
                            </h3>
                            <p className="text-slate-600">
                                Chat with your partner and get guidance from our
                                AI tutor
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Why Choose SkillSwap?
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Powerful features designed to make learning
                            collaborative and fun
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200 group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Success Stories
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            See how SkillSwap has helped people learn and grow
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200"
                            >
                                <div className="text-2xl mb-4">💬</div>
                                <p className="text-slate-700 mb-4 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="font-semibold text-slate-800">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {testimonial.skill}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Start Your Learning Journey?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of learners exchanging skills worldwide
                    </p>
                    <button
                        onClick={() => navigate("/match")}
                        className="px-10 py-4 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 font-bold text-lg shadow-xl"
                    >
                        Get Started Free →
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <div className="text-2xl mr-3">🤝</div>
                            <div>
                                <h3 className="text-xl font-bold">SkillSwap</h3>
                                <p className="text-slate-400 text-sm">
                                    Learn together, grow together
                                </p>
                            </div>
                        </div>
                        <div className="text-slate-400 text-sm">
                            © 2025 SkillSwap. Made with ❤️ for learners
                            worldwide.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
