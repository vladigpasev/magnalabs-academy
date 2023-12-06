import users from '../../data/users.json';

const UserProvider = {
  getUsernames: (): string[] => {
    return users.users.split('.');
  },
};

export default UserProvider;
