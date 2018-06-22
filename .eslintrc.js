module.exports = {
    root: true,
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": false
        }
    },
    extends: "airbnb-base",
    env: {
        browser: true
    },
    rules: {
        "indent": [2, 2],
        "no-void": [0],
        "consistent-return": [0],
        "no-param-reassign": [0],
        "prefer-rest-params": [0],
        "no-plusplus": [0],
        "no-multi-assign": [0],
        "no-unused-expressions": [2, { "allowShortCircuit": true, "allowTernary": true }],
        "no-bitwise": [0]
    }
}