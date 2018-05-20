import {Client} from "discord.js";
import {EmojiHelper} from "../lib/EmojiHelper";

declare global {
    namespace NodeJS {
        interface Global {
            discord : Client,
            emoji : EmojiHelper,
        }
    }
}
