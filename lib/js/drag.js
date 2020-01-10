
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

let dropTodo = async (e) => {
    let draggedElementId = e.dataTransfer.getData("text/plain");
    let draggedElement = document.getElementById(draggedElementId);
    let draggedToList = e.target.closest(".list");
    let draggedToElement = e.target.closest(".todo-div");
    let ul = draggedToList.querySelector("ul")
    if(!draggedToElement) {
        
        let firstDoneTodo = ul.querySelectorAll(".todo-reset")[0];
        if(firstDoneTodo) {
            firstDoneTodo = firstDoneTodo.closest("div")
            await ul.insertBefore(draggedElement, firstDoneTodo)
        }
        
        return;
    }
    let liOfDraggedToElement = draggedToElement.querySelector("li");
    if (!liOfDraggedToElement.classList.contains("todo-reset")) {

            if (ul.firstElementChild === draggedToElement) {
                await ul.insertBefore(draggedElement, draggedToElement);
            } else if(ul.lastChild === draggedToElement) {
                await ul.append(draggedElement);
            } else {
                let indexOfDragged = getIndexOfElementInList(ul, draggedElement);
                let indexOfDraggedTo = getIndexOfElementInList(ul, draggedToElement);

                if(indexOfDragged < indexOfDraggedTo) {
                   await ul.insertBefore(draggedElement, draggedToElement.nextSibling);
                } else {
                   await ul.insertBefore(draggedElement, draggedToElement);
                }
            }
        disableHoverTodos(false);
        sortTodosOnLocalStorage();
    }
}

function getIndexOfElementInList(ul, element) {
    let aux = ul.firstElementChild;
    let index = 0;
    while(aux !== null) {
        if(aux === element)
            return index
        aux = aux.nextSibling;
        index++;
    }
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
        spans.forEach(span => {
            if(!span.classList.contains("done-todo"))
                todos.push(span.textContent)
        });
        let listName = listDiv.querySelector("h4").textContent;
        lists.map(list => {
            if (list.name === listName) {
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
