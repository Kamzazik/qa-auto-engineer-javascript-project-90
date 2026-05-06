import { useState } from 'react';
import './App.css';

function App() {
  // --- Авторизация ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // --- Вкладки ---
  const [activeTab, setActiveTab] = useState('statuses');

  // --- Пользователи ---
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ firstName: '', lastName: '', email: '' });
  const [emailError, setEmailError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserFormChange = (field, value) => {
    setUserForm({ ...userForm, [field]: value });
    if (field === 'email') {
      setEmailError(value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Некорректный email' : '');
    }
  };

  const openCreateUserForm = () => {
    setEditingUser(null);
    setUserForm({ firstName: '', lastName: '', email: '' });
    setEmailError('');
    setShowUserForm(true);
  };

  const openEditUserForm = (user) => {
    setEditingUser(user);
    setUserForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    setEmailError('');
    setShowUserForm(true);
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (!userForm.firstName || !userForm.lastName || !userForm.email || emailError) return;
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...userForm } : u)));
    } else {
      setUsers([...users, { id: Date.now(), ...userForm }]);
    }
    setShowUserForm(false);
  };

  const deleteSelectedUsers = () => {
    setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) => prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]);
  };

  const selectAllUsers = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u.id));
  };

  // --- Статусы ---
  const [statuses, setStatuses] = useState([]);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusForm, setStatusForm] = useState({ name: '', slug: '' });
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const handleStatusFormChange = (field, value) => {
    setStatusForm({ ...statusForm, [field]: value });
  };

  const openCreateStatusForm = () => {
    setEditingStatus(null);
    setStatusForm({ name: '', slug: '' });
    setShowStatusForm(true);
  };

  const openEditStatusForm = (status) => {
    setEditingStatus(status);
    setStatusForm({ name: status.name, slug: status.slug });
    setShowStatusForm(true);
  };

  const saveStatus = (e) => {
    e.preventDefault();
    if (!statusForm.name || !statusForm.slug) return;
    if (editingStatus) {
      setStatuses(statuses.map((s) => (s.id === editingStatus.id ? { ...editingStatus, ...statusForm } : s)));
    } else {
      setStatuses([...statuses, { id: Date.now(), ...statusForm }]);
    }
    setShowStatusForm(false);
  };

  const deleteSelectedStatuses = () => {
    setStatuses(statuses.filter((s) => !selectedStatuses.includes(s.id)));
    setSelectedStatuses([]);
  };

  const toggleSelectStatus = (id) => {
    setSelectedStatuses((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
  };

  const selectAllStatuses = () => {
    setSelectedStatuses(selectedStatuses.length === statuses.length ? [] : statuses.map((s) => s.id));
  };

  // --- Рендер ---
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

      {/* Вкладки */}
      <nav>
        <button onClick={() => setActiveTab('statuses')} data-testid="tab-statuses">Статусы</button>
        <button onClick={() => setActiveTab('users')} data-testid="tab-users">Пользователи</button>
      </nav>

      <main>
        {/* --- Вкладка Статусы --- */}
        {activeTab === 'statuses' && (
          <div>
            <h2>Статусы</h2>
            <button onClick={openCreateStatusForm} data-testid="create-status-button">Создать статус</button>
            {selectedStatuses.length > 0 && (
              <button onClick={deleteSelectedStatuses} data-testid="delete-statuses-selected-button">
                Удалить выбранных ({selectedStatuses.length})
              </button>
            )}
            {showStatusForm && (
              <form onSubmit={saveStatus} data-testid="status-form">
                <h3>{editingStatus ? 'Редактировать' : 'Создать'} статус</h3>
                <div>
                  <label htmlFor="statusName">Название:</label>
                  <input id="statusName" type="text" value={statusForm.name} onChange={(e) => handleStatusFormChange('name', e.target.value)} data-testid="status-name-input" />
                </div>
                <div>
                  <label htmlFor="statusSlug">Slug:</label>
                  <input id="statusSlug" type="text" value={statusForm.slug} onChange={(e) => handleStatusFormChange('slug', e.target.value)} data-testid="status-slug-input" />
                </div>
                <button type="submit" data-testid="save-status-button">Сохранить</button>
                <button type="button" onClick={() => setShowStatusForm(false)} data-testid="cancel-status-button">Отмена</button>
              </form>
            )}
            <table data-testid="statuses-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={selectedStatuses.length === statuses.length && statuses.length > 0} onChange={selectAllStatuses} data-testid="select-all-statuses-checkbox" /></th>
                  <th>Название</th>
                  <th>Slug</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((s) => (
                  <tr key={s.id} data-testid={`status-row-${s.id}`}>
                    <td><input type="checkbox" checked={selectedStatuses.includes(s.id)} onChange={() => toggleSelectStatus(s.id)} data-testid={`select-status-${s.id}`} /></td>
                    <td data-testid={`status-name-${s.id}`}>{s.name}</td>
                    <td data-testid={`status-slug-${s.id}`}>{s.slug}</td>
                    <td><button onClick={() => openEditStatusForm(s)} data-testid={`edit-status-${s.id}`}>Редактировать</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Вкладка Пользователи --- */}
        {activeTab === 'users' && (
          <div>
            <h2>Пользователи</h2>
            <button onClick={openCreateUserForm} data-testid="create-user-button">Создать пользователя</button>
            {selectedUsers.length > 0 && (
              <button onClick={deleteSelectedUsers} data-testid="delete-selected-button">Удалить выбранных ({selectedUsers.length})</button>
            )}
            {showUserForm && (
              <form onSubmit={saveUser} data-testid="user-form">
                <h3>{editingUser ? 'Редактировать' : 'Создать'} пользователя</h3>
                <div>
                  <label htmlFor="firstName">Имя:</label>
                  <input id="firstName" type="text" value={userForm.firstName} onChange={(e) => handleUserFormChange('firstName', e.target.value)} data-testid="user-firstname-input" />
                </div>
                <div>
                  <label htmlFor="lastName">Фамилия:</label>
                  <input id="lastName" type="text" value={userForm.lastName} onChange={(e) => handleUserFormChange('lastName', e.target.value)} data-testid="user-lastname-input" />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input id="email" type="email" value={userForm.email} onChange={(e) => handleUserFormChange('email', e.target.value)} data-testid="user-email-input" />
                  {emailError && <span data-testid="email-error">{emailError}</span>}
                </div>
                <button type="submit" data-testid="save-user-button">Сохранить</button>
                <button type="button" onClick={() => setShowUserForm(false)} data-testid="cancel-user-button">Отмена</button>
              </form>
            )}
            <table data-testid="users-table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={selectedUsers.length === users.length && users.length > 0} onChange={selectAllUsers} data-testid="select-all-checkbox" /></th>
                  <th>Имя</th>
                  <th>Фамилия</th>
                  <th>Email</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} data-testid={`user-row-${user.id}`}>
                    <td><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} data-testid={`select-user-${user.id}`} /></td>
                    <td data-testid={`user-firstname-${user.id}`}>{user.firstName}</td>
                    <td data-testid={`user-lastname-${user.id}`}>{user.lastName}</td>
                    <td data-testid={`user-email-${user.id}`}>{user.email}</td>
                    <td><button onClick={() => openEditUserForm(user)} data-testid={`edit-user-${user.id}`}>Редактировать</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;