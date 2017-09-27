import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { SelectionData } from "./selection-data";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

import { JsonConvert, OperationMode } from "json2typescript";
import { NodeData } from "./node-data";
import { Node } from "./node";

@Injectable()
export class ApiService {

    private jsonConvert = new JsonConvert();

    public credentials: string = "";

    constructor(private httpClient: HttpClient) {
        //ApiService.jsonConvert.operationMode = OperationMode.LOGGING;
    }

    getSelections(vocabulary: string): Observable<any> {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.get("http://www.salsah.org/api/selections?vocabulary=" + vocabulary, {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<SelectionData>) => {
            try {
                const result: SelectionData = this.jsonConvert.deserializeObject(response.body, SelectionData);
                return result;
            } catch (error) {
                return error;
            }
        }).catch((error: any): any => {
            if (this.jsonConvert.operationMode === OperationMode.LOGGING) console.error(error);
            return Observable.throw(error);
        });

    }

    getNodes(vocabulary: string, selection: string): Observable<any> {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.get("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/?lang=all", {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<NodeData>) => {
            try {
                const result: NodeData = this.jsonConvert.deserializeObject(response.body, NodeData);
                return result;
            } catch (error) {
                return error;
            }
        }).catch((error: any): any => {
            if (this.jsonConvert.operationMode === OperationMode.LOGGING) console.error(error);
            return Observable.throw(error);
        });

    }

    postNode(vocabulary: string, selection: string, node: Node) {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.post("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/" + node.name, {
            position: {
                leftOf: null,
                rightOf: null
            },
            labels: {
                de: node.label["de"],
                en: node.label["en"],
                fr: node.label["fr"],
                it: node.label["it"]
            }
        }, {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<any>) => {
            if (response.status === 200) {
                node.id = response.body.node_id;
                return true;
            }
            return false;
        }).catch((error: any): any => {
            return false;
        });

    }

    putNode(vocabulary: string, selection: string, node: Node): Observable<boolean> {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.put("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/" + node.name, {
            labels: {
                de: node.label["de"],
                en: node.label["en"],
                fr: node.label["fr"],
                it: node.label["it"]
            }
        }, {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<any>) => {
            return response.status === 200;
        }).catch((error: any): any => {
            return false;
        });

    }

    deleteNode(vocabulary: string, selection: string, node: Node) {


        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.delete("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/" + node.name, {
            headers: headers,
            observe: "response"
        }).map((response: HttpResponse<any>) => {
            return response.status === 200;
        }).catch((error: any): any => {
            return false;
        });

    }

}
