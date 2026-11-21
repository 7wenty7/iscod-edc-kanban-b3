import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    pool: 'forks',
    // variables pour les tests (pas besoin de fichier .env)
    env: {
      NODE_ENV: 'test',
      MONGODB_URI: 'mongodb://localhost:27017/visiplus_test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters',
      DOTENV_CONFIG_QUIET: 'true',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
  esbuild: {
    target: 'node18',
  },
});

