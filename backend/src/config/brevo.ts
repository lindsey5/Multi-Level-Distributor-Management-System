import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const brevoClient = SibApiV3Sdk.ApiClient.instance;
brevoClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY as string;

export const brevo = new SibApiV3Sdk.TransactionalEmailsApi();

export const sender = {
    name: 'Zhiyuan Enterprice Group Inc.',
    email: process.env.EMAIL_USER as string,
};