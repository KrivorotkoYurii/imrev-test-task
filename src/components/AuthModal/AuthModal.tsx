import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthModal.module.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const url = new URL('https://front-test.imrev.com.ua/api/v1/login');

      const headers = {
        'Accept-Language': 'UK',
        'X-Country-Code': 'DE',
        Session: 'default-session',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      const body = { email, password };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.result.access_token);
        navigate('/');
        onClose();
      } else {
        setError(data.message || 'Невірний логін чи пароль');
      }
    } catch (err) {
      setError('Помилка підключення до сервера');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalHeader}>Авторизація</h2>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.inputField}
            placeholder="Введіть email"
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.inputField}
            placeholder="Введіть пароль"
            disabled={loading}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
            disabled={loading}
          >
            Відміна
          </button>
          <button
            onClick={handleLogin}
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Завантаження...' : 'Увійти'}
          </button>
        </div>
      </div>
    </div>
  );
};
