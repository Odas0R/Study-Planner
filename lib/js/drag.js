
let allowDrop = (e) => {
    e.preventDefault();
}

let dragList = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
}

let dropList = (e) => {
    let draggedElementId = e.dataTransfer.getData("text/plain");
    let draggedToElement = e.target.closest(".list");
    let draggedElement = document.getElementById(draggedElementId);
    let listsDiv = document.getElementById("all-lists");

    listsDiv.insertBefore(draggedElement, draggedToElement);
    sortListsOnLocalStorage()

}

function sortListsOnLocalStorage() {
    let listsNameByOrder = document.getElementById("all-lists").querySelectorAll("h4");
    let lists = JSON.parse(localStorage.getItem("lists"));
    let newArrOfLists = [];

    listsNameByOrder.forEach(h4 => {
        lists.map(list => {
            if(list.name === h4.textContent) {
                newArrOfLists.push(list);
            }
        })
    })
    localStorage.setItem("lists", JSON.stringify(newArrOfLists));
}
