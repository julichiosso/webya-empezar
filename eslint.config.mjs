import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      '.claude/worktrees/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  ...capas(),
];

/**
 * Capas del frontend (docs/plan-sprint.md §1): solo se importa hacia abajo.
 *   app > features > marketing > patterns > ui > content > brand > domain > config > lib
 * Avisa al escribir; la fuente de verdad (con excepciones registradas) es tests/arquitectura.
 */
function capas() {
  const orden = [
    ['src/features/**', ['app', 'server']],
    ['src/components/marketing/**', ['app', 'server', 'features']],
    ['src/components/patterns/**', ['app', 'server', 'features', 'components/marketing']],
    [
      'src/components/ui/**',
      ['app', 'server', 'features', 'components/marketing', 'components/patterns'],
    ],
    ['src/content/**', ['app', 'server', 'features', 'components']],
    ['src/brand/**', ['app', 'server', 'features', 'components', 'content']],
    ['src/domain/**', ['app', 'server', 'features', 'components', 'content', 'brand']],
    ['src/config/**', ['app', 'server', 'features', 'components', 'content', 'brand', 'domain']],
    [
      'src/lib/**',
      ['app', 'server', 'features', 'components', 'content', 'brand', 'domain', 'config'],
    ],
  ];
  return orden.map(([files, prohibidas]) => ({
    files: [files],
    ignores: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: prohibidas.flatMap((c) => [`@/${c}`, `@/${c}/*`]),
              message:
                'Capas: solo se importa hacia abajo (app > features > marketing > patterns > ui > content > brand > domain > config > lib).',
            },
            ...(files === 'src/domain/**'
              ? [
                  {
                    group: ['react', 'react-dom', 'next/*'],
                    message: 'domain no usa React ni Next.',
                  },
                ]
              : []),
          ],
        },
      ],
    },
  }));
}

export default config;
