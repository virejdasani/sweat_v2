import React from 'react';
import { render } from '@testing-library/react';
import Admin from '../../../src/components/admin/Admin';

describe('Admin Component', () => {
    it('renders without crashing', () => {
        render(<Admin />);
    });
});