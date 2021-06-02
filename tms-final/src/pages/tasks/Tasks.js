import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Context from '../../context/Context';
import { TaskList } from '../../components';
import { addTasks, createTask, checkTask, removeTask, editTask, } from '../../redux/actions/taskActions';
import './Tasks.scss';


export const TasksPage = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const tasksState = useSelector(state => state.taskReducer);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('isAdmin'))) {
            axios.get('http://localhost:8080/users/userId', {
                headers: { 'token': localStorage.getItem('token') }
            })
                .then(res => {
                    if (res.status === 200) {
                        setUserId(res.data);
                        getTasksRequest(res.data);
                    }
                })
                .catch(err => {
                    console.error(err);
                    if (err.response.status === 401) {
                        history.push('/login');
                    }
                })
        } else {
            const id = history.location.pathname.split('/')[2];
            setUserId(id);
            getTasksRequest(id);
        }

    }, []);

    const getTasksRequest = (userId) => {
        axios.get(`http://localhost:8080/tasks/${userId}`, {
            headers: { 'token': localStorage.getItem('token') }
        })
            .then(res => {
                const { data } = res;
                const notImportantTasks = filterTasks(data, "unImportant");
                const importantTasks = filterTasks(data, "important");
                const veryImportantTasks = filterTasks(data, "veryImportant");

                dispatch(addTasks({ tasks: notImportantTasks, type: 'UNIMPORTANT' }));
                dispatch(addTasks({ tasks: importantTasks, type: 'IMPORTANT' }));
                dispatch(addTasks({ tasks: veryImportantTasks, type: 'VERYIMPORTANT' }));
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) {
                    history.push('/login');
                }
            })
    }


    const filterTasks = (tasks, type) => {
        return tasks.filter(task => task.type === type);
    }


    const addNewTask = (name, type) => {
        const tasksCopy = { ...tasksState.tasks };
        const { unImportant, important, veryImportant } = tasksCopy;

        const allTasks = unImportant.concat(important, veryImportant);


        if (checkDublicates(allTasks, name)) {
            axios.post(`http://localhost:8080/tasks/${userId}`,
                {
                    checked: false,
                    name,
                    type
                },
                {
                    headers: { 'token': localStorage.getItem('token') }
                })
                .then(res => {
                    if (res.status === 200) {
                        dispatch(createTask({ type: type.toUpperCase(), payload: { _id: res.data._id, name, type } }));
                    }
                })
                .catch(err => {
                    console.error(err);
                    if (err.response.status === 401) {
                        history.push('/login');
                    }
                })
            return true;
        } else {
            return false;
        }
    }

    const handleRemoveTask = (id, name, type) => {
        axios.delete(`http://localhost:8080/tasks/${userId}/${id}`,
            {
                headers: { 'token': localStorage.getItem('token') }
            })
            .then(res => {
                if (res.status === 204) {
                    dispatch(removeTask({ type: type.toUpperCase(), payload: { name, type } }));
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) {
                    history.push('/login');
                }
            })
    }

    const checkDublicates = (tasks, name) => {
        const index = tasks.findIndex(task => task.name.trim() === name.trim());
        return index === -1;
    }

    const handleCheckTask = (id, type, name, checked) => {
        editTaskRequest(id, type, name, checked, userId, 'check');
    }

    const handleEditTask = (id, type, name, editName, checked) => {
        const tasksCopy = { ...tasksState.tasks };
        const { unImportant, important, veryImportant } = tasksCopy;

        const allTasks = unImportant.concat(important, veryImportant);
        const taskIndex = allTasks.findIndex(task => task.name === name);

        allTasks.splice(taskIndex, 1);

        if (checkDublicates(allTasks, editName)) {
            editTaskRequest(id, type, editName, checked, userId, 'rename', name);
            return true;
        } else {
            return false;
        }
    }

    const editTaskRequest = (id, type, name, checked, userId, editType, oldName = '') => {
        axios.put(`http://localhost:8080/tasks/${userId}`,
            {
                id,
                checked,
                name,
                type
            },
            {
                headers: { 'token': localStorage.getItem('token') }
            })
            .then(res => {
                if (res.status === 204) {
                    editType === 'check' ?
                        dispatch(checkTask({ type: type.toUpperCase(), payload: { name, type, checked } })) :
                        dispatch(editTask({ type: type.toUpperCase(), payload: { editName: name, name: oldName, type } }));
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 401) {
                    history.push('/login');
                }
            })
    }

    const contextValue = { handleCheckTask, handleRemoveTask, handleEditTask }

    return (
        <Context.Provider value={contextValue}>
            <div className='tasks'>

                <div className='tasks-header'>
                    Tasks Planer:
                </div>

                <div className='tasks-main'>
                    <div className='tasks-main-col'>
                        <div className='tasks-main-col-unImportant'>
                            Unimportant Tasks:
                        </div>

                        <TaskList tasksType='unImportant'
                            tasks={tasksState.tasks.unImportant}
                            addNewTask={addNewTask} />
                    </div>

                    <div className='tasks-main-col'>
                        <div className='tasks-main-col-important'>
                            Important Tasks:
                        </div>

                        <TaskList tasksType='important'
                            tasks={tasksState.tasks.important}
                            addNewTask={addNewTask} />
                    </div>

                    <div className='tasks-main-col'>
                        <div className='tasks-main-col-veryImportant'>
                            Very Important Tasks:
                        </div>

                        <TaskList tasksType='veryImportant'
                            tasks={tasksState.tasks.veryImportant}
                            addNewTask={addNewTask} />
                    </div>
                </div>

            </div>
        </Context.Provider>
    );
}
