const getEnv = () => {
  let port = window.location.port;
  if (port === '3001') {
    return '';
  } else {
    return 'http://localhost:3001';
  }
}


export {
  getEnv,
}