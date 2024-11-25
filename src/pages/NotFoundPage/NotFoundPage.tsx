import React from 'react';
import styles from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';
import notFoundImage from './page-not-found.png';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <div className={styles.notFound}>
        <img
          src={notFoundImage}
          alt="image of not found page"
          className={styles.notFound__image}
        />
        <h2 className={styles.notFound__title}>Page not found</h2>
        <Link to={'/'} className={styles.notFound__button}>
          Back to Home page
        </Link>
      </div>
    </>
  );
};
