import globals from 'globals'

module.exports = {
    ignorePatterns: ['dist', 'build', 'node_modules'],
    overrides: [
        {
            files: ['**/*.{js,jsx,ts,tsx}'],
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                    impliedStrict: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
            settings: {
                react: {
                    version: 'detect',
                    componentWrapperFunctions: ['styled'],
                },
                'import/resolver': {
                    node: {
                        extensions: ['.js', '.jsx', '.ts', '.tsx'],
                        moduleDirectory: ['node_modules', 'src/'],
                    },
                    alias: {
                        extensions: ['.js', '.jsx', '.ts', '.tsx'],
                        map: [['@', './src']],
                    },
                },
            },
            plugins: [
                'react',
                'react-hooks',
                'react-refresh',
                'prettier',
                'import',
            ],
            rules: {
                // Base configurations
                ...require('eslint-plugin-react').configs.recommended.rules,
                ...require('eslint-plugin-react').configs['jsx-runtime'].rules,
                ...require('eslint-plugin-react-hooks').configs.recommended
                    .rules,
                ...require('eslint-plugin-prettier').configs.recommended.rules,

                // React specific rules
                'react/jsx-no-target-blank': [
                    'warn',
                    { enforceDynamicLinks: 'always' },
                ],
                'react/prop-types': 'off',
                'react/react-in-jsx-scope': 'off',
                'react/jsx-filename-extension': [
                    1,
                    { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
                ],
                'react/function-component-definition': [
                    2,
                    {
                        namedComponents: [
                            'arrow-function',
                            'function-declaration',
                        ],
                        unnamedComponents: ['arrow-function'],
                    },
                ],
                'react/jsx-props-no-spreading': 'off',
                'react/no-unknown-property': ['error', { ignore: ['css'] }],

                // React Hooks rules
                'react-hooks/rules-of-hooks': 'error',
                'react-hooks/exhaustive-deps': 'warn',

                // React Refresh rules
                'react-refresh/only-export-components': [
                    'warn',
                    { allowConstantExport: true },
                ],

                // Import rules
                'import/prefer-default-export': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/order': [
                    'error',
                    {
                        groups: [
                            'builtin',
                            'external',
                            'internal',
                            'parent',
                            'sibling',
                            'index',
                        ],
                        'newlines-between': 'always',
                        alphabetize: { order: 'asc' },
                    },
                ],

                // Prettier configuration
                'prettier/prettier': [
                    'error',
                    {
                        endOfLine: 'auto',
                        singleQuote: true,
                        semi: false,
                        tabWidth: 2,
                    },
                ],

                // General rules
                'no-unused-vars': [
                    'warn',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_',
                    },
                ],
                'no-console': ['warn', { allow: ['warn', 'error'] }],
                'no-param-reassign': ['error', { props: false }],

                // Accessibility rules (if you really need to disable them)
                'jsx-a11y/no-static-element-interactions': 'warn',
                'jsx-a11y/click-events-have-key-events': 'warn',
            },
        },
    ],
}
