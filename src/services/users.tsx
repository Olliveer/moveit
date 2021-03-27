import { q, client } from '../util/faunaDb';

export const createUser = (data) => {
    return client.query(q.Create(q.Collection('users'), { data }))
}

//update

//delete
export const deleteUser = (ref) => {
    return client.query(q.Delete(q.Ref(q.Collection('users'), ref)))
}

export const getAllUsers = () => {
    return client.query(
        q.Map(
            // iterate each item in result
            q.Paginate(
                // make paginatable
                q.Match(
                    // query index
                    q.Index("get_all_users") // specify source
                )
            ),
            q.Lambda((x) => q.Get(x)) // lookup each result by its reference
        )
    );
}

export const getAllAdmin = () => {
    return client.query(
        q.Map(
            // iterate each item in result
            q.Paginate(
                // make paginatable
                q.Match(
                    // query index
                    q.Index("get_all_admin"), true // specify source
                )
            ),
            q.Lambda('admin', q.Get(q.Var('admin'))) // lookup each result by its reference
        )
    );
}

export const createAdmin = (data) => {
    return client.query(q.Create(q.Collection('users'), { data }))
}




