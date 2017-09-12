import { JsonObject, JsonProperty } from "json2typescript";
import { Node } from "./node";

@JsonObject
export class NodeData {

    @JsonProperty("status", Number)
    status: number = undefined;

    @JsonProperty("selection", [Node])
    selection: Node[] = undefined;

    @JsonProperty("userdata")
    userdata: any = undefined;

}
