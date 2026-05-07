import { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // --- Statuses ---
  const [statuses, setStatuses] = useState([]);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusForm, setStatusForm] = useState({ name: '', slug: '' });
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const saveStatus = (e) => {
    e.preventDefault();
    if (!statusForm.name || !statusForm.slug) return;
    if (editingStatus) {
      setStatuses(statuses.map((s) => s.id === editingStatus.id ? { id: editingStatus.id, name: statusForm.name, slug: statusForm.slug } : s));
    } else {
      setStatuses([...statuses, { id: Date.now(), name: statusForm.name, slug: statusForm.slug }]);
    }
    setShowStatusForm(false);
  };

  const deleteSelectedStatuses = () => {
    setStatuses(statuses.filter((s) => !selectedStatuses.includes(s.id)));
    setSelectedStatuses([]);
  };

  // --- Users ---
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '' });
  const [emailError, setEmailError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const saveUser = (e) => {
    e.preventDefault();
    if (!userForm.firstName || !userForm.lastName || !userForm.email || emailError) return;
    if (editingUser) {
      setUsers(users.map((u) => u.id === editingUser.id ? { id: editingUser.id, firstName: userForm.firstName, lastName: userForm.lastName, email: userForm.email } : u));
    } else {
      setUsers([...users, { id: Date.now(), firstName: userForm.firstName, lastName: userForm.lastName, email: userForm.email }]);
    }
    setShowUserForm(false);
  };

  const deleteSelectedUsers = () => {
    setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };

  // --- Labels ---
  const [labels, setLabels] = useState([]);
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelForm, setLabelForm] = useState({ name: '' });
  const [selectedLabels, setSelectedLabels] = useState([]);

  const saveLabel = (e) => {
    e.preventDefault();
    if (!labelForm.name) return;
    if (editingLabel) {
      setLabels(labels.map((l) => l.id === editingLabel.id ? { id: editingLabel.id, name: labelForm.name } : l));
    } else {
      setLabels([...labels, { id: Date.now(), name: labelForm.name }]);
    }
    setShowLabelForm(false);
  };

  const deleteSelectedLabels = () => {
    setLabels(labels.filter((l) => !selectedLabels.includes(l.id)));
    setSelectedLabels([]);
  };

  // --- Tasks ---
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignee: '', statusId: '', labelIds: [] });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filterStatusId, setFilterStatusId] = useState('');
  const [filterLabelId, setFilterLabelId] = useState('');

  const saveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title) return;
    if (editingTask) {
      const updated = {
        id: editingTask.id,
        title: taskForm.title,
        description: taskForm.description,
        assignee: taskForm.assignee,
        statusId: taskForm.statusId,
        labelIds: taskForm.labelIds,
      };
      setTasks(tasks.map((t) => t.id === editingTask.id ? updated : t));
    } else {
      const newTask = {
        id: Date.now(),
        title: taskForm.title,
        description: taskForm.description,
        assignee: taskForm.assignee,
        statusId: taskForm.statusId || (statuses.length > 0 ? statuses[0].id : ''),
        labelIds: taskForm.labelIds,
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskForm(false);
  };

  const deleteSelectedTasks = () => {
    setTasks(tasks.filter((t) => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatusId && String(t.statusId) !== String(filterStatusId)) return false;
    if (filterLabelId && !t.labelIds.some((lid) => String(lid) === String(filterLabelId))) return false;
    return true;
  });

  // --- Login page ---
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <h1>Канбан-доска</h1>
        <form onSubmit={handleLogin} data-testid="login-form">
          <h2>Вход</h2>
          <div>
            <label htmlFor="username">Логин:</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} data-testid="username-input" />
          </div>
          <div>
            <label htmlFor="password">Пароль:</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="password-input" />
          </div>
          <button type="submit" data-testid="login-button">Войти</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Канбан-доска</h1>
        <div className="user-info">
          <span data-testid="username-display">{username}</span>
          <button onClick={handleLogout} data-testid="logout-button">Выйти</button>
        </div>
      </header>

      <nav>
        <button onClick={() => setActiveTab('tasks')} data-testid="tab-tasks">Задачи</button>
        <button onClick={() => setActiveTab('statuses')} data-testid="tab-statuses">Статусы</button>
        <button onClick={() => setActiveTab('labels')} data-testid="tab-labels">Метки</button>
        <button onClick={() => setActiveTab('users')} data-testid="tab-users">Пользователи</button>
      </nav>

      <main>
        {/* TASKS */}
        {activeTab === 'tasks' && (
          <div>
            <h2>Задачи</h2>
            <button onClick={() => { setEditingTask(null); setTaskForm({ title: '', description: '', assignee: '', statusId: statuses[0]?.id || '', labelIds: [] }); setShowTaskForm(true); }} data-testid="create-task-button">Создать задачу</button>
            {selectedTasks.length > 0 && <button onClick={deleteSelectedTasks} data-testid="delete-tasks-selected-button">Удалить выбранных ({selectedTasks.length})</button>}

            <div className="filters">
              <label>Фильтр по статусу:</label>
              <select value={filterStatusId} onChange={(e) => setFilterStatusId(e.target.value)} data-testid="filter-status">
                <option value="">Все</option>
                {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <label>Фильтр по метке:</label>
              <select value={filterLabelId} onChange={(e) => setFilterLabelId(e.target.value)} data-testid="filter-label">
                <option value="">Все</option>
                {labels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>

            {showTaskForm && (
              <form onSubmit={saveTask} data-testid="task-form">
                <h3>{editingTask ? 'Редактировать' : 'Создать'} задачу</h3>
                <div><label>Название:</label><input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} data-testid="task-title-input" /></div>
                <div><label>Описание:</label><textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} data-testid="task-description-input" /></div>
                <div><label>Исполнитель:</label><input type="text" value={taskForm.assignee} onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })} data-testid="task-assignee-input" /></div>
                <div><label>Статус:</label><select value={taskForm.statusId} onChange={(e) => setTaskForm({ ...taskForm, statusId: e.target.value })} data-testid="task-status-select">
                  {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
                <button type="submit" data-testid="save-task-button">Сохранить</button>
                <button type="button" onClick={() => setShowTaskForm(false)} data-testid="cancel-task-button">Отмена</button>
              </form>
            )}

            <div className="kanban-board" data-testid="kanban-board">
              {statuses.map((status) => (
                <div key={status.id} className="kanban-column" data-testid={`column-${status.id}`}>
                  <h3>{status.name}</h3>
                  {filteredTasks.filter((t) => String(t.statusId) === String(status.id)).map((task) => (
                    <div key={task.id} className="task-card" data-testid={`task-card-${task.id}`}>
                      <input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => setSelectedTasks((prev) => prev.includes(task.id) ? prev.filter((x) => x !== task.id) : [...prev, task.id])} data-testid={`select-task-${task.id}`} />
                      <strong data-testid={`task-title-${task.id}`}>{task.title}</strong>
                      <p data-testid={`task-assignee-${task.id}`}>{task.assignee}</p>
                      <button onClick={() => { setEditingTask(task); setTaskForm({ title: task.title, description: task.description, assignee: task.assignee, statusId: task.statusId, labelIds: task.labelIds }); setShowTaskForm(true); }} data-testid={`edit-task-${task.id}`}>Редактировать</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATUSES */}
        {activeTab === 'statuses' && (
          <div>
            <h2>Статусы</h2>
            <button onClick={() => { setEditingStatus(null); setStatusForm({ name: '', slug: '' }); setShowStatusForm(true); }} data-testid="create-status-button">Создать статус</button>
            {selectedStatuses.length > 0 && <button onClick={deleteSelectedStatuses} data-testid="delete-statuses-selected-button">Удалить выбранных ({selectedStatuses.length})</button>}
            {showStatusForm && (
              <form onSubmit={saveStatus} data-testid="status-form">
                <h3>{editingStatus ? 'Редактировать' : 'Создать'} статус</h3>
                <div><label>Название:</label><input type="text" value={statusForm.name} onChange={(e) => setStatusForm({ ...statusForm, name: e.target.value })} data-testid="status-name-input" /></div>
                <div><label>Slug:</label><input type="text" value={statusForm.slug} onChange={(e) => setStatusForm({ ...statusForm, slug: e.target.value })} data-testid="status-slug-input" /></div>
                <button type="submit" data-testid="save-status-button">Сохранить</button>
                <button type="button" onClick={() => setShowStatusForm(false)} data-testid="cancel-status-button">Отмена</button>
              </form>
            )}
            <table data-testid="statuses-table"><thead><tr><th><input type="checkbox" checked={selectedStatuses.length === statuses.length && statuses.length > 0} onChange={() => setSelectedStatuses(selectedStatuses.length === statuses.length ? [] : statuses.map((s) => s.id))} data-testid="select-all-statuses-checkbox" /></th><th>Название</th><th>Slug</th><th>Действия</th></tr></thead>
              <tbody>{statuses.map((s) => (
                <tr key={s.id} data-testid={`status-row-${s.id}`}>
                  <td><input type="checkbox" checked={selectedStatuses.includes(s.id)} onChange={() => setSelectedStatuses((prev) => prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id])} data-testid={`select-status-${s.id}`} /></td>
                  <td data-testid={`status-name-${s.id}`}>{s.name}</td><td data-testid={`status-slug-${s.id}`}>{s.slug}</td>
                  <td><button onClick={() => { setEditingStatus(s); setStatusForm({ name: s.name, slug: s.slug }); setShowStatusForm(true); }} data-testid={`edit-status-${s.id}`}>Редактировать</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* LABELS */}
        {activeTab === 'labels' && (
          <div>
            <h2>Метки</h2>
            <button onClick={() => { setEditingLabel(null); setLabelForm({ name: '' }); setShowLabelForm(true); }} data-testid="create-label-button">Создать метку</button>
            {selectedLabels.length > 0 && <button onClick={deleteSelectedLabels} data-testid="delete-labels-selected-button">Удалить выбранных ({selectedLabels.length})</button>}
            {showLabelForm && (
              <form onSubmit={saveLabel} data-testid="label-form">
                <h3>{editingLabel ? 'Редактировать' : 'Создать'} метку</h3>
                <div><label>Название:</label><input type="text" value={labelForm.name} onChange={(e) => setLabelForm({ name: e.target.value })} data-testid="label-name-input" /></div>
                <button type="submit" data-testid="save-label-button">Сохранить</button>
                <button type="button" onClick={() => setShowLabelForm(false)} data-testid="cancel-label-button">Отмена</button>
              </form>
            )}
            <table data-testid="labels-table"><thead><tr><th><input type="checkbox" checked={selectedLabels.length === labels.length && labels.length > 0} onChange={() => setSelectedLabels(selectedLabels.length === labels.length ? [] : labels.map((l) => l.id))} data-testid="select-all-labels-checkbox" /></th><th>Название</th><th>Действия</th></tr></thead>
              <tbody>{labels.map((l) => (
                <tr key={l.id} data-testid={`label-row-${l.id}`}>
                  <td><input type="checkbox" checked={selectedLabels.includes(l.id)} onChange={() => setSelectedLabels((prev) => prev.includes(l.id) ? prev.filter((x) => x !== l.id) : [...prev, l.id])} data-testid={`select-label-${l.id}`} /></td>
                  <td data-testid={`label-name-${l.id}`}>{l.name}</td>
                  <td><button onClick={() => { setEditingLabel(l); setLabelForm({ name: l.name }); setShowLabelForm(true); }} data-testid={`edit-label-${l.id}`}>Редактировать</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <h2>Пользователи</h2>
            <button onClick={() => { setEditingUser(null); setUserForm({ firstName: '', lastName: '', email: '' }); setEmailError(''); setShowUserForm(true); }} data-testid="create-user-button">Создать пользователя</button>
            {selectedUsers.length > 0 && <button onClick={deleteSelectedUsers} data-testid="delete-selected-button">Удалить выбранных ({selectedUsers.length})</button>}
            {showUserForm && (
              <form onSubmit={saveUser} data-testid="user-form">
                <h3>{editingUser ? 'Редактировать' : 'Создать'} пользователя</h3>
                <div><label>Имя:</label><input type="text" value={userForm.firstName} onChange={(e) => { setUserForm({ ...userForm, firstName: e.target.value }); }} data-testid="user-firstname-input" /></div>
                <div><label>Фамилия:</label><input type="text" value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} data-testid="user-lastname-input" /></div>
                <div><label>Email:</label><input type="email" value={userForm.email} onChange={(e) => { setUserForm({ ...userForm, email: e.target.value }); setEmailError(e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) ? 'Некорректный email' : ''); }} data-testid="user-email-input" />{emailError && <span data-testid="email-error">{emailError}</span>}</div>
                <button type="submit" data-testid="save-user-button">Сохранить</button>
                <button type="button" onClick={() => setShowUserForm(false)} data-testid="cancel-user-button">Отмена</button>
              </form>
            )}
            <table data-testid="users-table"><thead><tr><th><input type="checkbox" checked={selectedUsers.length === users.length && users.length > 0} onChange={() => setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u.id))} data-testid="select-all-checkbox" /></th><th>Имя</th><th>Фамилия</th><th>Email</th><th>Действия</th></tr></thead>
              <tbody>{users.map((u) => (
                <tr key={u.id} data-testid={`user-row-${u.id}`}>
                  <td><input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => setSelectedUsers((prev) => prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id])} data-testid={`select-user-${u.id}`} /></td>
                  <td data-testid={`user-firstname-${u.id}`}>{u.firstName}</td><td data-testid={`user-lastname-${u.id}`}>{u.lastName}</td><td data-testid={`user-email-${u.id}`}>{u.email}</td>
                  <td><button onClick={() => { setEditingUser(u); setUserForm({ firstName: u.firstName, lastName: u.lastName, email: u.email }); setEmailError(''); setShowUserForm(true); }} data-testid={`edit-user-${u.id}`}>Редактировать</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;