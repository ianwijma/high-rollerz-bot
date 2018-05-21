import { AbstractCommand } from "../abstracts/AbstractCommand";
import Giphy from 'giphy-api';
import {
    first as _first
} from 'lodash';

export class GifCommand extends AbstractCommand {

    readonly command : string = 'gif <search> <rating="PG-13">';

    readonly description: string = 'Searches giphy for amazing gifs!';

    processCommand ( parameters ) : void
    {
        var giphy = Giphy(process.env.GIPHY_API_KEY);
        var options : object = {
            q: parameters.search,
            offset: Math.floor(Math.random() * 250),
            lang: 'en',
            limit: 1,
            rating: parameters.rating,
        }
        giphy.search(options, (_, response) => {
            var result : any = _first(response.data);
            this.message.channel.send({
                    embed: {
                        description: `Title: ${result.title}\nAuthor: **${result.username ? result.username : "No author"}**`,
                        image: {
                            url: result.images.original.url,
                            width: result.images.original.width,
                            height: result.images.original.height
                        }
                    }
                })
        })
    }
}