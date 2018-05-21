import {Client} from "discord.js";
import {EmojiHelper} from "../lib/EmojiHelper";
import Knex = require("knex");

declare global {
    namespace NodeJS {
        interface Global {
            discord : Client,
            emoji : EmojiHelper,
            memDb : Knex,
            db : Knex,
        }
    }
}
