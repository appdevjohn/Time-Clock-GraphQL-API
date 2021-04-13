import jwt from 'jsonwebtoken';

const isAuth = (req: any, res: any, next: any) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken: { userId: string, email: string };
    try {
        decodedToken = jwt.verify(token, 'shhh') as { userId: string, email: string };
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}

export default isAuth;