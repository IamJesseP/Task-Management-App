# Task-Management-App
A fullstack application written with Nodejs, Expressjs, and Firebase. This full-stack application aims to create an 
interface where users can view, create, and manage tasks, enhancing overall productivity and organization. The 
application leverages Node.js for backend and React for frontend. Data is persistently stored using Firebase.

The application's frontend is deployed on Vercel and the backend is deployed on Heroku.


**A live frontend can be found [here](https://task-management-app-nine-beryl.vercel.app/)**

**A live backend with documentation of the API can be found [here](https://tech-incubator-task-api.herokuapp.com/)**
#

### Technologies
* JSX
* React
* NodeJS
* ExpressJS
* Firebase
* Vercel + Heroku

### Tools
* Visual Studio
* Git and GitHub
* NPM
* Postman


## Functionality

### Task Management
* allows users to create, update, and delete tasks, providing a user-friendly dashboard to manage all tasks.
* tasks can be claimed by students in a marketplace dashboard
* dashboard has filtering functionality, allowing users to see all, claimed, or unclaimed tasks
* tasks are tracked with a status, either being open, in-progress, or closed


### User Authentication
* Secure user authentication intregrated through Firebase, 
* Allows for user registration, login, and secure access to tasks.


### Role-based Access
* Differentiated access based on user roles (students, company), giving a custom user experience
* Students can claim tasks, update task status, and turn in google doc links
* Companies can create tasks and monitor task submission status


#



### Security Packages
* helmet
* cors
* xss-clean
* express-rate-limit


### Documentation created with DocGen



## What we learned

 **Full-Stack Development** 

  * Learned how to develop a full-stack application, working on both the backend and frontend. 
  The backend was developed using Node.js, while the frontend was developed using React.
  
 **Authentication and Authorization** 

  * Learned how to implement user authentication and authorization, integrating Firebase for user management. 
  Also learned how to manage secure tokens for authenticated access to certain parts of the application.
  
 **Database Management** 

 * Learned how to use Firebase, a NoSQL database, to persistently store and manage data. This included creating, reading, updating, and deleting data (CRUD operations).
  
  
 **Server-Client Communication** 

  * Developed an understanding of how the client and server communicate, using various HTTP methods like GET, POST, DELETE, and PATCH.
  
  
 **Error Handling and Debugging** 
  
  * Throughout the project, faced and resolved numerous errors, which improved our debugging skills and understanding of error handling.
  
  
 **Asynchronous JavaScript** 
  
  * Used asynchronous JavaScript (async/await) to handle asynchronous operations, gaining a deeper understanding of promises and asynchronous execution in JavaScript.
  
 **Deployment and Environment Management** 

  * Learned how to deploy your applications on Heroku and Vercel, and manage different environments for development, testing, and production.
  
  
  
 **Version Control with Git** 
   
  * Learned to manage changes in our project, especially in a group settings with merge conflicts.
  
 **Programming Best Practices**


### TODOS:
* Update profile after registration
* Delete task frontend
* Landing page
* Responsiveness
