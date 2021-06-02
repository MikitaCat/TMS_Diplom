export const addTasks = (data) => {
    const { tasks, type } = data;
    console.log('tasks ', tasks);
    return {
        type: `ADD_NEW_TASKS_${type}`,
        payload: tasks
    }
}

export const createTask = (data) => {
    const { _id, name, type } = data.payload;
    return {
        type: `ADD_NEW_TASK_${data.type}`,
        payload: { _id, name, type, }
    }
}

export const checkTask = (data) => {
    const { name, type, checked } = data.payload;
    return {
        type: `CHECK_TASK_${data.type}`,
        payload: { name, type, checked }
    }
}

export const removeTask = (data) => {
    const { name, type } = data.payload;
    return {
        type: `REMOVE_TASK_${data.type}`,
        payload: { name, type }
    }
}

export const editTask = (data) => {
    const { name, type, editName } = data.payload;
    return {
        type: `EDIT_TASK_${data.type}`,
        payload: { name, type, editName }
    }
}
