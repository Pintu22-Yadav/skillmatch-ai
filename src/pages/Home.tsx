import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, Users, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Brain className="text-blue-600" size={32} />,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze your skills to find perfect job matches'
    },
    {
      icon: <Target className="text-green-600" size={32} />,
      title: 'Skill Tracking',
      description: 'Keep track of your technical skills and monitor your growth'
    },
    {
      icon: <Users className="text-purple-600" size={32} />,
      title: 'Career Insights',
      description: 'Get personalized career advice based on your skill profile'
    },
    {
      icon: <Zap className="text-orange-600" size={32} />,
      title: 'Instant Results',
      description: 'Receive job recommendations in real-time as you update your skills'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">SkillMatch AI</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover your perfect career match with our AI-powered platform. 
          Track your skills, explore opportunities, and accelerate your professional growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/skills"
            className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:transform hover:scale-105"
          >
            Manage Your Skills
          </Link>
          <Link
            to="/jobs"
            className="btn-secondary px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:transform hover:scale-105"
          >
            Find Jobs
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card p-6 text-center hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
        <p className="text-xl mb-6 opacity-90">
          Start by adding your skills and let our AI do the rest
        </p>
        <Link
          to="/skills"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

export default Home;