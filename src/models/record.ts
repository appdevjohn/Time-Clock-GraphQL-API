export class Record {
    timeIn: Date;
    timeOut: Date;
    id: string;

    constructor(timeIn: Date, timeOut: Date, id: string) {
        this.timeIn = timeIn;
        this.timeOut = timeOut;
        this.id = id;
    }

    static parseDoc(doc: FirebaseFirestore.DocumentData) {
        return new Record(
            doc.data().timeIn ? doc.data().timeIn.toDate() : null, 
            doc.data().timeOut ? doc.data().timeOut.toDate() : null, 
            doc.id);
    }
}