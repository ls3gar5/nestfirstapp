module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};

// @typescript-eslint/interface-name-prefix': 'off',
// Disables the rule that enforces interface names to start with an "I" (like IUser). You can name interfaces without this prefix.

//'@typescript-eslint/explicit-function-return-type': 'off': 
// Disables the rule that requires you to explicitly specify the return type of functions. TypeScript will infer it automatically.

// '@typescript-eslint/explicit-module-boundary-types': 'off': 
// Disables the rule that requires you to explicitly specify the return types for functions and methods that are exported from a module.

//'@typescript-eslint/no-explicit-any': 'off': 
// Disables the rule that prevents you from using the any type. You are allowed to use any in your TypeScript code.