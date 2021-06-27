import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setUserId as changeUserId, selectUserId} from './userHomeSlice'
import styles from './user.module.css';

export function ShortUrls() {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');
  const id = useAppSelector(selectUserId)
  return (
    <div>
       <span className={styles.value}>{id}</span>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="set user Id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() => dispatch(changeUserId(userId))}
        >
          set user id
        </button>
      </div>
    </div>
  );
}
