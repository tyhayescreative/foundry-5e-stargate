class ToDoList {
 /**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - The text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */
 
  static ID = 'todo-list';
  
  static MODULE_ID = 'sgp-tyhayescreative';
  
  static FLAGS = {
    TODOS: 'todos'
  }
  
  static TEMPLATES = {
    TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`
  }
 
  static log(force, ...args) {  
    const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, '|', ...args);
    }
  }
}


class ToDoListData {
	
  static getToDosForUser(userId) {
	return game.users.get(userId)?.getFlag(ToDoList.MODULE_ID, ToDoList.FLAGS.TODOS);
  }
  
  static get allToDos() {
    const allToDos = game.users.reduce((accumulator, user) => {
      const userTodos = this.getToDosForUser(user.id);

      return {
        ...accumulator,
        ...userTodos
      }
    }, {});

    return allToDos;
  }
  
  static createToDo(userId, toDoData) {
    // generate a random id for this new ToDo and populate the userId
    const newToDo = {
      isDone: false,
      ...toDoData,
      id: foundry.utils.randomID(16),
      userId,
    }

    // construct the update to insert the new ToDo
    const newToDos = {
      [newToDo.id]: newToDo
    }

    // update the database with the new ToDos
    return game.users.get(userId)?.setFlag(ToDoList.MODULE_ID, ToDoList.FLAGS.TODOS, newToDos);
  }

  static updateToDo(toDoId, updateData) {
    const relevantToDo = this.allToDos[toDoId];

    // construct the update to send
    const update = {
      [toDoId]: updateData
    }

    // update the database with the updated ToDo list
    return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.MODULE_ID, ToDoList.FLAGS.TODOS, update);
  }
  
  static updateUserToDos(userId, updateData) {
	/* usage
	ToDoListData.updateUserToDos(game.userId, {
		"gogdv4qvgydcr7sh": { isDone: true },
		"yndgcuoq147g37nz": { isDone: true },
	});
	
	*/
    return game.users.get(userId)?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, updateData);
  }
  
  static deleteToDo(toDoId) {
    const relevantToDo = this.allToDos[toDoId];

    // Foundry specific syntax required to delete a key from a persisted object in the database
    const keyDeletion = {
      [`-=${toDoId}`]: null
    }

    // update the database with the updated ToDo list
    return game.users.get(relevantToDo.userId)?.setFlag(ToDoList.MODULE_ID, ToDoList.FLAGS.TODOS, keyDeletion);
  }
}


/**
 * Register our module's debug flag with developer mode's custom hook
 */
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(ToDoList.ID);
});