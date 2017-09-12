import { JsonObject, JsonProperty } from "json2typescript";
import { NumberStringConverter } from "./number-string-converter";

@JsonObject
export class Selection {

    @JsonProperty("id", NumberStringConverter)
    id: number = undefined;

    @JsonProperty("name", String)
    name: string = undefined;

    @JsonProperty("label", String)
    label: string = undefined;

    @JsonProperty("description", String)
    description: string = undefined;

    @JsonProperty("vocabulary_id", NumberStringConverter)
    vocabulary_id: number = undefined;

    @JsonProperty("vocabulary_name", String)
    vocabulary_name: string = undefined;

    @JsonProperty("person_id", NumberStringConverter)
    person_id: number = undefined;

}
