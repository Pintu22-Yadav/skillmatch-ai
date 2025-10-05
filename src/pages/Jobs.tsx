import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Job as JobType } from '../lib/supabase';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  type: string;
  matchedSkills: string[];
  description: string;
}

interface UserSkillWithDetails {
  skills: {
    name: string;
  };
}

const Jobs: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserSkillsAndJobs();
    }
  }, [user]);

  const fetchUserSkillsAndJobs = async () => {
    if (!user) return;

    try {
      const { data: userSkillsData, error: skillsError } = await supabase
        .from('user_skills')
        .select('skills(name)')
        .eq('user_id', user.id);

      if (skillsError) throw skillsError;

      const userSkills = (userSkillsData as UserSkillWithDetails[])
        .map(item => item.skills.name)
        .filter(Boolean);
      setSkills(userSkills);

      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true);

      if (jobsError) throw jobsError;

      const matchedJobs = (jobsData as JobType[])
        .map(job => {
          const matchedSkills = job.required_skills.filter(skill =>
            userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
          );

          return {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary_range,
            type: job.job_type,
            matchedSkills,
            description: job.description
          };
        })
        .filter(job => job.matchedSkills.length > 0)
        .sort((a, b) => b.matchedSkills.length - a.matchedSkills.length);

      setJobs(matchedJobs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchPercentage = (matchedSkills: string[], totalSkills: number) => {
    return Math.round((matchedSkills.length / totalSkills) * 100);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding matching jobs...</p>
        </div>
      </div>
    );
  }

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