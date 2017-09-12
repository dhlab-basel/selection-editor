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

}
