import faunadb from 'faunadb';

export const q = faunadb.query;

const secret = process.env.FAUNADB_SECRET;
export const client = new faunadb.Client({ secret });

