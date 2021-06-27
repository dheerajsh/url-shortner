import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {selectUserId, createShortUrlAsync} from './userHomeSlice'
import styles from './user.module.css';

export function CreateShortUrl() {
  const dispatch = useAppDispatch();
  const [originalUrl, setOriginalUrl] = useState('');
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
          onClick={() => dispatch(createShortUrlAsync(originalUrl))}
        >
         create a short url
        </button>
      </div>
    </div>
  );
}
