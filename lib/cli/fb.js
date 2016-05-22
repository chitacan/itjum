import firebase from '../firebaseExtended';

var _firebase = null;

export default serviceAccount => {
  if (_firebase === null) {
    _firebase = firebase.initializeApp({
      serviceAccount,
      databaseURL: "https://project-9057366841059851375.firebaseio.com"
    });
    return _firebase;
  }
  return _firebase;
};
