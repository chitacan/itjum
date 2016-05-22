module.exports = {
  "parser": "babel-eslint",
  "extends": "google",
  "plugins": ["react"],
  "env": {
    "node": true
  },
  "globals": {
    "document": true,
    "window": true,
    "__VERSION__": true
  },
  "rules": {
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1
  }
};
