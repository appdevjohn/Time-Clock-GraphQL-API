import { buildSchema } from 'graphql';

const schema = buildSchema(`
scalar Date

type AuthData {
    userId: ID,
    token: String
}

type RecordDataType {
    id: ID,
    timeIn: Date,
    timeOut: Date
}

type HourTotalsDataType {
    week: Float,
    month: Float
}

type UserDataType {
    id: ID,
    name: String,
    timeIn: Date,
    email: String,
    records: [RecordDataType],
    totalHours: HourTotalsDataType
}

type RootQuery {
    login(email: String!, password: String!): AuthData
    user(userId: ID!): UserDataType
}

type RootMutation {
    signUp(email: String!, name: String!, password: String!): AuthData
    requestPasswordReset(email: String!): String
    resetPassword(password: String!): String
    setUser(name: String, timeIn: Date, id: ID!): UserDataType
    addRecord(timeIn: Date!, timeOut: Date!, userId: ID!): RecordDataType
    deleteRecord(id: ID!, userId: ID!): RecordDataType
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

export default schema;