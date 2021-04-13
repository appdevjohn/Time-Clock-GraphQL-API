export interface UserType {
    name: string;
    timeIn: Date;
    email: string;
    id: string;
}

export class User {
    name: string;
    timeIn: Date;
    email: string;
    hashedPassword: string;
    id: string;

    constructor(name: string, timeIn: Date, email: string, hashedPassword: string, id: string) {
        this.name = name;
        this.timeIn = timeIn;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.id = id;
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