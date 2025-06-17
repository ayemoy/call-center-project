
About the Project
This is a full stack application I built as part of a personal self-learning initiative, focused on mastering modern web development practices. The platform helps call center teams handle incoming calls more efficiently by enabling admins to manage tags and tasks, while users assign and update tasks for specific calls.

It was also my first time working with TypeScript, and I took the opportunity to teach myself the language while building a complete system from scratch.

Technologies Used
Frontend
React (with TypeScript – self-learned for this project)

MUI (Material UI) – for responsive, clean design

Socket.IO Client – for real-time sync between users

Axios – for API interactions

React Context API – for app-wide state sharing

Backend
Node.js + Express.js

TypeScript

Socket.IO Server – for bi-directional communication

Firebase Firestore – used to store and manage all data, including calls, tasks, tags, and user roles

Firebase Admin SDK – for secure backend access to Firestore

CORS, dotenv, cookie-parser – for secure API handling and config

Deployment
Render – used to deploy the live frontend app

Modular project structure with separation of concerns:

routes, controllers, services, and data-access layers in the backend

Demo Login Credentials
Admin Access
Email: yoav@gmail.com

Password: 123456

Regular User Access
Email: avi@gmail.com

Password: 1234567

Core Features
Admin Panel
Create and edit Tags

Create Suggested Tasks and associate them with tags

System-wide updates: when a tag/task is renamed, all associated records update automatically

User Panel
View, create, and manage Calls

Assign tags and tasks to each call

See task suggestions based on selected tags

Track task status: Open, In Progress, Completed

Live updates across users via WebSockets

What I Learned
Built a real-time collaborative system using Socket.IO

Implemented a structured backend in TypeScript for the first time

Designed a scalable frontend using React + TypeScript

Gained hands-on experience with Firestore as a NoSQL cloud database

Developed a full CI/CD flow including deployment
