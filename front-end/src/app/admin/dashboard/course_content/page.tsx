import { Metadata } from "next";
import { lusitana } from "../../ui/fonts";

export const metadata: Metadata = {
  title: "Course Content",
};

export default function Page() {
  const courses = [
    {
      title: "Introduction to Web Development",
      description:
        "Learn the basics of web development, including HTML, CSS, and JavaScript.",
      sections: [
        {
          title: "Getting Started with HTML",
          lessons: [
            { title: "Introduction to HTML", duration: "15 min" },
            { title: "Basic HTML Tags", duration: "25 min" },
            { title: "Creating Your First Web Page", duration: "20 min" },
          ],
        },
        {
          title: "Styling with CSS",
          lessons: [
            { title: "Introduction to CSS", duration: "20 min" },
            { title: "Selectors and Properties", duration: "30 min" },
            { title: "Box Model and Layout", duration: "35 min" },
          ],
        },
        {
          title: "JavaScript Basics",
          lessons: [
            { title: "Introduction to JavaScript", duration: "25 min" },
            { title: "Variables and Data Types", duration: "30 min" },
            { title: "Control Flow and Functions", duration: "40 min" },
          ],
        },
      ],
    },
    {
      title: "Advanced JavaScript",
      description:
        "Deep dive into advanced JavaScript topics, including ES6+ features and asynchronous programming.",
      sections: [
        {
          title: "ES6 and Beyond",
          lessons: [
            { title: "Arrow Functions", duration: "20 min" },
            { title: "Destructuring and Spread Operator", duration: "25 min" },
            { title: "Promises and Async/Await", duration: "30 min" },
          ],
        },
        {
          title: "Asynchronous JavaScript",
          lessons: [
            { title: "Understanding Callbacks", duration: "20 min" },
            { title: "Working with Promises", duration: "30 min" },
            { title: "Async/Await in Depth", duration: "35 min" },
          ],
        },
        {
          title: "JavaScript Design Patterns",
          lessons: [
            { title: "Introduction to Design Patterns", duration: "25 min" },
            { title: "Module Pattern", duration: "30 min" },
            { title: "Observer Pattern", duration: "35 min" },
          ],
        },
      ],
    },
    {
      title: "React for Beginners",
      description:
        "A comprehensive guide to building dynamic web applications using React.js.",
      sections: [
        {
          title: "Getting Started with React",
          lessons: [
            { title: "Introduction to React", duration: "20 min" },
            { title: "JSX and Components", duration: "25 min" },
            { title: "State and Props", duration: "30 min" },
          ],
        },
        {
          title: "React Router and Navigation",
          lessons: [
            { title: "Setting Up React Router", duration: "20 min" },
            { title: "Nested Routes", duration: "25 min" },
            { title: "Dynamic Routing", duration: "30 min" },
          ],
        },
        {
          title: "Advanced React Concepts",
          lessons: [
            { title: "Hooks Overview", duration: "20 min" },
            { title: "useEffect and useContext", duration: "30 min" },
            { title: "Custom Hooks", duration: "35 min" },
          ],
        },
      ],
    },
    {
      title: "Full-Stack Development with MERN",
      description:
        "Learn how to build full-stack web applications using MongoDB, Express, React, and Node.js.",
      sections: [
        {
          title: "Introduction to MERN Stack",
          lessons: [
            { title: "Overview of MERN Stack", duration: "20 min" },
            {
              title: "Setting Up Your Development Environment",
              duration: "30 min",
            },
            { title: "Building a Simple REST API", duration: "40 min" },
          ],
        },
        {
          title: "Backend with Node.js and Express",
          lessons: [
            { title: "Introduction to Node.js", duration: "25 min" },
            { title: "Working with Express", duration: "30 min" },
            { title: "Connecting to MongoDB", duration: "35 min" },
          ],
        },
        {
          title: "Frontend with React",
          lessons: [
            { title: "Building React Components", duration: "25 min" },
            { title: "Managing State with Redux", duration: "30 min" },
            { title: "Integrating Backend with Frontend", duration: "35 min" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} mb-8 text-2xl`}>Course Content</h1>
      </div>
      <div className="grid gap-4">
        {courses.map((course, index) => (
          <div key={index} className="rounded bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              {course.title}
            </h2>
            <p className="text-gray-600">{course.description}</p>
            {course.sections.map((section, secIndex) => (
              <div key={secIndex} className="mt-4">
                <h3 className="text-lg font-medium text-gray-700">
                  {section.title}
                </h3>
                <ul className="mt-2 list-disc pl-5">
                  {section.lessons.map((lesson, lesIndex) => (
                    <li key={lesIndex} className="text-gray-600">
                      {lesson.title} - {lesson.duration}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
