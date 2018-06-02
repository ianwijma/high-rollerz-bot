import { App } from './src/index'
import dotenv from 'dotenv';

dotenv.config();

const app = new App();
app.start().then(() => {
    console.log('Rolling with the Highest!')
}, msg => {
    console.log(msg)
});