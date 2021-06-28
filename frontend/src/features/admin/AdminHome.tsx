import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectUrlInformations, getUrlInfosAsync, UrlInformations} from './AdminHomeSlice'
import { BACKEND_SERVICE_URL } from '../../Constants';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from '@coreui/react'

// Import CoreUI styles
import "@coreui/coreui/scss/coreui.scss"

export function AdminHome() {
  const dispatch = useAppDispatch();
  const urlInfos = useAppSelector(selectUrlInformations)
  if (urlInfos.length === 0) {
    dispatch(getUrlInfosAsync())
  }
  const urlInformationsWidget = getUrlInfosWidget(urlInfos)

  return (
    <div>
       <span>Admin Home</span>
      <div>{ urlInformationsWidget }</div>
    </div>
  );

  function getUrlInfosWidget(urlInfos: UrlInformations[]) {
    if (urlInfos && urlInfos.length > 0) {
      const infos =  urlInfos.map((urlInfo) => {
        return ({
          id: urlInfo.id,
          'short url': `${BACKEND_SERVICE_URL}/${urlInfo.id}`,
          'original url': urlInfo.originalUrl,
          'user Id': urlInfo.userId,
          'hits': urlInfo.hits,
          'status': urlInfo.status,
          'expiration Date': urlInfo.expirationDate
        })
      })

      return (
        <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              All Urls
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={infos}
              fields={['short url', 'original url', 'status', 'expiration Date']}
              hover
              striped
              border
              size="sm"
              itemsPerPage={10}
              pagination
              // scopedSlots = {{
              //   'status':
              //     (item)=>(
              //       <td>
              //         <CBadge color={getBadge(item.status)}>
              //           {item.status}
              //         </CBadge>
              //       </td>
              //     )
              // }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>)
    }
  }
}
