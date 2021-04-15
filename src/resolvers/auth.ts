import db from '../util/firestore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthData, AuthInput, AuthSignUpInput } from '../models/misc';

export const login = async ({ email, password }: AuthInput) => {
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.docs.length === 0) {
        throw new Error('This account does not exist.');
    }
    const user = snapshot.docs[0];
    
    const passwordMatch = bcrypt.compareSync(password, user.data().password);

    if (passwordMatch) {
        const token = jwt.sign({ userId: user.id, email: user.data().email }, 'shhh');
        return {
            userId: user.id,
            token: token
        }
    } else {
        throw new Error('Password is incorrect.');
    }
}

export const signUp = async ({ email, name, password }: AuthSignUpInput): Promise<AuthData> => {
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    const accountExists = snapshot.docs.length > 0 ? true : false;

    if (accountExists) {
        throw new Error('This acccount already exists.');
    } else {
        const hashedPassword = bcrypt.hashSync(password, 12);
        const result = await db.collection('users').add({
            name: name,
            email: email,
            password: hashedPassword
        });

        const tokenPayload = { userId: result.id, email: email };
        const token = jwt.sign(tokenPayload, 'shhh');
        return {
            userId: result.id,
            token: token
        }
    }
}