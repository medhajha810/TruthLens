import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Shield, 
  Users, 
  Target, 
  Award, 
  Mail, 
  Github, 
  Linkedin,
  Globe
} from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Georgian-86',
      role: 'Lead Developer',
      email: 'optimus4586prime@gmail.com',
      github: 'https://github.com/Georgian-86',
      linkedin: 'https://www.linkedin.com/in/golukumar15/',
      avatar: 'https://via.placeholder.com/150'
    }
  ];

  const features = [
    {
      icon: Globe,
      title: 'Multi-Source Aggregation',
      description: 'Collects news from multiple trusted sources to ensure balanced coverage.'
    },
    {
      icon: Shield,
      title: 'Bias Detection',
      description: 'Advanced algorithms identify potential biases in news reporting.'
    },
    {
      icon: Target,
      title: 'Fact-Checking',
      description: 'Integrates with reputable fact-checking organizations.'
    },
    {
      icon: Users,
      title: 'Community Feedback',
      description: 'User voting and feedback system for article credibility.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About - TruthLens</title>
        <meta name="description" content="Learn about TruthLens, our mission to promote media literacy, and our team." />
      </Helmet>

      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-6">
              <Eye className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-300 mb-4">About TruthLens</h1>
            <p className="text-xl text-gray-600 dark:text-slate-300">
              Empowering users with transparent, multi-perspective news analysis
            </p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="card p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to promote media literacy, combat misinformation, and empower users 
                to critically evaluate news coverage from multiple perspectives.
              </p>
              <p className="text-gray-600 mb-6">
                In today's digital age, where information spreads rapidly and misinformation can 
                have real-world consequences, we believe that access to reliable, unbiased news 
                analysis is more important than ever.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">Trusted by 8,500+ users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-success-600" />
                  <span className="text-sm font-medium text-gray-700">15,000+ articles analyzed</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Principles</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Transparency in news analysis</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Multi-perspective coverage</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Fact-based verification</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">User empowerment through education</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for news analysis and media literacy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">
              Meet the people behind TruthLens
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                
                <div className="flex justify-center space-x-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="card p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:optimus4586prime@gmail.com"
                className="btn-primary inline-flex items-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
              <a
                href="https://github.com/Georgian-86"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-primary inline-flex items-center"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default About; 