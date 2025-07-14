import React from 'react';
import '../styles/developerCard.css';

const DeveloperCard = ({ developer, onViewProfile }) => {
  return (
    <div className="developer-card">
      <div className="dev-image">
        <img 
          src={developer.avatar || '/default-avatar.png'} 
          alt={developer.name}
        />
      </div>
      
      <h3>{developer.name}</h3>
      <p className="dev-bio">{developer.bio?.substring(0, 80) || 'No bio available.'}</p>
      
      <div className="dev-skills">
        {developer.skills?.slice(0,5).map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>

      <button onClick={() => onViewProfile(developer._id)}>
        View Profile
      </button>
    </div>
  );
};

export default DeveloperCard;
