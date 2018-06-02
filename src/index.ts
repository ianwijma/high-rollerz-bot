import {DiscordCore} from "./cores/DiscordCore";
import {GuildCore} from "./cores/GuildCore";
import {DatabaseCore} from "./cores/DatabaseCore";
import {MemoryDatabaseCore} from "./cores/MemoryDatabaseCore";
import {CommandCore} from "./cores/CommandCore";

export class App {

    db: DatabaseCore;
    memdb: MemoryDatabaseCore;
    discord: DiscordCore;
    guild: GuildCore;
    command: CommandCore;

    constructor () {
        this.db = new DatabaseCore();
        this.memdb = new MemoryDatabaseCore();
        this.discord = new DiscordCore();
        this.guild = new GuildCore();
        this.command = new CommandCore();
    }

    /**
     * Order matters here
     * @returns {Promise<void>}
     */
    public async start () {
        console.log(`${await this.db.start()} started`);

        console.log(`${await this.memdb.start()} started`);

        console.log(`${await this.discord.start()} started`);

        console.log(`${await this.guild.start()} started`);

        console.log(`${await this.command.start()} started`);
    }

}