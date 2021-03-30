import { q, client } from '../util/faunaDb';

export const createUser = (data) => {
    console.log('Adataaaaaa', data);
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

export const getUserByEmail = (data) => {
    return client.query(q.Get(q.Match(q.Index('get_user_by_email'), [data])));
}

export const userProfile = (data) => {
    return client.query(
        q.Map(
            q.Paginate(
              q.Join(
                q.Match(q.Index("user_rank"), data),
                q.Index("rank_user")
              )
            ),
            q.Lambda("X", q.Get(q.Var("X")))
          )
    )
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




