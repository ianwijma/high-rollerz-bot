import dotenv from 'dotenv';
import App from "./src";

dotenv.config();

const app = new App();
app.start().then(() => {
    console.log('Rolling with the Highest!')
}, msg => {
    console.log(msg)
});