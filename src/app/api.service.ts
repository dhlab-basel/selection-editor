import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { SelectionData } from "./selection-data";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

import { JsonConvert, OperationMode } from "json2typescript";
import { NodeData } from "./node-data";

@Injectable()
export class ApiService {

    private static jsonConvert = new JsonConvert();

    constructor(private httpClient: HttpClient) {
        //ApiService.jsonConvert.operationMode = OperationMode.LOGGING;
    }

    getSelections(vocabulary: string): Observable<any> {

        const headers = new HttpHeaders();

        return this.httpClient.get("http://www.salsah.org/api/selections?vocabulary=" + vocabulary, {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<SelectionData>) => {
            try {
                const result: SelectionData = ApiService.jsonConvert.deserializeObject(response.body, SelectionData);
                return result;
            } catch (error) {
                return error;
            }
        }).catch((error: any): any => {
            if (ApiService.jsonConvert.operationMode === OperationMode.LOGGING) console.error(error);
            return Observable.throw(error);
        });

    }

    getNodes(vocabulary: string, selection: string): Observable<any> {

        const headers = new HttpHeaders();

        return this.httpClient.get("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/?lang=all", {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<NodeData>) => {
            try {
                const result: NodeData = ApiService.jsonConvert.deserializeObject(response.body, NodeData);
                return result;
            } catch (error) {
                return error;
            }
        }).catch((error: any): any => {
            if (ApiService.jsonConvert.operationMode === OperationMode.LOGGING) console.error(error);
            return Observable.throw(error);
        });

    }

}