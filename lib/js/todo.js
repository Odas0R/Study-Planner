import { pomodoroTimer } from './pomodoro.js'
import List from './list.js'

document.addEventListener("DOMContentLoaded", () => {

    let lists = [];

    if (localStorage.length > 0) {
        localStorageSetup();
    } else {
        firstView();
    }


    //=================================
    // First view - Adding Listeners
    //=================================
    function firstView() {

        // List buttons (Remove, Done, Timer) & Input
        document.getElementById("col1").innerHTML = firstListExample();
        const removeTodo = document.querySelectorAll(".garbage");
        const doneTodo = document.querySelectorAll(".checked");
        const timerTodo = document.querySelectorAll(".timer");
        const removeListButton = document.querySelectorAll(".remove");
        const lis = document.querySelectorAll("li");
        const addTodo = document.querySelector(".input-todo"); // Get the input of the first To-Do List
        const firstList = new List("Todo-List");
        firstList.addTodo("Thing to do 1");
        lists.push(firstList);

        // Event Listener to add Todos in the first list 
        addTodoListener(addTodo);
        listButtonsListeners(removeTodo, doneTodo, timerTodo, removeListButton);
        displayButtonsOnHover(lis, removeTodo, doneTodo, timerTodo);
        addRemoveListListener(removeListButton);
        addNewListListener();
    }

    // Add a new List EventListener
    function addNewListListener() {
        const addListInput = document.getElementById("addlist-input")
        const addListButton = document.getElementById("addlist-button");

        addListButton.addEventListener('click', (event) => {
            let listName = addListInput.value.trim();
            if (listName) {
                addNewList(listName);
                addListInput.value = '';
                event.preventDefault();
            }
        });

        addListInput.addEventListener('keypress', (event) => {
            let listName = addListInput.value.trim();
            let key = event.which;
            if (key === 13 && listName) {
                addNewList(listName);
                addListInput.value = '';
                event.preventDefault();
            }
        });
    }

    function addTodoListener(inputTodo) {
        // Add new todo listener
        inputTodo.addEventListener("keypress", function (event) {
            // Get the ul below the input to add the todo's
            let ul = this.parentNode.querySelector("ul");
            // Get the key code (Enter key == 13)
            let key = event.which;
            if (key === 13) {
                // this.value == input value
                let todo = this.value.trim();
                // Create the actual new to-do
                if (todo) {
                    let listName = this.parentNode.querySelector("h4").innerHTML;
                    addNewTodo(listName, todo, ul);
                    this.value = "";
                }
            }
        });
    }

    // List Buttons Listeners
    function listButtonsListeners(removeTodo, doneTodo, timerTodo) {

        //* Remove ToDo Listener
        removeTodo.forEach(function (elem) {
            elem.addEventListener("click", function () {
                let todo = this.closest('li');
                // Inner Text
                let todoText = todo.querySelector("span").innerText;
                let listName = this.closest("ul").parentNode.querySelector("h4").innerText;

                todo.parentNode.remove();
                // Delete from the localStorage
                deleteTodoFromList(listName, todoText);
                localStorage.setItem("lists", JSON.stringify(lists));
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
                let listName = this.closest("ul").parentNode.querySelector("h4").innerText;
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
                // Delete Todo from the localStorage
                deleteTodoFromList(listName, todoText);
                localStorage.setItem("lists", JSON.stringify(lists));
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
                let listName = this.closest("div").querySelector("h4").innerText;
                elem.closest(".container").remove();

                // Delete List from the localStorage
                for (let i = 0; i < lists.length; i++) {
                    if (lists[i].name == listName) {
                        lists.splice(i, 1);
                        break;
                    }
                }
                localStorage.setItem("lists", JSON.stringify(lists));
            })
        });
    }

    // Hovering Li's to display all buttons
    function displayButtonsOnHover(li) {
        li.forEach(function (elem) {
            let div = elem.querySelector('.icon-container');
            let span = elem.querySelector('span');

            div.style.height = `${elem.offsetHeight - 13.5}px`;
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
        if (hasAlreadyList(listName)) {
            alert("Can't have repeated lists");
            return;
        }
        let div = document.createElement("div");
        let divHeading = document.createElement("div");
        let ul = document.createElement("ul");
        let inputTodo = document.createElement("input");
        let id = getColumnID();

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
        div.appendChild(ul);

        document.getElementById(id).appendChild(div);

        let deleteList = document.querySelectorAll(".remove");
        addRemoveListListener(deleteList);

        // Add list to localStorage
        let newList = new List(listName);
        lists.push(newList);
        localStorage.setItem("lists", JSON.stringify(lists));
        // There's need to return the ul because of addNewTodo
        return ul;
    }

    function addNewTodo(listName, todo, ul) {
        let div = document.createElement("div");
        let newTodo = document.createElement("li");
        let list = listName

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

        let allDivs = ul.closest('div');
        if (!insertBeforeFinished(div, allDivs, ul)) {
            ul.append(div);
        }

        //! Need to get the nodes via querySelectorAll() to get an nodeList
        let removeTodo = div.childNodes[0].querySelectorAll(".garbage");
        let doneTodo = div.childNodes[0].querySelectorAll(".checked");
        let timerTodo = div.childNodes[0].querySelectorAll(".timer");

        // Add event listeners
        listButtonsListeners(removeTodo, doneTodo, timerTodo);
        displayButtonsOnHover(new Array(newTodo));

        // Add to local Storage
        addTodoToList(list, todo)
        localStorage.setItem("lists", JSON.stringify(lists));
    }

    function localStorageSetup() {
        // Initial Listeners
        addNewListListener()
        let lists = JSON.parse(localStorage.getItem("lists"))
        for (let i = 0; i < lists.length; i++) {
            let todos = lists[i].todos
            let listName = lists[i].name;
            // Add the new list
            let ul = addNewList(listName);
            for (let i = 0; i < todos.length; i++) {
                let todo = todos[i];
                addNewTodo(listName, todo, ul);
            }

        }

    }

    function addTodoToList(listName, todo) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name == listName) {
                lists[i].addTodo(todo)
                break;
            }
        }
    }

    function deleteTodoFromList(listName, todo) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name == listName) {
                lists[i].deleteTodo(todo);
                break;
            }
        }
    }

    function hasAlreadyList(listName) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name === listName) {
                return true;
            }
        }
        return false;
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

    function firstListExample() {
        return `
        <div class="container mt-5 text-center list-display">
                        <div class="heading-todo">
                            <img class="remove mb-2" src="icons/remove.png" alt="">
                            <div class="container-header">
                                <h4>Todo-List</h4>
                            </div>

                        </div>

                        <input class="input-todo text-center" type="text" placeholder="Enter a new task...">
                        <ul>
                            <div>
                                <li class="todo-background">
                                    <span>Thing to do 1</span>
                                    <div class="icon-container hidden">
                                        <div><img class="timer" src="icons/hourglass.png" alt=""></div>
                                        <div><img class="checked" src="icons/checked.png" alt=""></div>
                                        <div><img class="garbage" src="icons/garbage.png" alt=""></div>
                                    </div>

                                </li>
                            </div>
                        </ul>
                    </div>
        `

    }

});
