import { JsonConverter, JsonCustomConvert } from "json2typescript";

@JsonConverter
export class NumberStringConverter implements JsonCustomConvert<number> {
    serialize(number: Number): any {
        return number + "";
    }
    deserialize(string: any): number {
        let number: number = parseInt(string);
        if (isNaN(number)) number = 0;
        return number;
    }
}
