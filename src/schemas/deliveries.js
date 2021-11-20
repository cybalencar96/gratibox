import joi from "joi";

const putDeliveryAvaliationSchema = joi.object({
  deliveryId: joi.number().positive().required(),
  avaliation: joi.boolean().required(),
  avaliationType: joi.string().max(200).required(),
  avaliationDesc: joi.string().max(255).required(),
});

export { putDeliveryAvaliationSchema };
