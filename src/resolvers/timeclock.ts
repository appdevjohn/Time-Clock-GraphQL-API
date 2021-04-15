import db from '../util/firestore';
import { User } from '../models/user';
import { Record } from '../models/record';
import { HourTotals } from '../models/misc';
import dateHours from '../util/dateHours';

export const getUser = async ({ userId }: { userId: string }, { isAuth }: { isAuth: boolean }): Promise<User> => {
    if (!isAuth) {
        throw new Error('Not authenticated');
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
        throw new Error('User does not exist.');
    }

    return User.parseDoc(userDoc);
}

export const setUser = async ({ name, timeIn, id }: User, { isAuth }: { isAuth: boolean }): Promise<User> => {
    if (!isAuth) {
        throw new Error('Not authenticated');
    }

    await db.collection('users').doc(id).set({
        name: name,
        timeIn: timeIn ? new Date(timeIn) : timeIn === null ? null : undefined
    }, { merge: true });
    const userDoc = await db.collection('users').doc(id).get();
    return User.parseDoc(userDoc);
}

export const addRecord = async ({ userId, timeIn, timeOut }: { userId: string; timeIn: Date; timeOut: Date }, { isAuth }: { isAuth: boolean }): Promise<Record> => {
    if (!isAuth) {
        throw new Error('Not authenticated');
    }

    const response = await db.collection('users').doc(userId).collection('records').add({
        timeIn: new Date(timeIn),
        timeOut: new Date(timeOut),
    });
    const recordDoc = await response.get();
    return Record.parseDoc(recordDoc);
}

export const deleteRecord = async ({ id, userId }: { id: string; userId: string }, { isAuth }: { isAuth: boolean }): Promise<Record> => {
    if (!isAuth) {
        throw new Error('Not authenticated');
    }

    const recordDoc = await db.collection('users').doc(userId).collection('records').doc(id).get();
    if (!recordDoc.exists) {
        throw new Error('Record does not exist.');
    }

    await db.collection('users').doc(userId).collection('records').doc(id).delete();
    return Record.parseDoc(recordDoc);
}