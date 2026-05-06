import { useState } from 'react';
import './App.css';

function App() {
  // --- Авторизация ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // --- Пользователи ---
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [emailError, setEmailError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserFormChange = (field, value) => {
    setUserForm({ ...userForm, [field]: value });
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Некорректный email');
      } else {
        setEmailError('');
      }
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
    if (!userForm.firstName || !userForm.lastName || !userForm.email) return;
    if (emailError) return;

    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...editingUser, ...userForm } : u)));
    } else {
      setUsers([...users, { id: Date.now(), ...userForm }]);
    }
    setShowUserForm(false);
  };

  const cancelUserForm = () => {
    setShowUserForm(false);
    setEmailError('');
  };

  const deleteSelectedUsers = () => {
    setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
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
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
            />
          </div>
          <div>
            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
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
      <main>
        <h2>Пользователи</h2>

        {/* Кнопка создать */}
        <button onClick={openCreateUserForm} data-testid="create-user-button">
          Создать пользователя
        </button>

        {/* Массовые действия */}
        {selectedUsers.length > 0 && (
          <button onClick={deleteSelectedUsers} data-testid="delete-selected-button">
            Удалить выбранных ({selectedUsers.length})
          </button>
        )}

        {/* Форма создания/редактирования */}
        {showUserForm && (
          <form onSubmit={saveUser} data-testid="user-form">
            <h3>{editingUser ? 'Редактировать' : 'Создать'} пользователя</h3>
            <div>
              <label htmlFor="firstName">Имя:</label>
              <input
                id="firstName"
                type="text"
                value={userForm.firstName}
                onChange={(e) => handleUserFormChange('firstName', e.target.value)}
                data-testid="user-firstname-input"
              />
            </div>
            <div>
              <label htmlFor="lastName">Фамилия:</label>
              <input
                id="lastName"
                type="text"
                value={userForm.lastName}
                onChange={(e) => handleUserFormChange('lastName', e.target.value)}
                data-testid="user-lastname-input"
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => handleUserFormChange('email', e.target.value)}
                data-testid="user-email-input"
              />
              {emailError && <span data-testid="email-error">{emailError}</span>}
            </div>
            <button type="submit" data-testid="save-user-button">Сохранить</button>
            <button type="button" onClick={cancelUserForm} data-testid="cancel-user-button">
              Отмена
            </button>
          </form>
        )}

        {/* Таблица пользователей */}
        <table data-testid="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={selectAllUsers}
                  data-testid="select-all-checkbox"
                />
              </th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} data-testid={`user-row-${user.id}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelectUser(user.id)}
                    data-testid={`select-user-${user.id}`}
                  />
                </td>
                <td data-testid={`user-firstname-${user.id}`}>{user.firstName}</td>
                <td data-testid={`user-lastname-${user.id}`}>{user.lastName}</td>
                <td data-testid={`user-email-${user.id}`}>{user.email}</td>
                <td>
                  <button
                    onClick={() => openEditUserForm(user)}
                    data-testid={`edit-user-${user.id}`}
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;