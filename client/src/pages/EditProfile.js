import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/EditProfile.css';
import axios from 'axios';

const EditProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
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
    projects: [],
    avatar: ''
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
  const [message, setMessage] = useState({ text: '', type: '' });

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
        projects: user.projects || [],
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addProject = () => {
    const { title, description, technologies } = newProject;
    if (title.trim() && description.trim()) {
      const techArray = technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(Boolean);

      const projectToAdd = {
        ...newProject,
        id: Date.now(),
        technologies: techArray
      };

      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, projectToAdd]
      }));

      setNewProject({
        title: '',
        description: '',
        technologies: '',
        github: '',
        live: ''
      });
      setShowProjectForm(false);
    }
  };

  const removeProject = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== projectId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.userId) {
      setMessage({ text: 'User not authenticated', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/update/${user.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      updateUser(response.data);
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success'
      });

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to update profile';
      setMessage({
        text: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProjects = useCallback(() => (
    formData.projects.map(proj => (
      <div key={proj.id} className="project-item">
        <h4>{proj.title}</h4>
        <p>{proj.description}</p>
        <div className="tech-tags">
          {proj.technologies.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
        <div className="project-links">
          {proj.github && (
            <a href={proj.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          )}
          {proj.live && (
            <a href={proj.live} target="_blank" rel="noopener noreferrer">Live</a>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeProject(proj.id)}
          aria-label={`Remove ${proj.title}`}
        >
          Remove
        </button>
      </div>
    ))
  ), [formData.projects]);

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="back-btn"
          disabled={loading}
        >
          Back to Dashboard
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-profile-form">

        <section className="form-section">
          <h3>Basic Info</h3>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            required
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Your bio"
            rows="4"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <h4>Avatar</h4>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Paste avatar image URL"
          />
          {formData.avatar && (
            <img
              src={formData.avatar}
              alt="Avatar Preview"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                marginTop: '10px',
                objectFit: 'cover',
                border: '2px solid #ccc'
              }}
            />
          )}
        </section>

        <section className="form-section">
          <h3>Social Links</h3>
          <input
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            type="url"
          />
          <input
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            type="url"
          />
          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website URL"
            type="url"
          />
        </section>

        <section className="form-section">
          <h3>Skills</h3>
          <div className="skills-input">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!newSkill.trim()}
            >
              Add
            </button>
          </div>
          <div className="skills-list">
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h3>Projects</h3>
          <button
            type="button"
            onClick={() => setShowProjectForm(!showProjectForm)}
            disabled={loading}
          >
            {showProjectForm ? 'Cancel' : 'Add Project'}
          </button>

          {showProjectForm && (
            <div className="project-form">
              <input
                name="title"
                value={newProject.title}
                onChange={handleProjectChange}
                placeholder="Project Title"
                required
              />
              <textarea
                name="description"
                value={newProject.description}
                onChange={handleProjectChange}
                placeholder="Description"
                rows="4"
                required
              />
              <input
                name="technologies"
                value={newProject.technologies}
                onChange={handleProjectChange}
                placeholder="Technologies (comma separated)"
              />
              <input
                name="github"
                value={newProject.github}
                onChange={handleProjectChange}
                placeholder="GitHub Link"
                type="url"
              />
              <input
                name="live"
                value={newProject.live}
                onChange={handleProjectChange}
                placeholder="Live Demo Link"
                type="url"
              />
              <button
                type="button"
                onClick={addProject}
                disabled={!newProject.title.trim() || !newProject.description.trim()}
              >
                Add Project
              </button>
            </div>
          )}

          <div className="projects-list">
            {renderProjects()}
          </div>
        </section>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="save-btn"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
