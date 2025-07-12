import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    github: '',
    linkedin: '',
    website: '',
    location: '',
    skills: [],
    projects: []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github: '',
    live: ''
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        website: user.website || '',
        location: user.location || '',
        skills: user.skills || [],
        projects: user.projects || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
    }));
  };

  const addProject = () => {
    const { title, description, technologies } = newProject;
    if (title.trim() && description.trim()) {
      const techArray = technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);

      const projectToAdd = { ...newProject, id: Date.now(), technologies: techArray };

      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, projectToAdd]
      }));

      setNewProject({ title: '', description: '', technologies: '', github: '', live: '' });
      setShowProjectForm(false);
    }
  };

  const removeProject = (projectId) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage('Profile updated successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <section className="form-section">
          <h3>Basic Info</h3>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Your bio" />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        </section>

        <section className="form-section">
          <h3>Social Links</h3>
          <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" />
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
          <input name="website" value={formData.website} onChange={handleChange} placeholder="Website URL" />
        </section>

        <section className="form-section">
          <h3>Skills</h3>
          <div className="skills-input">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill" />
            <button type="button" onClick={addSkill}>Add</button>
          </div>
          <div className="skills-list">
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h3>Projects</h3>
          <button type="button" onClick={() => setShowProjectForm(!showProjectForm)}>
            {showProjectForm ? 'Cancel' : 'Add Project'}
          </button>

          {showProjectForm && (
            <div className="project-form">
              <input name="title" value={newProject.title} onChange={handleProjectChange} placeholder="Project Title" />
              <textarea name="description" value={newProject.description} onChange={handleProjectChange} placeholder="Description" />
              <input name="technologies" value={newProject.technologies} onChange={handleProjectChange} placeholder="Technologies (comma separated)" />
              <input name="github" value={newProject.github} onChange={handleProjectChange} placeholder="GitHub Link" />
              <input name="live" value={newProject.live} onChange={handleProjectChange} placeholder="Live Demo Link" />
              <button type="button" onClick={addProject}>Add Project</button>
            </div>
          )}

          <div className="projects-list">
            {formData.projects.map((proj, idx) => (
              <div key={proj.id || idx} className="project-item">
                <h4>{proj.title}</h4>
                <p>{proj.description}</p>
                <div className="tech-tags">
                  {proj.technologies.map((tech, i) => <span key={i}>{tech}</span>)}
                </div>
                <div className="project-links">
                  {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  {proj.live && <a href={proj.live} target="_blank" rel="noopener noreferrer">Live</a>}
                </div>
                <button type="button" onClick={() => removeProject(proj.id || idx)}>Remove</button>
              </div>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
          <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
