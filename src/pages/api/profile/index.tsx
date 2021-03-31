import { NextApiRequest, NextApiResponse } from "next";
import { getUserById, updateUser } from '../../../services/users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, name, email } = req.body;
    const user = await getUserById(id);

    if (!user) {
        return res.status(201).json({ message: 'Não foi possível atualizar, tente mais tarde' });
    }

    await updateUser(req.body);

    return res.status(201).json({ message: `Usuário ${name} atualizado` });
}