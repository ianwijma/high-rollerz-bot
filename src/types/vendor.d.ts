import {GuildCore} from "../cores/GuildCore";
import {DiscordCore} from "../cores/DiscordCore";
import {DatabaseCore} from "../cores/DatabaseCore";
import {CommandCore} from "../cores/CommandCore";
import {MemoryDatabaseCore} from "../cores/MemoryDatabaseCore";

declare global {
    namespace NodeJS {
        interface Global {
            discord : DiscordCore,
            guilds : GuildCore,
            db : DatabaseCore,
            command : CommandCore,
            memdb : MemoryDatabaseCore,
        }
    }
}
