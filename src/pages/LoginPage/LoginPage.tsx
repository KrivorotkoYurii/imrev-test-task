import React, { useState } from 'react';
import { AuthModal } from '../../components/AuthModal';
import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginHeader}>Ласкаво просимо!</h1>
        <p className={styles.loginDescription}>
          Щоб продовжити, будь ласка, авторизуйтесь.
        </p>
        <button
          onClick={openModal}
          className={`${styles.button} ${styles.authButton}`}
        >
          Увійти
        </button>
        <AuthModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};
