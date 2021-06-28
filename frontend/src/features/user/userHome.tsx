import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setUserId as changeUserId, selectUserId, selectUrlInfos, UrlInfo} from './userHomeSlice'
import styles from './user.module.css';
import { CreateShortUrl } from './createShortUrl';
import { BACKEND_SERVICE_URL } from '../../Constants';
import {
  CDataTable,
} from '@coreui/react'

// Import CoreUI styles
import "@coreui/coreui/scss/coreui.scss"

export function UserHome() {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState('');
  const id = useAppSelector(selectUserId)
  const urlInfos = useAppSelector(selectUrlInfos)
  const creatShortUrlOption = id ? <CreateShortUrl></CreateShortUrl> : ''

const urlInformations = getUrlInfosWidget(urlInfos)
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
      {creatShortUrlOption}
      <div className={styles.row}>{ urlInformations }</div>
    </div>
  );

  function getUrlInfosWidget(urlInfos: UrlInfo[]) {
    if (urlInfos && urlInfos.length > 0) {
      const infos =  urlInfos.map((urlInfo) => {
        return ({
          id: urlInfo.shortUrl,
          shortUrl: `${BACKEND_SERVICE_URL}/${urlInfo.shortUrl}`,
          originalUrl: urlInfo.originalUrl
        })
      })

      return (
        <CDataTable
              items={infos}
              fields={['shortUrl', 'originalUrl']}
              hover
              striped
              size="sm"
              itemsPerPage={10}
              pagination
            />)
    }
  }
}
