// Variables
const courses = document.querySelector('#courses-list'),
      shoppingCartContent = document.querySelector('#cart-content tbody'),
      clearCartBtn = document.querySelector('#clear-cart');


// Listeners
loadEventListeners();

function loadEventListeners() {
    // When is new cors is added
    courses.addEventListener('click', buyCourse)

    // When the remove button is clicked
    shoppingCartContent.addEventListener('click', removeCourse)

    // Clear cart Btn
    clearCartBtn.addEventListener('click', clearCart)

    // Document ready
    document.addEventListener('DOMContentLoaded', getFromLocalStorage);
}



// Functions
function buyCourse(evt) {
    evt.preventDefault();
    // Use delegation to find the course that was added
    if(evt.target.classList.contains('add-to-cart')) {
        // Read the course values
        const course = evt.target.parentElement.parentElement;
        
        // Read the value
        getCourseInfo(course);
    }
}

// Reads the html information of the selected course
function getCourseInfo(course) {
    // Create an object with course Date
    const courseInfo = {
         image: course.querySelector('img').src,
         title: course.querySelector('h4').textContent,
         price: course.querySelector('.price span').textContent,
         id: course.querySelector('a').getAttribute('data-id')
    }
    // Insert into the shopping cart
    addIntoCart(courseInfo)
}

// Dispaly the selected course into the shopping cart
function addIntoCart(course) {
    // Create <tr>
    const row = document.createElement('tr');

    // Build the template
    row.innerHTML = `
        <tr>
            <td>
                <img src="${course.image}" width="100">
            </td>
            <td>${course.title}</td>
            <td>${course.price}</td>
            <td>
                <a href="#" class="remove" data-id="${course.id}">X</a>
            </td>
        </tr>
    `;

    // Add into the shopping cart
    shoppingCartContent.appendChild(row);

    // Add course into Storage
    saveIntoStorage(course);
}

// Add che course into the Local sorage
function saveIntoStorage(course) {

    let courses = getCoursesFromStorage();

    // Add the course into array
    courses.push(course);

    // Since storage only saves string, we need to convert JSON into String
    localStorage.setItem('courses', JSON.stringify(courses))
}

// Get the content from Storage
function getCoursesFromStorage() {

    let courses;

    // if something exist on storage then we get value, otherwise create an empty array
    if(localStorage.getItem('courses') === null) {
        courses = [];
    } else {
        courses = JSON.parse(localStorage.getItem('courses'))
    }
    return courses;
}

// Remove course from the DOM
function removeCourse(evt) {
    let course, courseId;

    if(evt.target.classList.contains('remove')) {
        evt.target.parentElement.parentElement.remove();
        course = evt.target.parentElement.parentElement;
        courseId = course.querySelector('a').getAttribute('data-id')
    }
    
    // Remove from the Local storage
    removeCourseLocalStorage(courseId);
}

// Remove from Local storage
function removeCourseLocalStorage(id) {
    // Get the Local storage data
    let coursesLS = getCoursesFromStorage();

    // loop throught tha array and find index to remove
    coursesLS.forEach(function(courseLS, index) {
        if (courseLS.id === id) {
            coursesLS.splice(index, 1);
        }
    });

    // Add the rest of the array
    localStorage.setItem('courses', JSON.stringify(coursesLS))
}

// Clears the shopping cart
function clearCart() {
    // shoppingCartContent.innerHTML = '';

    while(shoppingCartContent.firstChild) {
        shoppingCartContent.removeChild(shoppingCartContent.firstChild);
    }

    // Clear from Local Storage
    clearLocalStorage();
}

// Clears the whole Local Storage
function clearLocalStorage() {
    localStorage.clear();
}

// Loads when document is ready and print courses into shopping cart
function getFromLocalStorage() {
    
    let coursesLS = getCoursesFromStorage();

    // LOOP throught the courses and print into the cart
    coursesLS.forEach(function(course) {
        // Create <tr>
        const row = document.createElement('tr');

        // Print the content
        row.innerHTML = `
            <tr>
                <td>
                    <img src="${course.image}" width="100">
                </td>
                <td>${course.title}</td>
                <td>${course.price}</td>
                <td>
                    <a href="#" class="remove" data-id="${course.id}">X</a>
                </td>
            </tr>
        `;
        shoppingCartContent.appendChild(row);
    });
}