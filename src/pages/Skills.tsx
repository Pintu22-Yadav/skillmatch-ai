import React, { useState, useEffect } from 'react';
import { Plus, X, Code, Database, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserSkillWithDetails {
  id: string;
  skill_id: string;
  skills: {
    id: string;
    name: string;
    category: string;
  };
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserSkills();
    }
  }, [user]);

  const fetchUserSkills = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('id, skill_id, skills(id, name, category)')
        .eq('user_id', user.id);

      if (error) throw error;

      const skillNames = (data as UserSkillWithDetails[])
        .map(item => item.skills.name)
        .filter(Boolean);
      setSkills(skillNames);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim()) || !user) return;

    try {
      let skillId: string;
      const { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .ilike('name', newSkill.trim())
        .maybeSingle();

      if (existingSkill) {
        skillId = existingSkill.id;
      } else {
        const { data: newSkillData, error: skillError } = await supabase
          .from('skills')
          .insert({ name: newSkill.trim(), category: 'Custom' })
          .select('id')
          .single();

        if (skillError) throw skillError;
        skillId = newSkillData.id;
      }

      const { error: userSkillError } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: skillId });

      if (userSkillError) throw userSkillError;

      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const removeSkill = async (skillToRemove: string) => {
    if (!user) return;

    try {
      const { data: skillData } = await supabase
        .from('skills')
        .select('id')
        .ilike('name', skillToRemove)
        .maybeSingle();

      if (skillData) {
        const { error } = await supabase
          .from('user_skills')
          .delete()
          .eq('user_id', user.id)
          .eq('skill_id', skillData.id);

        if (error) throw error;
      }

      setSkills(skills.filter(skill => skill !== skillToRemove));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  const getSkillIcon = (skill: string) => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('react') || lowerSkill.includes('vue') || lowerSkill.includes('angular')) {
      return <Globe size={20} />;
    }
    if (lowerSkill.includes('sql') || lowerSkill.includes('database') || lowerSkill.includes('mongo')) {
      return <Database size={20} />;
    }
    return <Code size={20} />;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Skills</h1>
        <p className="text-gray-600 mb-8">
          Manage your technical skills to get better job recommendations
        </p>

        {/* Add Skill Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a new skill (e.g., Python, JavaScript, Docker)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
            <button
              onClick={addSkill}
              className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-200 hover:transform hover:scale-105"
            >
              <Plus size={20} />
              Add Skill
            </button>
          </div>
        </div>

        {/* Skills Display */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Skills ({skills.length})
          </h2>
          
          {skills.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Code size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No skills added yet</p>
              <p>Add your first skill to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="skill-card flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {getSkillIcon(skill)}
                    </div>
                    <span className="font-medium text-gray-900">{skill}</span>
                  </div>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Remove skill"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Summary */}
        {skills.length > 0 && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Skills Summary</h3>
            <p className="text-green-700">
              You have <strong>{skills.length}</strong> skill{skills.length !== 1 ? 's' : ''} in your profile. 
              These skills will be used to match you with relevant job opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;