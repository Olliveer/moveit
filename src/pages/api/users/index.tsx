import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getAllUsers } from '../../../services/users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'POST':
        await createUser(req.body);
        res.status(201).json({message: 'User created'});
        break;
      case 'GET':
        const allUsers = await getAllUsers();

        res.status(200).json(allUsers.data);
        break;
      default:
        res.status(200);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// try {
//   const dbs = await client.query(
//     q.Map(
//       // iterate each item in result
//       q.Paginate(
//         // make paginatable
//         q.Match(
//           // query index
//           q.Index("get_all_users") // specify source
//         )
//       ),
//       q.Lambda(x => q.Get(x)) // lookup each result by its reference
//     )
//   );
//   // ok
//   res.status(200).json(dbs.data);
// } catch (e) {
//   // something went wrong
//   res.status(500).json({ error: e.message });
// }