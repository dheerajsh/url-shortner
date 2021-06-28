import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { createShortUrlAsync, selectError, clearError} from './userHomeSlice'
import styles from './user.module.css';

export function CreateShortUrl() {
  const dispatch = useAppDispatch();
  // const [error, setError] = useState('');
  const error = useAppSelector(selectError)
  const [originalUrl, setOriginalUrl] = useState('');

  const errorMassage = error ? (<div><label className={styles.alert}>{ error }</label></div>) : error
  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="enter an url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(clearError()) && dispatch(createShortUrlAsync(originalUrl))}
        >
         create a short url
        </button>
      </div>
      { errorMassage }
    </div>
  );
}
