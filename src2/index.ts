import {DiscordCore} from "./cores/DiscordCore";
import {GuildCore} from "./cores/GuildCore";
import {DatabaseCore} from "./cores/DatabaseCore";
import {MemoryDatabaseCore} from "./cores/MemoryDatabaseCore";
import {CommandCore} from "./cores/CommandCore";
import {AutoChannelCore} from "./cores/AutoChannelCore";
import {MessageCore} from "./cores/MessageCore";
import {EmojiCore} from "./cores/EmojiCore";
export class App {

    db: DatabaseCore;
    memdb: MemoryDatabaseCore;
    discord: DiscordCore;
    guild: GuildCore;
    command: CommandCore;
    autochannel: AutoChannelCore;
    message: MessageCore;
    emoji: EmojiCore;

    constructor () {
        this.db = new DatabaseCore();
        this.memdb = new MemoryDatabaseCore();
        this.discord = new DiscordCore();
        this.guild = new GuildCore();
        this.autochannel = new AutoChannelCore();
        this.command = new CommandCore();
        this.message = new MessageCore();
        this.emoji = new EmojiCore();
    }

    /**
     * Order matters here
     * @returns {Promise<void>}
     */
    public async start () {
        console.log(`${await this.db.start()} started`);

        console.log(`${await this.memdb.start()} started`);

        console.log(`${await this.discord.start()} started`);

        console.log(`${await this.emoji.start()} started`);

        console.log(`${await this.guild.start()} started`);

        console.log(`${await this.autochannel.start()} started`);

        console.log(`${await this.command.start()} started`);

        console.log(`${await this.message.start()} started`);
    }

}