import { login, signUp } from './resolvers/auth';
import { getUser, setUser, addRecord, deleteRecord } from './resolvers/timeclock';

const rootResolver = {
    login: login,
    signUp: signUp,
    user: getUser,
    setUser: setUser,
    addRecord: addRecord,
    deleteRecord: deleteRecord,
}

export default rootResolver;