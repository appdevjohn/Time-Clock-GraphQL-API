import db from '../util/firestore';
import { Record } from './record';
import { HourTotals } from './misc';
import dateHours from '../util/dateHours';

export class User {
    name: string;
    timeIn: Date;
    email: string;
    hashedPassword: string;
    records: () => Promise<Record[]> = this.getRecords;
    totalHours: () => Promise<HourTotals> = this.getTotalHours;
    id: string;

    constructor(name: string, timeIn: Date, email: string, hashedPassword: string, id: string) {
        this.name = name;
        this.timeIn = timeIn;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.id = id;
    }

    getRecords(): Promise<Record[]> {
        return db.collection('users').doc(this.id).collection('records').get().then(snapshot => {
            return snapshot.docs.map(doc => Record.parseDoc(doc));
        }).catch(() => {
            return [];
        });
    }

    async getTotalHours(): Promise<HourTotals> {
        const date = new Date();  // Will be set to the first day of the week.
        const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstOfWeek = new Date(date.getDate() - date.getDay());
    
        const snapshot = await db.collection('users')
            .doc(this.id)
            .collection('records')
            .where('timeIn', '>', firstOfMonth)
            .get();
    
        const records = snapshot.docs.map(doc => Record.parseDoc(doc));
    
        let totalHours = 0;
        let weekHours = 0;
        records.forEach(r => {
            const hours = dateHours(r.timeIn, r.timeOut);
            totalHours += hours;
            if (r.timeIn.getTime() > firstOfWeek.getTime()) {
                weekHours += hours;
            }
        });

        return {
            week: weekHours,
            month: totalHours
        }
    }

    static parseDoc(doc: FirebaseFirestore.DocumentData) {
        return new User(
            doc.data().name,
            doc.data().timeIn ? doc.data().timeIn.toDate() : null,
            doc.data().email,
            doc.data().password,
            doc.id);
    }
}