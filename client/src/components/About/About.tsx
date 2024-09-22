// import Branding from '../Branding/Branding';

const About = () => {
  return (
    <div>
      {/* <Branding /> */}
      {/* TODO: add team links */}
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        onClick={() => {
          window.history.back();
        }}
      >
        Home
      </button>
      <h1 className="text-center mt-4 mb-4">About Coursework Calendar</h1>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2>Coursework Calendar</h2>
            <p>
              Coursework Calendar is the (on-going) end-product of two Learning
              and Teaching Enhancement Project, funded by the Faculty of Science
              and Engineering at the University of Liverpool:
            </p>
            <ul>
              <li>
                In 2022-23: Project SWEAT: Student Workload Impact Evaluation
                Tool
              </li>
              <li>
                In 2023-24: Project ECHO: Effort and Coursework Handling Online
              </li>
            </ul>
            <p>
              The stated goal of this initiative was the development of an
              online portal, for students and staff, for the modelling and
              evaluation of student effort and workload across the academic
              year, developed and deployed in partnership with students, with
              the objective of reducing pain points and improving the student
              learning experience by spreading the effort as uniformly as
              possible throughout the academic year.
            </p>
            <h2>Meet the team</h2>
            <ul>
              <li>
                <a href="http://https%3A%2F%2Fwww.liverpool.ac.uk%2Felectrical-engineering-and-electronics%2Fstaff%2Fwaleed-al-nuaimy%2F&usg=AOvVaw0ujNrvc3PSg_Csqzrw4etY&opi=89978449">
                  Waleed Al-Nuaimy
                </a>{' '}
                – Department of Electrical Engineering and Electronics
              </li>
              <li>
                <a href="https://uk.linkedin.com/in/lee-devlin-08495351?original_referer=https%3A%2F%2Fwww.google.com%2F"></a>
                Lee Devlin – Department of Electrical Engineering and
                Electronics
              </li>
              <li>
                <a href="https://www.liverpool.ac.uk/computer-science/staff/stuart-thomason/">
                  Stuart Thomason
                </a>{' '}
                – Department of Computer Science
              </li>
              <li>Jeffrey Ray – Department of Computer Science</li>
              <li>
                <a href="https://www.liverpool.ac.uk/electrical-engineering-and-electronics/staff/judith-lewa/">
                  Judith Birtall
                </a>{' '}
                – Student Experience Team Leader in the School of Electrical
                Engineering, Electronics and Computer Science
              </li>
              <li>
                Changhan Yin – EEE graduate in 2023, developed the first
                functioning prototype as part of is BEng final year project.
              </li>
              <li>
                <a href="https://www.linkedin.com/in/abu-baker-iqbal-9112001">
                  Abubaker Iqbal
                </a>{' '}
                – EEE graduate in 2024, developed the second functioning
                prototype as part of is BEng final year project, and as part of
                a summer project with Virej (below).
              </li>
              <li>
                <a href="https://www.linkedin.com/in/virej-dasani-b64470209">
                  Virej Dasani
                </a>{' '}
                – Computer Science student in 2024, worked with Abubaker to
                (from scratch) make the website and make it functional for
                public deployment in 2024-25.
              </li>
              <li>
                Rahul Manikandan – EEE MSc student in 2024, worked with the team
                on some key enhancements and refinements of the portal
                appearance and functionality.
              </li>
              <li>
                <a href="https://www.linkedin.com/in/shahmeer-khan-swe/">
                  Shahmeer Khan
                </a>{' '}
                - Computer Science student in 2024, worked alongside Virej
                Dasani to refine the look and functionality of the frontend
                deployment of the web portal and develop the project further as
                a final year project.
              </li>
              <li>
                <a href="https://www.liverpool.ac.uk/cooper-group/people/bertie,naivalurua/">
                  Bertie Naivalurua
                </a>{' '}
                - CSEE student working at the Cooper Group, taking on Coursework
                Calendar as a challenge for his final year project.
              </li>
            </ul>
            <p>
              Please use{' '}
              <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=MVElUymxEECG4UdL_X6AdsRH2fDbL2JBuaTS3CL94f9URUozTjhSRURFVVhRV0tZN04wRFk5SjBKTi4u">
                this form
              </a>{' '}
              for any questions, feedback, bug reports or feature requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
