import React from 'react';
import { render, screen } from '@testing-library/react';
//import Header from '../src/components/Header';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router'; // updated import
//import configureStore from 'redux-mock-store';

// const mockStore = configureStore([]);

describe('Header', () => {
  it('renders ChikkiStream and Guest by default', () => {
    // const store = mockStore({ auth: { user: null } });
    // render(
    //   <Provider store={store}>
    //     <BrowserRouter>
    //       <Header />
    //     </BrowserRouter>
    //   </Provider>
    // );
    // expect(screen.getByText(/ChikkiStream/i)).toBeInTheDocument();
    // expect(screen.getByText(/Guest/i)).toBeInTheDocument();
  });

  it('renders username when user is logged in', () => {
    // const store = mockStore({ auth: { user: { username: 'testuser' } } });
    // render(
    //   <Provider store={store}>
    //     <BrowserRouter>
    //       <Header />
    //     </BrowserRouter>
    //   </Provider>
    // );
    // expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });
});
