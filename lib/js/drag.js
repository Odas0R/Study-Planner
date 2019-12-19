
let allowDrop = (e) => {
    e.preventDefault();
}

let dragList = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
}

let dropList = (e) => {
    let draggedElementId = e.dataTransfer.getData("text/plain");
    let draggedToElement = e.target;
    let column = draggedToElement.closest(".col-lg-4.col-md-6.col-sm-6");
    switch (column.id) {
        case "col1":
            column.appendChild(document.getElementById(draggedElementId));
            break;
        case "col2":
            column.appendChild(document.getElementById(draggedElementId));
            break;
        case "col3":
            column.appendChild(document.getElementById(draggedElementId));
            break;
        default:
            break;
    }

}