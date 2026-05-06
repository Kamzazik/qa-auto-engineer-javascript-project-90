import { useState } from 'react';
import './App.css';

function App() {
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
        <h2>Добро пожаловать, {username}!</h2>
        <p>Здесь будет канбан-доска.</p>
      </main>
    </div>
  );
}

export default App;