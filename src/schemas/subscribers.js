import joi from 'joi';

const subscribeSchema = joi.object({
    subscriptionType: joi.string().valid('monthly', 'weekly').required(),
    deliverOption: joi.string().valid('1', '10', '20', 'monday', 'wednesday', 'friday').required(),
    teas: joi.boolean(),
    incenses: joi.boolean(),
    organics: joi.boolean(),
    deliverInfos: joi.object({
        name: joi.string().max(255).required(),
        cep: joi.string().min(8).max(8).required(),
        address: joi.string().max(500).required(),
        city: joi.string().max(255).required(),
        uf: joi.string().min(2).max(2).required(),
    }).required(),
});

export {
    subscribeSchema,
}
