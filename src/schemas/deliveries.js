import joi from "joi";

const putDeliveryAvaliationSchema = joi.object({
  deliveryId: joi.number().positive().required(),
  avaliation: joi.boolean().required(),
  avaliationType: joi.string().min(1).max(200),
  avaliationDesc: joi.string().min(1).max(255),
});

export { putDeliveryAvaliationSchema };
