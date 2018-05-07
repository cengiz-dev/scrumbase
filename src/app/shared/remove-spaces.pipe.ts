import { Pipe } from "@angular/core";

@Pipe({
    name: "removeSpaces"
})
export class RemoveSpacesPipe {
    transform(value) {
        return value.replace(/ /g, "");
    }
}