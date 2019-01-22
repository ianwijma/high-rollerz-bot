import {ModuleInterface} from "../src/interfaces/interfaces";
import Knex = require("knex");


declare namespace NodeJS {
    export interface Global {
        modules: Array<ModuleInterface>,
        db: Knex,
        cache: Knex
    }
}