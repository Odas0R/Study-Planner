export default class List {
    constructor(name) {
        this.name = name;
        this.todos = [];
        this.doneTodos = [];
    }

    addTodo(todoName) {
        this.todos.push(todoName);
    }

    doneTodo(todoName) {
        this.deleteTodo(todoName);
        this.doneTodos.push(todoName);
    }

    deleteTodo(todoName) {
        let i = this.todos.indexOf(todoName)
        let j = this.doneTodos.indexOf(todoName)
        if (i > -1)
            this.todos.splice(i, 1);
        else if (j > -1)
            this.doneTodos.splice(j, 1);
    }

    updateTodo(oldTodo, newTodo) {
        let index = this.todos.indexOf(oldTodo);
        this.todos[index] = newTodo;
    }
}
