import {GuildCore} from "../cores/GuildCore";
import {DiscordCore} from "../cores/DiscordCore";
import {DatabaseCore} from "../cores/DatabaseCore";
import {CommandCore} from "../cores/CommandCore";
import {MemoryDatabaseCore} from "../cores/MemoryDatabaseCore";
import {AutoChannelCore} from "../cores/AutoChannelCore";
import {MessageCore} from "../cores/MessageCore";
import {EmojiCore} from "../cores/EmojiCore";

declare global {
    namespace NodeJS {
        interface Global {
            discord : DiscordCore,
            guild : GuildCore,
            db : DatabaseCore,
            command : CommandCore,
            memdb : MemoryDatabaseCore,
            autochannel : AutoChannelCore,
            message : MessageCore,
            emoji : EmojiCore,
        }
    }
}
