import db from '../util/firestore';
import { User, UserType } from '../models/user';
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

export const getUserRecords = async ({ userId }: { userId: string }, { isAuth }: { isAuth: boolean }): Promise<Record[]> => {
    if (!isAuth) {
        throw new Error('Not authenticated');
    }

    const snapshot = await db.collection('users').doc(userId).collection('records').orderBy('timeIn', 'asc').get();

    const records = snapshot.docs.map(doc => {
        return Record.parseDoc(doc);
    });
    return records;
}

export const getUserHourTotals = async ({ userId }: { userId: string }, { isAuth }: { isAuth: boolean }): Promise<HourTotals> => {
    if (!isAuth) {
        throw new Error('Not authenticated');
    }

    const date = new Date();  // Will be set to the first day of the week.
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    date.setDate(date.getDate() - date.getDay());

    const snapshot = await db.collection('users')
        .doc(userId)
        .collection('records')
        .where('timeIn', '>', firstOfMonth)
        .get();

    const records = snapshot.docs.map(doc => {
        return Record.parseDoc(doc);
    });

    let totalHours = 0;
    let weekHours = 0;
    records.forEach(r => {
        const hours = dateHours(r.timeIn, r.timeOut);
        totalHours += hours;
        if (r.timeIn.getTime() > date.getTime()) {
            weekHours += hours;
        }
    });

    return {
        week: weekHours,
        month: totalHours
    }
}

export const setUser = async ({ name, timeIn, id }: UserType, { isAuth }: { isAuth: boolean }): Promise<User> => {
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