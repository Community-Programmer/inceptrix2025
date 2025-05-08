import React from "react";
import { Github, Code, Linkedin, Mail } from "lucide-react";

export default function MattyResume() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 shadow-lg">
      {/* Last Updated */}
      <div className="text-right text-gray-500 text-sm mb-2">
        Last Updated on September 23rd, 2024
      </div>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-wider uppercase mb-4">
          Matty Doe
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="https://github.com/mattyDoe"
            className="flex items-center hover:text-blue-600"
          >
            <Github size={16} className="mr-1" />
            github.com/mattyDoe
          </a>
          <a
            href="https://www.mattydoe.com"
            className="flex items-center hover:text-blue-600"
          >
            <Code size={16} className="mr-1" />
            mattydoe.com
          </a>
          <a
            href="https://linkedin.com/in/mattydoe"
            className="flex items-center hover:text-blue-600"
          >
            <Linkedin size={16} className="mr-1" />
            linkedin.com/in/mattydoe
          </a>
          <a
            href="mailto:mattydoe@gmail.com"
            className="flex items-center hover:text-blue-600"
          >
            <Mail size={16} className="mr-1" />
            mattydoe@gmail.com
          </a>
        </div>
      </header>

      {/* Education Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-2 border-b border-gray-400 pb-1">
          Education
        </h2>
        <div className="ml-2">
          <div className="mb-3">
            <div className="flex justify-between">
              <h3 className="font-bold">College University</h3>
              <span>June 2026</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p>B.S. Computer Science</p>
              <p>Current GPA: 4.0/4.0</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">
                Little High School{" "}
                <span className="font-normal text-sm">
                  (Dual Enrollment at Mission Community College)
                </span>
              </h3>
              <span>June 2022</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p></p>
              <p>GPA: 4.44/4.0</p>
            </div>
          </div>

          {/* Coursework Subsection */}
          <div className="mt-2">
            <h3 className="font-bold text-lg mb-1">Coursework</h3>
            <div className="text-sm">
              <p>
                <span className="font-bold">Courses:</span> Object-Oriented
                Programming, Data Structures & Algorithms, Embedded Systems,
                Discrete Math, Linear Algebra, Calculus, Physics, Probability &
                Statistics
              </p>
              <p>
                <span className="font-bold">Awards:</span> Dean's Honor List
                (3x), AP Scholar with Distinction (2x), World Language History
                Award (Spanish)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-2 border-b border-gray-400 pb-1">
          Skills
        </h2>
        <div className="ml-2 text-sm">
          <div className="mt-2">
            <span className="font-bold">Languages: </span>
            <span>
              C/C++, Python, Java, JavaScript/TypeScript, HTML/CSS, LaTeX
            </span>
          </div>
          <div className="mt-2">
            <span className="font-bold">Tools: </span>
            <span>
              Git/GitHub, Unix Shell, Webpack, VS Code, IntelliJ
              CLion/PyCharm/IDEA, Atom
            </span>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-2 border-b border-gray-400 pb-1">
          Projects
        </h2>
        <div className="ml-2">
          {/* Carbon Project */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">Carbon</h3>
              <div className="text-right">
                <span className="text-sm">Nov. 2023</span>
              </div>
            </div>
            <p className="text-xs italic mb-1">
              Flutter, Dart, Supabase, APIs (INRIX, Google Maps), Git, Unix
              Shell, VS Code
            </p>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Team project for the INRIX Hack 2023 Hackathon, earned Honorable
                Mention
              </li>
              <li>
                Developed a social media mobile app to gamify eco-friendliness
                using the INRIX API
              </li>
              <li>
                Learned how to use Flutter in conjunction with backend databases
                and APIs
              </li>
            </ul>
          </div>

          {/* ChatBuzz Project */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">ChatBuzz</h3>
              <div className="text-right">
                <span className="text-sm">May 2023 - Present</span>
              </div>
            </div>
            <p className="text-xs italic mb-1">
              TypeScript, HTML/CSS, Webpack, API (Twitch), Git, Unix Shell, VS
              Code
            </p>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Developed a full-stack web application for Twitch livestreamers
                to display repeated chat messages on OBS
              </li>
              <li>
                Experimented with Twitch API's OAuth Access Tokens to get chat
                data from the given channel
              </li>
              <li>
                Collaborated with livestreamers to get feedback and suggested
                features
              </li>
              <li>Solved problems relating to asynchronous tasks</li>
            </ul>
          </div>

          {/* FoodDropper Project */}
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold">FoodDropper</h3>
              <div className="text-right">
                <span className="text-sm">Aug. 2022</span>
              </div>
            </div>
            <p className="text-xs italic mb-1">
              Java, Maven, API (Spigot), Git, IntelliJ IDEA
            </p>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Developed a Minecraft server plugin to limit players to one way
                of replenishing their hunger bar
              </li>
              <li>
                Used persistent data containers to save and load data, ensuring
                that it persists across plugin resets
              </li>
              <li>
                Optimized UX e.g. sound design, food drop timing, supplied
                saturation level, and addressed potential workarounds
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-2 border-b border-gray-400 pb-1">
          Experience
        </h2>
        <div className="ml-2">
          {/* Competitive Programming */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">
                Competitive Programming Club{" "}
                <span className="font-normal">| Member</span>
              </h3>
              <div className="text-right">
                <span className="text-sm">Sept. 2023 - Present</span>
              </div>
            </div>
            <p className="text-sm">
              Involved in the club centered around Competitive Programming
            </p>
          </div>

          {/* Apex Tutoring */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">
                Apex Tutoring <span className="font-normal">| Tutor</span>
              </h3>
              <div className="text-right">
                <span className="text-sm">2019 - Present</span>
              </div>
            </div>
            <p className="text-sm">
              Routinely tutor K-12 students in math, coding, etc.
            </p>
          </div>

          {/* Luigi Team Charity */}
          <div className="mb-6">
            <div className="flex justify-between">
              <h3 className="font-bold">
                Luigi Team Charity{" "}
                <span className="font-normal">| Volunteer, Manager</span>
              </h3>
              <div className="text-right">
                <span className="text-sm">2018 - Present</span>
              </div>
            </div>
            <p className="text-sm">
              Earned an award for philanthropic hours spent, still giving away
              100 stocked backpacks a year
            </p>
          </div>

          {/* Hobbies Subsection */}
          <div>
            <h3 className="font-bold text-lg mb-2">Hobbies</h3>

            {/* Playing Drums */}
            <div className="mb-4 ml-2">
              <div className="flex justify-between">
                <h4 className="font-bold">Playing the Drums</h4>
                <div className="text-right">
                  <span className="text-sm">2013 - 2019</span>
                </div>
              </div>
              <p className="text-sm">
                Played the drums in symphonic, jazz, and marching bands
              </p>
            </div>

            {/* Time Keeping Challenge */}
            <div className="ml-2">
              <div className="flex justify-between">
                <h4 className="font-bold">
                  3rd Place Time Keeping Challenge Championship{" "}
                  <span className="font-normal text-xs">
                    (Time Keeping Association)
                  </span>
                </h4>
                <div className="text-right">
                  <span className="text-sm">Feb. 2022 - May 2022</span>
                </div>
              </div>
              <p className="text-sm">
                Won $1500 nationally competing against high school students in
                counting seconds and minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
