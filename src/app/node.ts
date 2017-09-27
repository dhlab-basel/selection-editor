import { JsonObject, JsonProperty } from "json2typescript";
import { NumberStringConverter } from "./number-string-converter";

@JsonObject
export class Node {

    @JsonProperty("id", NumberStringConverter)
    id: number = undefined;

    @JsonProperty("name", String)
    name: string = undefined;

    @JsonProperty("order", NumberStringConverter)
    order: number = undefined;

    @JsonProperty("label", [String])
    label: string[] = undefined;

    /**
     * Generates a guid for the name.
     * @returns {string}
     */
    generateName() {

        if (this.name !== undefined) return;

        let result: string;
        let i: string;
        let j: number;

        result = "";
        for (j = 0; j < 32; j++) {
            //if (j === 8 || j === 12 || j === 16 || j === 20)
            //    result = result + "-";
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        this.name = result;
    }

}
