import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchedSkills: string[];
  description: string;
}

const Jobs: React.FC = () => {
  const [skills] = useState<string[]>(['Java', 'SQL', 'React']); // In a real app, this would come from a global state
  const [jobs, setJobs] = useState<Job[]>([]);

  const generateMockJobs = (userSkills: string[]): Job[] => {
    const jobTemplates = [
      {
        title: 'Frontend Developer',
        company: 'TechCorp',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        salary: '$70,000 - $90,000',
        type: 'Full-time'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        skills: ['React', 'Node.js', 'SQL', 'JavaScript'],
        salary: '$80,000 - $110,000',
        type: 'Full-time'
      },
      {
        title: 'Java Developer',
        company: 'Enterprise Solutions',
        skills: ['Java', 'SQL', 'Spring', 'Maven'],
        salary: '$85,000 - $120,000',
        type: 'Full-time'
      },
      {
        title: 'Database Administrator',
        company: 'DataFlow Inc',
        skills: ['SQL', 'PostgreSQL', 'MySQL', 'Python'],
        salary: '$75,000 - $100,000',
        type: 'Full-time'
      },
      {
        title: 'React Developer',
        company: 'Modern Web Co',
        skills: ['React', 'TypeScript', 'Redux', 'GraphQL'],
        salary: '$65,000 - $85,000',
        type: 'Contract'
      },
      {
        title: 'Software Engineer',
        company: 'Tech Innovators',
        skills: ['Java', 'Python', 'SQL', 'Docker'],
        salary: '$90,000 - $130,000',
        type: 'Full-time'
      }
    ];

    const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Remote', 'Boston, MA'];
    
    return jobTemplates
      .map((template, index) => {
        const matchedSkills = template.skills.filter(skill => 
          userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        );
        
        return {
          id: index + 1,
          title: template.title,
          company: template.company,
          location: locations[index % locations.length],
          salary: template.salary,
          type: template.type,
          matchedSkills,
          description: `Join ${template.company} as a ${template.title}. We're looking for someone with experience in ${template.skills.slice(0, 3).join(', ')}. This is a great opportunity to work with cutting-edge technologies and grow your career.`
        };
      })
      .filter(job => job.matchedSkills.length > 0)
      .sort((a, b) => b.matchedSkills.length - a.matchedSkills.length);
  };

  useEffect(() => {
    setJobs(generateMockJobs(skills));
  }, [skills]);

  const getMatchPercentage = (matchedSkills: string[], totalSkills: number) => {
    return Math.round((matchedSkills.length / totalSkills) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
        <p className="text-gray-600">
          Based on your skills: <span className="font-medium text-blue-600">{skills.join(', ')}</span>
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="card p-12 text-center">
          <Briefcase size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Job Matches Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any jobs matching your current skills. 
            Try adding more skills to improve your job recommendations.
          </p>
          <a
            href="/skills"
            className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2 font-semibold"
          >
            <ExternalLink size={20} />
            Update Your Skills
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="card p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-green-600 font-semibold mb-2">
                    <DollarSign size={18} />
                    <span>{job.salary}</span>
                  </div>
                  <div className="text-sm font-medium text-blue-600">
                    {getMatchPercentage(job.matchedSkills, 4)}% Match
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{job.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Matching Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.matchedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="btn-primary px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:transform hover:scale-105 transition-all duration-200">
                  <ExternalLink size={16} />
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {jobs.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Found {jobs.length} Job{jobs.length !== 1 ? 's' : ''}
          </h3>
          <p className="text-blue-700">
            These positions match your current skills. Consider updating your skills profile to discover more opportunities!
          </p>
        </div>
      )}
    </div>
  );
};

export default Jobs;