export const initialState = {
    tasks: {
        unImportant: [],
        important: [],
        veryImportant: []
    },
};

export const taskReducer = (state = initialState, action) => {

    let newUnImportantTaskList;
    let newImportantTaskList;
    let newVeryImportantTaskList;

    const { type } = action;

    switch (type) {
        case 'ADD_NEW_TASKS_UNIMPORTANT':
            return { ...state, tasks: { ...state.tasks, unImportant: action.payload } };

        case 'ADD_NEW_TASKS_IMPORTANT':
            return { ...state, tasks: { ...state.tasks, important: action.payload } };

        case 'ADD_NEW_TASKS_VERYIMPORTANT':
            return { ...state, tasks: { ...state.tasks, veryImportant: action.payload } };

        case 'ADD_NEW_TASK_UNIMPORTANT':
            const newUnImportantTask = { _id: action.payload._id, name: action.payload.name, checked: false };
            newUnImportantTaskList = state.tasks.unImportant.concat(newUnImportantTask);

            return { ...state, tasks: { ...state.tasks, unImportant: newUnImportantTaskList } };

        case 'ADD_NEW_TASK_IMPORTANT':
            const newImportantTask = { _id: action.payload._id, name: action.payload.name, checked: false };
            newImportantTaskList = state.tasks.important.concat(newImportantTask);

            return { ...state, tasks: { ...state.tasks, important: newImportantTaskList } };

        case 'ADD_NEW_TASK_VERYIMPORTANT':
            const newVeryImportantTask = { _id: action.payload._id, name: action.payload.name, checked: false };
            newVeryImportantTaskList = state.tasks.veryImportant.concat(newVeryImportantTask);

            return { ...state, tasks: { ...state.tasks, veryImportant: newVeryImportantTaskList } };

        case 'CHECK_TASK_UNIMPORTANT':
            newUnImportantTaskList = checkTask([...state.tasks.unImportant], action.payload);
            return { ...state, tasks: { ...state.tasks, unImportant: newUnImportantTaskList } };

        case 'CHECK_TASK_IMPORTANT':
            newImportantTaskList = checkTask([...state.tasks.important], action.payload);
            return { ...state, tasks: { ...state.tasks, important: newImportantTaskList } };

        case 'CHECK_TASK_VERYIMPORTANT':
            newVeryImportantTaskList = checkTask([...state.tasks.veryImportant], action.payload);
            return { ...state, tasks: { ...state.tasks, veryImportant: newVeryImportantTaskList } };

        case 'REMOVE_TASK_UNIMPORTANT':
            newUnImportantTaskList = removeTask([...state.tasks.unImportant], action.payload);
            return { ...state, tasks: { ...state.tasks, unImportant: newUnImportantTaskList } };

        case 'REMOVE_TASK_IMPORTANT':
            newImportantTaskList = removeTask([...state.tasks.important], action.payload);
            return { ...state, tasks: { ...state.tasks, important: newImportantTaskList } };

        case 'REMOVE_TASK_VERYIMPORTANT':
            newVeryImportantTaskList = removeTask([...state.tasks.veryImportant], action.payload);
            return { ...state, tasks: { ...state.tasks, veryImportant: newVeryImportantTaskList } };

        case 'EDIT_TASK_UNIMPORTANT':
            newUnImportantTaskList = renameTask([...state.tasks.unImportant], action.payload);
            return { ...state, tasks: { ...state.tasks, unImportant: newUnImportantTaskList } };

        case 'EDIT_TASK_IMPORTANT':
            newImportantTaskList = renameTask([...state.tasks.important], action.payload);
            return { ...state, tasks: { ...state.tasks, important: newImportantTaskList } };

        case 'EDIT_TASK_VERYIMPORTANT':
            newVeryImportantTaskList = renameTask([...state.tasks.veryImportant], action.payload);
            return { ...state, tasks: { ...state.tasks, veryImportant: newVeryImportantTaskList } };

        default:
            return { ...state };
    }
}


const findTask = (tasks, payload) => {
    const taskIndex = tasks.findIndex(task => task.name === payload.name);
    return taskIndex;
}

const checkTask = (tasks, payload) => {
    const taskIndex = findTask(tasks, payload);
    tasks[taskIndex].checked = payload.checked;
    return tasks;
}

const removeTask = (tasks, payload) => {
    const taskIndex = findTask(tasks, payload);
    tasks.splice(taskIndex, 1);
    return tasks;
}

const renameTask = (tasks, payload) => {
    const taskIndex = findTask(tasks, payload);
    tasks[taskIndex].name = payload.editName;
    return tasks;
}
