
let allowDrop = (e) => {
    e.preventDefault();
}

let dragElement = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    disableHoverTodos(true);
}

let dropList = (e) => {
    let draggedElementId = e.dataTransfer.getData("text/plain");
    let draggedToElement = e.target.closest(".list");
    let draggedElement = document.getElementById(draggedElementId);
    let listsDiv = document.getElementById("all-lists");

    if (draggedElement && draggedElement.classList.contains("list")) {
        listsDiv.insertBefore(draggedElement, draggedToElement);
        sortListsOnLocalStorage()
    }

}

let dropTodo = (e) => {
    let draggedElementId = e.dataTransfer.getData("text/plain");
    let draggedToList = e.target.closest(".list");
    let draggedElement = document.getElementById(draggedElementId);
    let draggedToElement = e.target.closest(".todo-div");
    let ul = draggedToList.querySelector("ul")
    if (draggedToElement) {
        //TODO: Make this better
        if(ul.firstElementChild === draggedToElement) {
            ul.insertBefore(draggedElement, draggedToElement); 
        } else {
            ul.insertBefore(draggedToElement, draggedElement);
        }
    } else {
        ul.append(draggedElement);
    }
    disableHoverTodos(false);
    sortTodosOnLocalStorage();
}

function sortListsOnLocalStorage() {
    let listsNameByOrder = document.getElementById("all-lists").querySelectorAll("h4");
    let lists = JSON.parse(localStorage.getItem("lists"));
    let newArrOfLists = [];

    listsNameByOrder.forEach(h4 => {
        lists.map(list => {
            if (list.name === h4.textContent) {
                newArrOfLists.push(list);
            }
        })
    })
    localStorage.setItem("lists", JSON.stringify(newArrOfLists));
}

function sortTodosOnLocalStorage() {
    let allLists = document.querySelectorAll(".list");
    let lists = JSON.parse(localStorage.getItem("lists"));
    // Clean todos
    lists.map(list => list.todos = [])
    allLists.forEach(listDiv => {
        let spans = listDiv.querySelectorAll("span")
        let todos = [];
        spans.forEach(span => todos.push(span.textContent));
        let listName = listDiv.querySelector("h4").textContent;
        lists.map(list => {
            if(list.name === listName) {
                list.todos.push(...todos);
            }
        })
    })
    localStorage.setItem("lists", JSON.stringify(lists));
}

function disableHoverTodos(choice) {
    if (choice) {
        let allLis = document.querySelectorAll("li");
        allLis.forEach(li => {
            li.classList.remove("todo-background");
            li.classList.add("todo-background-onDrag")
        })
    } else {
        let allLis = document.querySelectorAll("li");
        allLis.forEach(li => {
            if (!li.classList.contains("todo-reset")) {
                li.classList.add("todo-background");
                li.classList.remove("todo-background-onDrag")
            }
        })
    }
}
