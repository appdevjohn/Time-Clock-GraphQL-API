import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
    projectId: 'time-clock-310222',
    keyFilename: 'firestoreKey.json'
});
db.settings({ ignoreUndefinedProperties: true });

export default db;