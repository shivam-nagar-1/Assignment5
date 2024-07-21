/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Shivam Nagar Student ID: 142227230 Date: July 20, 2024
*
********************************************************************************/

const fs = require('fs'); // Import fs module
const path = require('path'); // Import path module

const dataFilePath = path.join(__dirname, 'data', 'courses.json'); // Path for courses data file

// Function to get all Courses 
function getAllCourses() {
    return JSON.parse(fs.readFileSync(coursesFilePath, 'utf-8'));
}

module.exports = { getAllCourses };

// Function to get all students
function getAllStudents() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data', 'students.json'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Function to get students by course
function getStudentsByCourse(course) {
  return getAllStudents().then(students => {
    return students.filter(student => student.course === course);
  });
}

// Function to get TAs
function getTAs() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data', 'tas.json'), 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Function to get all courses
function getCourses() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Function to get a specific student by their student number
function getStudentByNum(num) {
  return getAllStudents().then(students => {
    return students.find(student => student.num === num);
  });
}

// Function to add a new student
function addStudent(student) {
  return new Promise((resolve, reject) => {
    getAllStudents().then(students => {
      students.push(student);
      fs.writeFile(path.join(__dirname, 'data', 'students.json'), JSON.stringify(students), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).catch(reject);
  });
}

// Function to initialize data
function initialize() {
  // Example initialization code
  return Promise.resolve(); // Adjust based on actual initialization logic
}

module.exports = {
  getAllStudents,
  getStudentsByCourse,
  getTAs,
  getCourses,
  getStudentByNum,
  addStudent,
  initialize
};
