import { JsonObject, JsonProperty } from "json2typescript";
import { Selection } from "./selection";

@JsonObject
export class SelectionData {

    @JsonProperty("status", Number)
    status: number = undefined;

    @JsonProperty("selections", [Selection])
    selections: Selection[] = undefined;

    @JsonProperty("userdata")
    userdata: any = undefined;

}
