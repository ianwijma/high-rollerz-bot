export class EmojiHelper {

    parse ( string : string ) : any {
        if ( string.startsWith(':') ) {
            string = string.substring(1)
        }

        if ( string.endsWith(':') ) {
            string = string.slice(0, -1)
        }

        return global.discord.emojis.find('name', string)
    }

}