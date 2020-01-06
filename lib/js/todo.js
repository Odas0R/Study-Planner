import { pomodoroTimer } from './pomodoro.js'
import List from './list.js'

document.addEventListener("DOMContentLoaded", () => {

    let lists = [];
    let randomId = 0;

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
        document.getElementById("all-lists").innerHTML = firstListExample();
        const removeTodo = document.querySelectorAll(".garbage");
        const doneTodo = document.querySelectorAll(".checked");
        const timerTodo = document.querySelectorAll(".timer");
        const removeListButton = document.querySelectorAll(".remove");
        const li = document.querySelectorAll("li")[0];
        const spanHeight = li.querySelector("span").offsetHeight;
        const addTodo = document.querySelector(".input-todo"); // Get the input of the first To-Do List
        const firstListName = "Todo-List";
        const firstList = new List(firstListName);
        firstList.addTodo("Thing to do 1");
        lists.push(firstList);
        localStorage.setItem("lists", JSON.stringify(lists));


        // Event Listener to add Todos in the first list
        addTodoListener(addTodo);
        listButtonsListeners(removeTodo, doneTodo, timerTodo, removeListButton);
        fixTodoHeight(li, spanHeight);
        addRemoveListListener(removeListButton);
        addNewListListener();
        editTodoOnDbClick(li, firstListName);
    }

    // Add a new List EventListener
    function addNewListListener() {
        const addListInput = document.getElementById("addlist-input")
        const addListButton = document.getElementById("addlist-button");
        const addListInputMobile = document.getElementById("mobile-input");
        const addListButtonMobile = document.getElementById("mobile-input-button");

        addListButton.addEventListener("click", () => {
            let listName = addListInput.value.trim();
            if (listName) {
                addNewList(listName);
                addListInput.value = '';
            }
        });

        addListButtonMobile.addEventListener("click", () => {
            let listName = addListInputMobile.value.trim();
            if (listName) {
                addNewList(listName);
                addListInputMobile.value = '';
            }
        });

        addListInputMobile.addEventListener("keypress", (e) => {
            let listName = addListInputMobile.value.trim();
            let key = e.which;
            if (key === 13 && listName) {
                addNewList(listName);
                addListInputMobile.value = '';
                e.preventDefault();
            }
        })

        addListInput.addEventListener("keypress", (e) => {
            let listName = addListInput.value.trim();
            let key = e.which;
            if (key === 13 && listName) {
                addNewList(listName);
                addListInput.value = '';
                e.preventDefault();
            }
        });
    }

    function addTodoListener(inputTodo) {
        // Add new todo listener
        inputTodo.addEventListener("keypress", (e) => {
            // Get the ul below the input to add the todo's
            let ul = inputTodo.parentNode.querySelector("ul");
            // this.value == input value
            let todo = inputTodo.value.trim();
            // Get the key code (Enter key == 13)
            let key = e.which;
            if (key === 13 && todo) {
                let listName = inputTodo.parentNode.querySelector("h4").innerHTML;
                addNewTodo(listName, todo, ul);
                inputTodo.value = "";
            }
        });
    }

    // List Buttons Listeners
    function listButtonsListeners(removeTodo, doneTodo, timerTodo) {

        //* Remove ToDo Listener
        removeTodo.forEach(elem => {
            elem.addEventListener("click", () => {
                let todo = elem.closest('li');
                // Inner Text
                let todoText = todo.querySelector("span").innerText;
                let listName = elem.closest("ul").parentNode.querySelector("h4").innerText;

                todo.parentNode.remove();
                // Delete from the localStorage
                deleteTodoFromList(listName, todoText);
                localStorage.setItem("lists", JSON.stringify(lists));
            });
        });

        // Done ToDo Listener
        doneTodo.forEach(elem => {
            elem.addEventListener("click", () => {
                let todoLi = elem.closest('li');
                let listName = elem.closest("ul").parentNode.querySelector("h4").innerText;
                let todoText = todoLi.querySelector("span").innerText;

                setTodoDoneDisplay(todoLi, todoText);
                setTodoAsDone(listName, todoText);
                localStorage.setItem("lists", JSON.stringify(lists));
            });
        });

        // Timer ToDo Listener
        timerTodo.forEach(elem => {

            elem.addEventListener('click', () => {
                let task = elem.closest('li').querySelector('span').innerText;
                let audio1 = new Audio('audio/audio1.mp3');
                let audio2 = new Audio('audio/audio2.mp3');
                let audio3 = new Audio('audio/audio3.mp3');
                let audios = [audio1, audio2, audio3];
                audios.map(audio => audio.volume = 0.5);
                pomodoroTimer(task, audios);
            })
        });
    }

    // Remove List Listener
    function addRemoveListListener(removeListButton) {
        removeListButton.forEach(elem => {
            elem.addEventListener("click", () => {
                let listName = elem.closest("div").querySelector("h4").innerText;
                elem.closest(".list").remove();

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
        let listID = `list${randomId++}`;

        div.setAttribute("draggable", "true");
        div.setAttribute("ondragstart", "dragList(event)");
        div.id = listID;
        div.className = "list";
        ul.className = "todos"
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

        document.getElementById("all-lists").appendChild(div);

        let deleteList = document.querySelectorAll(".remove");
        addRemoveListListener(deleteList);

        // Add list to localStorage
        let newList = new List(listName);
        lists.push(newList);
        if (!localStorageContainsList(listName))
            localStorage.setItem("lists", JSON.stringify(lists));
        // There's need to return the ul because of addNewTodo
        return ul;
    }

    function addNewTodo(listName, todo, ul) {
        let div = document.createElement("div");
        let newTodo = document.createElement("li");

        newTodo.classList.add("todo-background");
        newTodo.innerHTML = `
                    <span>${todo}</span>
                    <div class="icon-container">
                        <div><img class="timer" src="icons/hourglass.png" alt=""></i></div>
                        <div><img class="checked" src="icons/checked.png" alt=""></i></div>
                        <div><img class="garbage" src="icons/garbage.png" alt=""></i></div>
                    </div>
                `;
        div.append(newTodo);
        div.setAttribute("class", "todo-div");


        insertBeforeDoneTodo(div, ul);

        //! Need to get the nodes via querySelectorAll() to get an nodeList
        let removeTodo = div.childNodes[0].querySelectorAll(".garbage");
        let doneTodo = div.childNodes[0].querySelectorAll(".checked");
        let timerTodo = div.childNodes[0].querySelectorAll(".timer");

        // Get the spanHeight to fix the todo background height
        let spanHeight = newTodo.querySelector("span").offsetHeight;

        // Add event listeners
        listButtonsListeners(removeTodo, doneTodo, timerTodo);
        fixTodoHeight(newTodo, spanHeight);
        editTodoOnDbClick(newTodo, listName);

        // Add to local Storage
        addTodoToList(listName, todo)
        if (localStorageContainsList(listName) && !localStorageContainsTodo(listName, todo))
            localStorage.setItem("lists", JSON.stringify(lists));
        return newTodo;
    }

    // This is used to fix the Li's height on hover (todo-background)
    function fixTodoHeight(li, spanHeight) {
        let div = li.querySelector('.icon-container');
        div.style.height = `${spanHeight}px`;

    }

    function draggableTodoListener() {

    }

    function editTodoOnDbClick(li, listName) {
        let span = li.querySelector("span");
        let list = li.closest(".list");
        let spanHeight;
        let oldTodo = span.innerText;

        li.addEventListener("dblclick", () => {
            if (!li.classList.contains("todo-reset")) {
                list.removeAttribute("draggable");
                li.classList.remove("todo-background");
                li.classList.add("todo-background-onEdit");
                span.setAttribute("contentEditable", "true");
                span.setAttribute("spellcheck", "false");
                // check for the updated height
                span.addEventListener("input", () => {
                    spanHeight = span.offsetHeight;
                })
            }

            span.addEventListener("keypress", (e) => {
                if (e.which === 13 && !li.classList.contains("todo-reset")) {
                    list.setAttribute("draggable", "true");
                    li.classList.remove("todo-background-onEdit");
                    li.classList.add("todo-background");
                    span.innerText = span.innerText.trim();
                    if (!span.innerText) {
                        li.closest(".todo-div").remove();
                        deleteTodoFromList(listName, oldTodo)
                        localStorage.setItem("lists", JSON.stringify(lists));
                    }
                    span.blur();
                    let newTodo = span.innerText;
                    updateTodoLocalStorage(listName, oldTodo, newTodo);
                    fixTodoHeight(li, spanHeight);
                }
            })
        });
    }

    function setTodoDoneDisplay(todoLi, todoText) {

        let garbageIcon = todoLi.querySelector(".garbage");
        // Reset Todo
        todoLi.innerHTML = `
         <div class="removed-todo">
             <span class="done-todo">${todoText}</span >
         </div>`;
        todoLi.querySelector(".removed-todo").appendChild(garbageIcon);

        // Reset Css
        todoLi.classList.remove("todo-background");
        todoLi.classList.add("todo-reset");

        // Append at the last pos in the ul
        let ul = todoLi.closest("ul");
        let div = todoLi.parentNode;

        // Remove the actual div
        div.remove();
        // Put the li in the final of the ul
        ul.appendChild(div);
    }

    /**   
     ** Returns true if it was added a new todo after a ".done-todo" span inside the todo div
     *
     * @param {Node} div - The todo that's beeing added
     * @param {Node} closestDiv - All the todos in the ul
     * @param {Node} ul - The ul that contains all the todos
     * @returns true if it was added before the done-todo div, false if contratry
     */
    function insertBeforeDoneTodo(div, ul) {
        const allTodos = ul.querySelectorAll(".todo-div");
        let hasDoneTodo = false;
        for (let i = 0; i < allTodos.length; i++) {
            let span = allTodos[i].querySelector("span")
            if (span.classList.contains("done-todo")) {
                ul.insertBefore(div, allTodos[i]);
                hasDoneTodo = true;
                break;
            }
        }
        if (!hasDoneTodo)
            ul.appendChild(div);
    }

    function localStorageSetup() {
        // Initial Listeners
        addNewListListener()
        let lists = JSON.parse(localStorage.getItem("lists"))
        for (let i = 0; i < lists.length; i++) {
            let todos = lists[i].todos;
            let doneTodos = lists[i].doneTodos;
            let listName = lists[i].name;
            // Add the new list
            let ul = addNewList(listName);
            // Add non-done todos
            for (let i = 0; i < todos.length; i++) {
                let todo = todos[i];
                addNewTodo(listName, todo, ul);
            }
            // Add done todos
            for (let i = 0; i < doneTodos.length; i++) {
                let todo = doneTodos[i];
                let todoLi = addNewTodo(listName, todo, ul);
                setTodoAsDone(listName, todo);
                setTodoDoneDisplay(todoLi, todo);
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

    function setTodoAsDone(listName, todo) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name == listName) {
                lists[i].doneTodo(todo)
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

    function localStorageContainsList(listName) {
        let lists = JSON.parse(localStorage.getItem("lists"))
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name === listName)
                return true;
        }
        return false;
    }

    function localStorageContainsTodo(listName, todo) {
        let lists = JSON.parse(localStorage.getItem("lists"))
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name === listName) {
                let allTodos = lists[i].todos.concat(lists[i].doneTodos);
                for (let i = 0; i < allTodos.length; i++) {
                    if (allTodos[i] === todo)
                        return true;
                }
            }

        }
        return false;
    }

    function updateTodoLocalStorage(listName, oldTodo, newTodo) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].name === listName) {
                // Update the new Todo
                lists[i].updateTodo(oldTodo, newTodo);
                // Add to LocalStorage
                localStorage.setItem("lists", JSON.stringify(lists));
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

    function firstListExample() {
        return `
        <div class="list">
                <div class="heading-todo">
                    <img class="remove mb-2" src="icons/remove.png" alt="">
                    <div class="container-header">
                        <h4>Daily Todo List</h4>
                    </div>

                </div>

                <input class="input-todo text-center" type="text" placeholder="Enter a new task...">
                <ul class="todos">
                    <div class="todo-div">
                        <li class="todo-background">
                            <span>Thing to do 1</span>
                            <div class="icon-container">
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

}, true);