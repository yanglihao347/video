const getEnv = () => {
  let port = window.location.port;
  if (port === '3001') {
    return '';
  } else {
    return 'http://localhost:3001';
  }
}

const parseQuery = () => {
  let search = window.location.href.split('?')[1];
  const queryList = search.split('&');
  const queryObj = {};
  queryList.map((query) => {
    queryObj[query.split('=')[0]] = decodeURI(query.split('=')[1]);
  })
  return queryObj;
}


export {
  getEnv,
  parseQuery,
}