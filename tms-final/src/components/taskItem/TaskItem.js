import { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import Context from '../../context/Context';
import removeIcon from '../../images/removeIcon.png';
import editIcon from '../../images/editIcon.png';
import './TaskItem.scss';

export const TaskItem = ({ type, task }) => {

  const [editValue, setEditValue] = useState(task.name);
  const [dublicatEdit, setDublicateEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { handleCheckTask, handleRemoveTask, handleEditTask } = useContext(Context);

  const editInputEl = useRef(null);

  useEffect(() => {
    if (editMode) {
      editInputEl.current.focus();
    }
  }, [editMode]);

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '' && event.target.value.length < 20) {
      if (handleEditTask(task._id, type, task.name, editValue, task.checked))
        setEditMode(false);
    } else {
      setDublicateEdit(true);
    }
  }

  const handleEditInputChange = (event) => {
    if (dublicatEdit) {
      setDublicateEdit(false);
    }
    setEditValue(event.target.value);
  }

  return (
    <>
      {
        !editMode
          ?
          <div className='task-item'>
            <input type='checkbox'
              checked={task.checked}
              onChange={(event) => handleCheckTask(task._id, type, task.name, event.target.checked)} />

            <span className='task-item-name'>{task.name}</span>

            {
              task.checked
                ?
                (JSON.parse(localStorage.getItem('isAdmin')) ? <img className='remove-icon'
                  src={removeIcon}
                  onClick={() => handleRemoveTask(task._id, task.name, type)}
                  alt='removeIcon' /> : <></>
                )
                :
                <img className='edit-icon'
                  src={editIcon}
                  onClick={() => setEditMode(true)}
                  alt='editIcon' />
            }
          </div>
          :
          <div style={{ marginBottom: '30px' }}>
            <input type='text'
              ref={editInputEl}
              className='input-edit'
              value={editValue}
              placeholder='Введите новое название задачи...'
              onChange={handleEditInputChange}
              onKeyDown={handleEditKeyDown} />

            {
              dublicatEdit
              &&
              <span className='task-item-error'>Task with this name is already exist</span>
            }

            {
              editValue.length >= 20
              &&
              <span className='task-item-error'>Task name must have only 20 symbols</span>
            }
          </div>
      }
    </>
  );
}

TaskItem.propTypes = {
  type: PropTypes.string,
  task: PropTypes.object,
};
