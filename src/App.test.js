import React from 'react'
import App from './App'
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test("App is running", ()=> {
render(<App/>)
})