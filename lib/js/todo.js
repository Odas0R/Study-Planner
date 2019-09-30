import { pomodoroTimer } from './pomodoro.js'

document.addEventListener("DOMContentLoaded", () => {

    firstView();

    //=================================
    // First view - Adding Listeners
    //=================================
    function firstView() {

        // List buttons (Remove, Done, Timer) & Input
        const removeTodo = document.querySelectorAll(".garbage");
        const doneTodo = document.querySelectorAll(".checked");
        const timerTodo = document.querySelectorAll(".timer");
        const removeListButton = document.querySelectorAll(".remove");
        const lis = document.querySelectorAll("li");
        const addTodo = document.querySelector(".input-todo"); // Get the input of the first To-Do List

        // Event Listener to add Todos in the first list 
        addTodoListener(addTodo);
        listButtonsListeners(removeTodo, doneTodo, timerTodo, removeListButton);
        displayButtonsOnHover(lis, removeTodo, doneTodo, timerTodo);
        addRemoveListListener(removeListButton);
        addNewListListener();
    }

    // Add a new List EventListener
    function addNewListListener() {
        // Add list input
        const listNames = document.querySelectorAll('form input');
        // Add list button
        const listInupts = document.querySelectorAll("form button");

        for (let i = 0; i < listInupts.length; i++) {
            listInupts[i].addEventListener('click', function () {
                // Get the Input Value 
                let value = listNames[i].value.trim();
                if (value) {
                    // Creates a new List with click
                    addNewList(value);
                    // Reset the list name input
                    listNames[i].value = '';
                }
            });

            // Enter keypress functionality
            listNames[i].addEventListener('keypress', function (event) {
                let key = event.which;
                if (key === 13) {
                    event.preventDefault();
                    listInupts[i].click();
                }
            });
        }
    }

    function addTodoListener(inputTodo) {
        // Add new todo listener
        inputTodo.addEventListener("keypress", function (event) {
            // Get the ul below the input to add the todo's
            var ul = this.parentNode.querySelector("ul");
            // Get the key code (Enter key == 13)
            var key = event.which;
            if (key === 13) {
                // this.value == input value
                var todo = this.value.trim();
                // Create the actual new to-do
                if (todo) {
                    var div = document.createElement("div");
                    var newTodo = document.createElement("li");

                    newTodo.classList.add("todo-background");
                    newTodo.innerHTML = `
                    <span>${todo}</span>
                    <div class="icon-container hidden">
                        <div><img class="timer" src="icons/hourglass.png" alt=""></i></div>
                        <div><img class="checked" src="icons/checked.png" alt=""></i></div>
                        <div><img class="garbage" src="icons/garbage.png" alt=""></i></div>
                    </div>
                `;
                    div.append(newTodo);

                    var allDivs = ul.closest('div');
                    if (!insertBeforeFinished(div, allDivs, ul)) {
                        ul.append(div);
                    }
                    // Clear input
                    this.value = '';

                    //! Need to get the nodes via querySelectorAll() to get an nodeList
                    let removeTodo = div.childNodes[0].querySelectorAll(".garbage");
                    let doneTodo = div.childNodes[0].querySelectorAll(".checked");
                    let timerTodo = div.childNodes[0].querySelectorAll(".timer");

                    // Add event listeners
                    listButtonsListeners(removeTodo, doneTodo, timerTodo);
                    displayButtonsOnHover(new Array(newTodo));
                }
            }
        });
    }

    // List Buttons Listeners
    function listButtonsListeners(removeTodo, doneTodo, timerTodo) {

        //* Remove ToDo Listener
        removeTodo.forEach(function (elem) {
            elem.addEventListener("click", function () {
                this.closest("li").parentNode.remove();

            });
        });

        // Done ToDo Listener
        doneTodo.forEach(function (elem) {
            elem.addEventListener("click", function () {
                //* todo -> Li
                let todo = this.closest('li');
                // Inner Text
                let todoText = todo.querySelector("span").innerText;
                let garbageIcon = todo.querySelector(".garbage");
                // Reset Todo
                todo.innerHTML = `
                <div class="removed-todo">
                    <span class="done-todo">${todoText}</span >
                </div>`;
                todo.querySelector(".removed-todo").appendChild(garbageIcon);

                // Reset Css
                todo.classList.remove("todo-background");
                todo.classList.remove("todo-background-hover");
                todo.classList.add("todo-reset");

                // Append at the last pos in the ul
                let ul = todo.closest("ul");
                let div = todo.parentNode;

                // Remove the actual div
                div.remove();
                // Put the li in the final of the ul
                ul.appendChild(div);
            });
        });

        // Timer ToDo Listener
        timerTodo.forEach(function (elem) {

            elem.addEventListener('click', function () {
                let task = this.closest('li').querySelector('span').innerText;
                let audio1 = new Audio('audio/audio1.mp3');
                let audio2 = new Audio('audio/audio2.mp3');
                let audio3 = new Audio('audio/audio3.mp3');
                let audios = [audio1, audio2, audio3];
                pomodoroTimer(task, audios);
            })
        });
    }

    // Remove List Listener
    function addRemoveListListener(removeListButton) {
        removeListButton.forEach(function (elem) {
            elem.addEventListener("click", function () {
                // Returns the closest .container elem
                elem.closest(".container").remove();
            })
        });
    }

    // Hovering Li's to display all buttons
    function displayButtonsOnHover(li) {
        li.forEach(function (elem) {
            let div = elem.querySelector('.icon-container');
            let span = elem.querySelector('span');

            div.style.height = `${elem.offsetHeight - 12}px`;
            elem.addEventListener("mouseover", function () {

                span.classList.toggle('hidden');
                div.classList.toggle('hidden');
                elem.classList.add("todo-background-hover");
            });
            elem.addEventListener("mouseout", function () {
                span.classList.toggle('hidden');
                div.classList.toggle('hidden');
                elem.classList.remove("todo-background-hover");
            });
        });
    }

    /**   
     ** Returns true if it was added a new todo after a ".done-todo" span inside the todo div
     *
     * @param {Node} div - The todo that's beeing added
     * @param {Node} allDivs - All the todos in the ul
     * @param {Node} ul - The ul that contains all the todos
     * @returns true if it was added before the done-todo div, false if contratry
     */
    function insertBeforeFinished(div, allDivs, ul) {
        for (let i = 0; i < allDivs.length; i++) {
            let span = allDivs[i].querySelector("span");
            if (span.classList.contains("done-todo")) {
                // Insert the new ToDo before the done todo
                ul.insertBefore(div, allDivs[i]);
                return true;
            }
        }
        return false;
    }

    /** 
     **   Add a new List Card
     *   @param {*} listName - Input list name
    */
    function addNewList(listName) {
        var div = document.createElement("div");
        var divHeading = document.createElement("div");
        var todos = document.createElement("ul");
        var inputTodo = document.createElement("input");
        var id = getColumnID();

        div.className = "container mt-5 text-center list-display";
        divHeading.className = "heading-todo";

        divHeading.innerHTML = `
                    <img class="remove mb-2" src="icons/remove.png" alt="">
                        <div class="container-header">
                            <h4>${listName}</h4>
                        </div>
                `;
        inputTodo.className = "input-todo text-center";
        inputTodo.placeholder = "Enter a new task..."

        addTodoListener(inputTodo);
        div.appendChild(divHeading);
        div.appendChild(inputTodo);
        div.appendChild(todos);

        document.getElementById(id).appendChild(div);

        var deleteList = document.querySelectorAll(".remove");

        // Remove List Listener
        addRemoveListListener(deleteList);
    }

    //==============================================
    //* Add a new list algorithm (It's a bit messy)
    //
    //* Works like an two dimensional array, 
    //* If a row is full then goes to the next row,
    //* at the first column (It searches by column)
    //
    //==============================================

    function getColumnID() {
        //Class name is wierd because of bootstrap, represents the 3 columns 
        const cols = document.getElementsByClassName("col-lg-4 col-md-6 col-sm-6");
        let arr = [];

        //Fill the array
        for (let item of cols) {
            arr.push(item.childElementCount);
        }
        //If all the values have the same value adds a new list to the first column
        if (allValueSame(arr)) {
            return cols[0].id;
        }

        for (let i = 0; i < cols.length; i++) {
            //ChildElementCount counts only the container(div)
            if (cols[i].childElementCount === 0) {
                return cols[i].id;
            }
        }
        let index = arr.indexOf(minElementsColID(arr));
        return cols[index].id;
    }


    //This is a function that checks if all the elements in a array are equal
    function allValueSame(array) {
        for (let i = 1; i < array.length; i++) {
            if (array[i] !== array[0]) {
                return false;
            }
        }
        return true;
    }

    // Get the minimum number of elements in all columns
    function minElementsColID(array) {
        return Math.min.apply(Math, array);
    }

});
