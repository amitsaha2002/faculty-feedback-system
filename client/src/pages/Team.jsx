import React from 'react';
import styles from '../styles/team.module.css'; // Importing CSS module

const teamMembers = [
  {
    name: 'Dipanwita Saha',
    role: 'TEAM LEAD',
    img: '../images/dipanwita.jpg',
  },
  {
    name: 'Sova Singha Roy',
    role: 'FRONTEND DEVELOPER',
    img: '../images/sova.png',
  },
  {
    name: 'Amit Saha',
    role: 'FULL STACK DEVELOPER',
    img: '../images/amit.png',
  },
  {
    name: 'Sampriti Das',
    role: 'FRONTEND DEVELOPER',
    img: '../images/sampriti.png',
  },
  {
    name: 'Prama Patra',
    role: 'FRONTEND DEVELOPER',
    img: '../images/prama.png',
  },
  {
    name: 'Anjali Dey',
    role: 'FRONTEND DEVELOPER',
    img: '../images/anjali.png',
  },
];

const TeamPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>Meet Our Team</h2>
        <p>
          <b>Visionary Creators</b>
        </p>
      </div>

      <div className={styles.teamGrid}>
        {teamMembers.map((member, idx) => (
          <div className={styles.teamCard} key={idx}>
            <div className={styles.teamImg}>
              <img src={member.img} alt={member.name.replace(' ', '')} />
              <div className={styles.overlay}>
                <div className={styles.socials}>
                  <a href="#">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                  <a href="#">
                    <i className="fa fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
            <h6 className={styles.teamTitle}>{member.name}</h6>
            <span className={styles.teamRole}>{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
