// import Branding from '../Branding/Branding';

const About = () => {
  return (
    <div>
      {/* <Branding /> */}
      <button
        className="backButton btn btn-secondary mx-3 my-3 fixed-top col-sm-1"
        onClick={() => {
          window.history.back();
        }}
      >
        Home
      </button>
      <h1 className="text-center mt-4 mb-4">About</h1>
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
                Waleed Al-Nuaimy – Department of Electrical Engineering and
                Electronics
              </li>
              <li>
                Lee Devlin – Department of Electrical Engineering and
                Electronics
              </li>
              <li>Stuart Thomason – Department of Computer Science</li>
              <li>Jeffrey Ray – Department of Computer Science</li>
              <li>
                Judith Birtall – Student Experience Team Leader in the School of
                Electrical Engineering, Electronics and Computer Science
              </li>
              <li>
                Changhan Yin – EEE graduate in 2023, developed the first
                functioning prototype as part of is BEng final year project.
              </li>
              <li>
                Abubaker Iqbal – EEE graduate in 2024, developed the second
                functioning prototype as part of is BEng final year project, and
                as part of a summer project with Virej (below).
              </li>
              <li>
                Virej Dasani – Computer Science student in 2024, worked with
                Abubaker to make the web portal suitable for public deployment
                in 2024-25.
              </li>
              <li>
                Rahul Manikandan – EEE MSc student in 2024, worked with the team
                on some key enhancements and refinements of the portal
                appearance and functionality.
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
