/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Shivam Nagar Student ID: 142227230 Date: July 20, 2024
*
********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080; // Defining 8080 as our port to listen
const express = require("express"); // Import the express module
const path = require('path'); // Import the path module
const exphbs = require('express-handlebars'); // Import the express handlebars
const collegeData = require('./modules/collegeData'); // Import the collegeData module

const app = express(); 

// Set up handlebars
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, './views/layouts')
}));
app.set('view engine', '.hbs');

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Route to render the home page
app.get('/', (req, res) => {
  res.render('home', { pageTitle: 'Home', year: new Date().getFullYear() });
});

// Route to get all students
app.get('/students', (req, res) => {
  collegeData.getAllStudents()
    .then(data => res.render('students', { students: data }))
    .catch(err => {
      console.error("Error fetching students:", err);
      res.render('students', { message: "No results" });
    });
});

// Route to get a specific student by student number
app.get('/student/:studentNum', (req, res) => {
  collegeData.getStudentById(req.params.studentNum)
    .then(data => res.render('student', { student: data }))
    .catch(err => {
      console.error("Error fetching student:", err);
      res.status(404).send("Student not found");
    });
});

// Route to get all teaching assistants (TAs)
app.get('/tas', (req, res) => {
  collegeData.getTAs()
    .then(tas => res.json(tas)) // Return the JSON string of TAs
    .catch(err => {
      console.error("Error fetching TAs:", err);
      res.status(404).send(err); // Handle error if any
    });
});

app.get('/courses', (req, res) => {
  collegeData.getCourses() // Call the correct function
    .then(courses => res.json(courses))
    .catch(err => res.status(500).json({ error: err.message }));
});


// Route to get a specific course by course ID
app.get('/course/:courseId', (req, res) => {
  collegeData.getCourseById(req.params.courseId)
    .then(data => res.render('course', { course: data }))
    .catch(err => {
      console.error("Error fetching course:", err);
      res.status(404).send("Course not found");
    });
});

// Route to render the About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us', description: 'This application helps manage college student data efficiently.', year: new Date().getFullYear() });
});

// Route to render the HTML Demo page
app.get('/htmlDemo', (req, res) => {
  res.render('htmlDemo', { pageTitle: 'HTML Demo', headerTitle: 'HTML Demo', description: 'This page is a demonstration of HTML content converted to Handlebars template.', year: new Date().getFullYear() });
});

// Route to render the Add Students page
app.get('/addStudents', (req, res) => {
  res.render('addStudents', { pageTitle: 'Add Student', year: new Date().getFullYear() });
});


// Route to handle adding a new student
app.post('/addStudent', (req, res) => {
  const newStudent = req.body;
  collegeData.addStudent(newStudent)
    .then(() => {
      res.redirect('/students');
    })
    .catch(err => {
      console.error("Error adding student:", err);
      res.status(500).send("Error adding student");
    });
});

// Handling invalid routes with HTTP status 404
app.use((req, res) => {
  console.error(`404 error for ${req.originalUrl}`);
  res.status(404).send("Page Not Found");
});

// Initialize data and start server
collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error(`Failed to initialize data: ${err}`);
  });
