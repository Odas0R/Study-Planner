
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
    let lists = document.getElementById("all-lists");

    lists.insertBefore(draggedElement, draggedToElement);


}