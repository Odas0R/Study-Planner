export default class List {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todoName) {
        this.todos.push(todoName);
    }

    deleteTodo(todoName) {
        let index = this.todos.indexOf(todoName)
        if (index > -1) {
            this.todos.splice(index, 1);
        }
    }
}
