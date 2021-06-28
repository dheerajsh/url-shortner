import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { createShortUrlAsync, selectError, clearError} from './userHomeSlice'
import styles from './user.module.css';

export function CreateShortUrl() {
  const dispatch = useAppDispatch();
  // const [error, setError] = useState('');
  const error = useAppSelector(selectError)
  const [originalUrl, setOriginalUrl] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const errorMassage = error ? (<div><label className={styles.alert}>{ error }</label></div>) : error
  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="enter an url"
          placeholder='Enter the full url'
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <input
          className={styles.textbox}
          aria-label="enter an Expiry date"
          placeholder='UTC Format i.e 2021-06-27T00:00:00.000Z'
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(clearError()) && dispatch(createShortUrlAsync({ originalUrl, expirationDate }))}
        >
         create a short url
        </button>
      </div>
      { errorMassage }
    </div>
  );
}
