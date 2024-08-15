// src/services/EnumValueServices.js
const { DatabaseError } =require("../errors/DatabaseError") ;
const enumValue =require('../utilty/enum.json');

 class EnumValueServices {
    async getEnum(root, child) {
        try {
            const rootValue = enumValue[root];
            if (rootValue) {
                const childValue = rootValue[child];
                if (childValue) {
                    return childValue;
                } else {
                    throw new Error(`Enum value not found for root: ${root}, child: ${child}`);
                }
            }
            throw new Error(`Enum value not found for root: ${root}, child: ${child}`);
        } catch (error) {
            throw new DatabaseError('Error retrieving EnumValue.', error);
        }
    }
}

module.exports= new EnumValueServices();
