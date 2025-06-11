import React from 'react';
import styles from '../styles/homepage.module.css'; // Import CSS Module
import Footer from '../components/Footer';

const Homepage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.page1}>
        <div className={styles.imgSlider}>
          <div className={styles.mySlide}>
            {[
              '../images/cover1-transformed.jpeg',
              '../images/cover2-transformed.jpeg',
              '../images/cover4-transformed.jpeg',
              '../images/14.jpg',
              '../images/cover6-transformed.jpeg',
              '../images/15.jpg',
              '../images/cover 10.jpg',
              '../images/cover11.jpg',
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`img${index + 1}`}
                className={index === 0 ? styles.active : ''}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.page2}>
        <div className={styles.container}>
          <h1>About Us</h1>
          <p>
            Welcome to <b>Faculty Feedback System</b>, a dedicated platform for
            enhancing the educational experience through constructive and
            confidential faculty feedback.{' '}
            <span>
              Our mission is to create a transparent and collaborative
              environment
            </span>
            where students can share their experiences and this way we can
            improve the teaching methods.
          </p>
          <div className={styles.row}>
            {[
              {
                icon: 'fa-solid fa-crosshairs',
                title: 'Our Vision',
                text: 'We aim to bridge a gap between students and faculty by fostering open communication.Our platform empowers students to voice their opinions and allows faculty to gain valuable insights that drive continuous improvement in the classroom.',
              },
              {
                icon: 'fa-solid fa-award',
                title: 'Why We Exist',
                text: 'We believe that the quality of education is direct result of strong relationships between students and their instructors.With honest,anonymous feedback, faculty members can refine their teaching techniques, address areas for improvement and celebrate their strengths,ultimately enriching the learning experience',
              },
              {
                icon: 'fa-solid fa-handshake',
                title: 'Our Commitment',
                text: 'Here we are commited to maintaining a fair,respectful,and safe platform for all users. We believe in the power of feedback to drive positive change in education,and are dedicated to ensuring thta every student and faculty member benefits from our service.',
              },
            ].map((service, idx) => (
              <div key={idx} className={styles.service}>
                <i className={service.icon}></i>
                <h2>{service.title}</h2>
                <p>{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.page3}>
        <h1>Steps for accessing the website</h1>
        <div className={styles.timeline}>
          {[
            {
              side: 'left',
              img: '../images/1.png',
              title: 'Sign Up\n(For New Users):',
              text: (
                <>
                  If you are a new user, go to the Sign-Up page. <br />
                  Enter your details (name, email, password, etc.). <br />
                  Select your user type (Admin, Faculty, or Student). <br />
                  Complete the registration process.
                </>
              ),
            },
            {
              side: 'right',
              img: '../images/2.png',
              title: 'Log In\n(For Returning Users):',
              text: (
                <>
                  If you already have an account, go to the Login page. <br />
                  Enter your email and password. <br />
                  Select your user type (Admin, Faculty, or Student). <br />
                  Click the Login button.
                </>
              ),
            },
            {
              side: 'left',
              img: '../images/3.png',
              title: 'Next Steps Based on User Type:',
              text: (
                <>
                  If you're an <b>Admin:</b> <br />
                  Login <br />→ View all faculty members <br />→ See feedback
                  (rating & comments).
                </>
              ),
            },
            {
              side: 'right',
              img: '../images/4.png',
              title: 'Next Steps Based on User Type:',
              text: (
                <>
                  If you're a <b>Faculty Member:</b> <br />
                  Login <br />→ View personal dashboard <br />→ See own feedback
                  from students.
                </>
              ),
            },
            {
              side: 'left',
              img: '../images/5.png',
              title: 'Next Steps Based on User Type:',
              text: (
                <>
                  If you're a <b>Student:</b> <br />
                  Login <br />→ Select faculty <br />→ Answer questions and rate{' '}
                  <br />→ Submit feedback.
                </>
              ),
            },
            {
              side: 'right',
              img: '../images/6.png',
              title: 'Thank You For Visiting Our Website',
              text: '',
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`${styles.container2} ${
                styles[`${step.side}Container`]
              }`}
            >
              <img src={step.img} alt={`logo${idx + 1}`} />
              <div className={styles.textBox}>
                <center>
                  <h2>{step.title}</h2>
                </center>
                <p>{step.text}</p>
                <span className={styles[`${step.side}ContainerArrow`]}></span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
