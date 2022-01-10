'use strict'

const Role = require("../models/roles");


const data = {
    createRoles: async () => {
        try {
            const cont = await Role.estimatedDocumentCount();

            if (cont > 0) return;

            const values = await Promise.all([
                new Role({ name: "usuario" }).save(),
                new Role({ name: "admin" }).save()
            ]);

            console.log(values)

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = data;