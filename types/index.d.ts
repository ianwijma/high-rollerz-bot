import {ModuleInterface} from "../src/interfaces";
import Knex = require("knex");

declare global {
    namespace NodeJS {
        interface Global {
            modules: Array<ModuleInterface>,
            db: Knex,
            cache: Knex
        }
    }
}
