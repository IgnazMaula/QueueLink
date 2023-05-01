import App from './App';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('App', () => {
    test('App should be render', () => {
        render(<App />);
        expect(screen.getByText(/Queue /i)).toBeDefined();
    });
});
