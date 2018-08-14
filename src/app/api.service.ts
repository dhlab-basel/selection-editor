import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { SelectionData } from "./selection-data";
import { Observable, throwError } from "rxjs/index";
import { catchError, map } from "rxjs/internal/operators";

import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { NodeData } from "./node-data";
import { Node } from "./node";

@Injectable()
export class ApiService {

    private jsonConvert = new JsonConvert();

    public credentials: string = "";

    constructor(private httpClient: HttpClient) {
        // this.jsonConvert.operationMode = OperationMode.LOGGING;
        this.jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;
    }

    getSelections(vocabulary: string): Observable<SelectionData | HttpErrorResponse> {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.get("http://www.salsah.org/api/selections?vocabulary=" + vocabulary, {
            headers: headers,
            observe: "response"
        }).pipe(
            map((response: HttpResponse<SelectionData>): SelectionData => {
                const result: SelectionData = this.jsonConvert.deserializeObject(response.body, SelectionData);
                return result;
            }),
            catchError((error: HttpErrorResponse): Observable<HttpErrorResponse> => {

                if (error instanceof HttpErrorResponse === false) {
                    error = new HttpErrorResponse({ error: error, status: 0 });
                }

                console.error(error);
                return throwError(error);

            })
        );

    }

    getNodes(vocabulary: string, selection: string): Observable<NodeData | HttpErrorResponse> {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.get("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/?lang=all", {
            headers: headers,
            observe: "response"
        }).pipe(
            map((response: HttpResponse<NodeData>): NodeData => {
                const result: NodeData = this.jsonConvert.deserializeObject(response.body, NodeData);
                return result;
            }),
            catchError((error: any): Observable<HttpErrorResponse> => {

                if (error instanceof HttpErrorResponse === false) {
                    error = new HttpErrorResponse({ error: error, status: 0 });
                }

                return throwError(error);

            })
        );

    }

    postNode(vocabulary: string, selection: string, node: Node): Observable<boolean> {

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
        }).pipe(
            map((response: HttpResponse<any>): boolean => {
                if (response.status === 200) {
                    node.id = response.body.node_id;
                    return true;
                }
                return false;
            }),
            catchError((error: any): Observable<boolean> => {
                console.error(error);
                return throwError(false);
            })
        );

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
        }).pipe(
            map((response: HttpResponse<any>): boolean => {
                return response.status === 200;
            }),
            catchError((error: any): Observable<boolean> => {
                console.error(error);
                return throwError(false);
            })
        );

    }

    deleteNode(vocabulary: string, selection: string, node: Node): Observable<boolean> {

        const headers = new HttpHeaders({"Authorization": "Basic " + this.credentials});

        return this.httpClient.delete("http://www.salsah.org/api/selections/" + vocabulary + ":" + selection + "/" + node.name, {
            headers: headers,
            observe: "response"
        }).pipe(
            map((response: HttpResponse<any>): boolean => {
                return response.status === 200;
            }),
            catchError((error: any): Observable<boolean> => {
                console.error(error);
                return throwError(false);
            })
        );

    }

}
