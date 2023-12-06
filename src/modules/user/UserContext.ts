import React from 'react'

export interface User {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  pharmacy?: string;
  uid?: string;
}

export const isUserValid = (user: User): boolean => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'pharmacy',
    'uid',
  ];
  let isValid = true;
  requiredFields.forEach(requiredField => {
    if (!(requiredField in user)) {
      isValid = false;
    }
  });
  return isValid;
};

const UserContext = React.createContext<{
  user: null|User,
  setUser: (value: null|User) => void,
  logOut: () => void,
}>({
  user: null,
  setUser: () => {},
  logOut: () => {},
});

export default UserContext;
