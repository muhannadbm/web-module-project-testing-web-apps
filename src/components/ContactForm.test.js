import React from 'react';
import {render, screen, wait, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header',()=> {
    render(<ContactForm/>)
    const header = screen.getByText('Contact Form')
    expect(header).toBeInTheDocument()
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)
    const nameinput = screen.getByPlaceholderText('Edd')
    userEvent.type(nameinput, '1234')
    await waitFor(()=> {
        const errormessage = screen.getByTestId('error')
        expect(errormessage).toHaveTextContent('Error: firstName must have at least 5 characters.')
    })
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)
    const nameinput = screen.getByPlaceholderText('Edd')
    const lastnameinput = screen.getByPlaceholderText('Burke')
    const emailinput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    const submitbutt = screen.getByRole('button')
    userEvent.type(nameinput, ' ')
    userEvent.clear(nameinput)
    userEvent.type(emailinput, ' ')
    userEvent.clear(emailinput)
    
    await waitFor(()=> {
        expect(nameinput).toHaveTextContent('')
        expect(emailinput).toHaveTextContent('')
        expect(lastnameinput).toHaveTextContent('')
        userEvent.click(submitbutt)
        const errormessage = screen.getAllByTestId('error')
        expect(errormessage).toHaveLength(3)
    })

});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)
    const nameinput = screen.getByPlaceholderText('Edd')
    const lastnameinput = screen.getByPlaceholderText('Burke')
    const emailinput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    const submitbutt = screen.getByRole('button')
    expect(emailinput).toHaveTextContent('')

    await waitFor(()=> {
        userEvent.type(nameinput, 'Muhannad')
        userEvent.type(lastnameinput, 'bani almarje')
        userEvent.click(submitbutt)
        const errormessage = screen.getAllByTestId('error')
        expect(errormessage).toHaveLength(1)

    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)
    const emailinput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    userEvent.type(emailinput, 'aasdasdasdasdsdqwqwqwwqrwrwrq')
    const errormessage = screen.getByTestId('error')
    expect(errormessage).toHaveTextContent("email must be a valid email address")
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)
    const nameinput = screen.getByPlaceholderText('Edd')
    const lastnameinput = screen.getByPlaceholderText('Burke')
    const emailinput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    const submitbutt = screen.getByRole('button')
    userEvent.type(nameinput, 'Muhannad')
    userEvent.type(emailinput, 'mhd@hotmail.com')
    userEvent.click(submitbutt)
    const errormessage = screen.getByTestId('error')
    expect(lastnameinput).toHaveTextContent('')
    expect(errormessage).toHaveTextContent("lastName is a required field")

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)
    const nameinput = screen.getByPlaceholderText('Edd')
    const lastnameinput = screen.getByPlaceholderText('Burke')
    const emailinput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    // const message = screen.getByLabelText('message')
    const submitbutt = screen.getByRole('button')
    userEvent.type(nameinput, 'Muhannad')
    userEvent.type(emailinput, 'mhd@hotmail.com')
    userEvent.type(lastnameinput, 'Bani Almarje')
    // userEvent.type(emailinput, 'mhd@hotmail.com')
    userEvent.click(submitbutt)

    const fnameDisplay = screen.getByTestId('firstnameDisplay')
    const lnameDisplay = screen.getByTestId('lastnameDisplay')
    const emailDisplay = screen.getByTestId('emailDisplay')
    const messageDisplay = screen.queryByTestId('messageDisplay')
    expect(messageDisplay).toBeNull() 
    expect(fnameDisplay).toHaveTextContent(`First Name: ${nameinput.value}`)
    expect(lnameDisplay).toHaveTextContent(`Last Name: ${lastnameinput.value}`)
    expect(emailDisplay).toHaveTextContent(`Email: ${emailinput.value}`)
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)
    const nameinput = screen.getByPlaceholderText('Edd')
    const lastnameinput = screen.getByPlaceholderText('Burke')
    const emailinput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
    const messageinput = screen.getByLabelText('Message')

    const submitbutt = screen.getByRole('button')
    userEvent.type(nameinput, 'Muhannad')
    userEvent.type(emailinput, 'mhd@hotmail.com')
    userEvent.type(lastnameinput, 'Bani Almarje')
    userEvent.type(messageinput, 'My Message')
    userEvent.click(submitbutt)

    const fnameDisplay = screen.getByTestId('firstnameDisplay')
    const lnameDisplay = screen.getByTestId('lastnameDisplay')
    const emailDisplay = screen.getByTestId('emailDisplay')
    const messageDisplay = screen.getByTestId('messageDisplay')
    
    expect(fnameDisplay).toHaveTextContent(`First Name: ${nameinput.value}`)
    expect(lnameDisplay).toHaveTextContent(`Last Name: ${lastnameinput.value}`)
    expect(emailDisplay).toHaveTextContent(`Email: ${emailinput.value}`)
    expect(messageDisplay).toHaveTextContent(`Message: ${messageinput.value}`)
});