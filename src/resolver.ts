import { login, signUp, requestPasswordReset, resetPassword } from './resolvers/auth';
import { getUser, setUser, getUserRecords, addRecord, deleteRecord, getUserHourTotals } from './resolvers/timeclock';

const rootResolver = {
    login: login,
    signUp: signUp,
    requestPasswordReset: requestPasswordReset,
    resetPassword: resetPassword,
    user: getUser,
    setUser: setUser,
    records: getUserRecords,
    addRecord: addRecord,
    deleteRecord: deleteRecord,
    userHours: getUserHourTotals
}

export default rootResolver;