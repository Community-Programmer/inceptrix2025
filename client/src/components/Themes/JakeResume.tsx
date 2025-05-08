import React from "react";
import { Mail, Linkedin, Github, Phone } from "lucide-react";

export default function JakeResume() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 shadow-lg">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-wider uppercase mb-2">
          Jake Ryan
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a
            href="tel:123-456-7890"
            className="flex items-center hover:text-blue-600"
          >
            <Phone size={16} className="mr-1" />
            123-456-7890
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="mailto:jake@su.edu"
            className="flex items-center hover:text-blue-600"
          >
            <Mail size={16} className="mr-1" />
            jake@su.edu
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://linkedin.com/in/jake"
            className="flex items-center hover:text-blue-600"
          >
            <Linkedin size={16} className="mr-1" />
            linkedin.com/in/jake
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://github.com/jake"
            className="flex items-center hover:text-blue-600"
          >
            <Github size={16} className="mr-1" />
            github.com/jake
          </a>
        </div>
      </header>

      {/* Education Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-1 border-b border-gray-400 pb-1">
          Education
        </h2>
        <div className="ml-2">
          <div className="mb-3">
            <div className="flex justify-between">
              <h3 className="font-bold">Southwestern University</h3>
              <span>Georgetown, TX</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p>Bachelor of Arts in Computer Science, Minor in Business</p>
              <p>Aug. 2018 - May 2021</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <h3 className="font-bold">Blinn College</h3>
              <span>Bryan, TX</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p>Associate's in Liberal Arts</p>
              <p>Aug. 2014 - May 2018</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-1 border-b border-gray-400 pb-1">
          Experience
        </h2>
        <div className="ml-2">
          {/* Research Assistant Position */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">Undergraduate Research Assistant</h3>
              <span>June 2020 - Present</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p>Texas A&M University</p>
              <p>College Station, TX</p>
            </div>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Developed a REST API using FastAPI and PostgreSQL to store data
                from learning management systems
              </li>
              <li>
                Developed a full-stack web application using Flask, React,
                PostgreSQL and Docker to analyze GitHub data
              </li>
              <li>
                Explored ways to visualize GitHub collaboration in a classroom
                setting
              </li>
            </ul>
          </div>

          {/* IT Support Position */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">
                Information Technology Support Specialist
              </h3>
              <span>Sep. 2018 - Present</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p>Southwestern University</p>
              <p>Georgetown, TX</p>
            </div>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Communicate with managers to set up campus computers used on
                campus
              </li>
              <li>
                Assess and troubleshoot computer problems brought by students,
                faculty and staff
              </li>
              <li>
                Maintain upkeep of computers, classroom equipment, and 200
                printers across campus
              </li>
            </ul>
          </div>

          {/* AI Research Position */}
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold">
                Artificial Intelligence Research Assistant
              </h3>
              <span>May 2019 - July 2019</span>
            </div>
            <div className="flex justify-between text-sm italic">
              <p>Southwestern University</p>
              <p>Georgetown, TX</p>
            </div>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Explored methods to generate video game dungeons based off of{" "}
                <em>The Legend of Zelda</em>
              </li>
              <li>Developed a game in Java to test the generated dungeons</li>
              <li>
                Contributed 50K+ lines of code to an established codebase via
                Git
              </li>
              <li>
                Conducted a human subject study to determine which video game
                dungeon generation technique is enjoyable
              </li>
              <li>
                Wrote an 8-page paper and gave multiple presentations on-campus
              </li>
              <li>
                Presented virtually to the World Conference on Computational
                Intelligence
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-6">
        <h2 className="text-lg uppercase font-bold mb-1 border-b border-gray-400 pb-1">
          Projects
        </h2>
        <div className="ml-2">
          {/* Gitlytics Project */}
          <div className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold">Gitlytics</h3>
              <span className="italic">
                Python, Flask, React, PostgreSQL, Docker
              </span>
            </div>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Developed a full-stack web application using with Flask serving
                a REST API with React as the frontend
              </li>
              <li>
                Implemented GitHub OAuth to get data from user's repositories
              </li>
              <li>Visualized GitHub data to show collaboration</li>
              <li>Used Celery and Redis for asynchronous tasks</li>
            </ul>
          </div>

          {/* Simple Paintball Project */}
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold">Simple Paintball</h3>
              <span className="italic">
                Spigot API, Java, Maven, TravisCI, Git
              </span>
            </div>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                Developed a Minecraft server plugin to entertain kids during
                free time for a previous job
              </li>
              <li>
                Published plugin to websites gaining 2K+ downloads and an
                average 4.5/5-star review
              </li>
              <li>
                Implemented continuous delivery using TravisCI to build the
                plugin upon new a release
              </li>
              <li>
                Collaborated with Minecraft server administrators to suggest
                features and get feedback about the plugin
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-lg uppercase font-bold mb-1 border-b border-gray-400 pb-1">
          Technical Skills
        </h2>
        <div className="ml-2 text-sm">
          <div className="mt-2">
            <span className="font-bold">Languages: </span>
            <span>
              Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R
            </span>
          </div>
          <div className="mt-1">
            <span className="font-bold">Frameworks: </span>
            <span>
              React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI
            </span>
          </div>
          <div className="mt-1">
            <span className="font-bold">Developer Tools: </span>
            <span>
              Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual
              Studio, PyCharm, IntelliJ, Eclipse
            </span>
          </div>
          <div className="mt-1">
            <span className="font-bold">Libraries: </span>
            <span>pandas, NumPy, Matplotlib</span>
          </div>
        </div>
      </section>
    </div>
  );
}
