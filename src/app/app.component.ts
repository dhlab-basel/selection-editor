import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import { ApiService } from "./api.service";

import { SelectionData } from "./selection-data";
import { Selection } from "./selection";
import { Node } from "./node";
import { NodeData } from "./node-data";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    @ViewChild("nodeModal") nodeModal: any;
    @ViewChild("infoModal") infoModal: any;
    @ViewChild("deleteModal") deleteModal: any;

    modalTitle: string = "";
    modalText: string = "";

    isLogged: boolean = true;
    login: string = "";
    password: string = "";

    vocabulary: string = "LIMC";
    selection: string = "article";

    selections: Selection[] = [];
    nodes: Node[] = [];

    node: Node = new Node();

    constructor(private apiService: ApiService, private modalService: NgbModal) {}

    ngOnInit() {

        // For debugging only
        //this.login = "";
        //this.password = "";

        this.saveCredentials();

    }

    saveCredentials() {

        this.apiService.credentials =  btoa(this.login + ":" + this.password);

        this.apiService.getSelections(this.vocabulary).subscribe(
            (result: SelectionData) => {
                this.isLogged = true;
                this.selections = result.selections;
            },
            (error: HttpErrorResponse) => {

                //if (error.status === 0) return;

                this.selections = [];

                this.isLogged = false;
                this.password = "";

                this.modalTitle = "Error";
                this.modalText = "Your login or password is wrong. Please try again.";
                this.modalService.open(this.infoModal);

            }
        );

    }

    getSelections() {
        this.apiService.getSelections(this.vocabulary).subscribe(
            (result: SelectionData) => {
                console.log("HERE");
                this.selections = result.selections;
            },
            (error: any) => {
                this.selections = [];
            }
        );
    }

    getNodes() {
        this.apiService.getNodes(this.vocabulary, this.selection).subscribe(
            (result: NodeData) => {
                this.nodes = result.selection;
                this.sortNodes();
            },
            (error: any) => {
                this.nodes = [];
            }
        );
    }

    sortNodes() {
        this.nodes.sort((a: Node, b: Node): number => {
            if (a.label["de"].toLowerCase() > b.label["de"].toLowerCase()) return 1;
            if (a.label["de"].toLowerCase() < b.label["de"].toLowerCase()) return -1;
            return 0;
        });
    }

    openNodeModal(node?: Node) {

        if (node === undefined) {
            node = new Node();
            node.label = [];
            node.label["de"] = "";
            node.label["en"] = "";
            node.label["fr"] = "";
            node.label["it"] = "";
        }

        this.node = node;

        this.modalService.open(this.nodeModal).result.then((result) => {
            switch (result) {
                case "SAVE":
                    this.editNode(node);
                    break;
                case "ADD":
                    this.node.generateName();
                    this.addNode(node);
                    break;
                default:
                    break;
            }
        }, (reason) => {
        });
    }

    openDeleteModal(node: Node) {

        this.modalService.open(this.deleteModal).result.then((result) => {
            if (result === "YES") this.deleteNode(node);
        }, (reason) => {
            console.log(`Dismissed ${(reason)}`);
        });

    }

    addNode(node: Node) {

        // Add note
        this.apiService.postNode(this.vocabulary, this.selection, node).subscribe(
            (success: boolean) => {
                if (success) this.addNodeSuccess(node);
                else this.addNodeError();
            },
            (error: any) => {
                this.addNodeError();
            }
        );

    }

    addNodeSuccess(node: Node) {

        // Add node to the array
        this.nodes.push(node);
        this.sortNodes();

        //this.modalTitle = "Success";
        //this.modalText = "The node has been successfully added.";
        //this.modalService.open(this.infoModal);

    }

    addNodeError() {
        this.modalTitle = "Error";
        this.modalText = "The node could not be added.";
        this.modalService.open(this.infoModal);
    }

    editNode(node: Node) {

        // Edit note
        this.apiService.putNode(this.vocabulary, this.selection, node).subscribe(
            (success: boolean) => {
                if (success) this.editNodeSuccess();
                else this.editNodeError();
            },
            (error: any) => {
                this.editNodeError();
            }
        );

    }

    editNodeSuccess() {
        //this.modalTitle = "Success";
        //this.modalText = "The node has been successfully edited.";
        //this.modalService.open(this.infoModal);
    }

    editNodeError() {
        this.modalTitle = "Error";
        this.modalText = "The node could not be edited.";
        this.modalService.open(this.infoModal);
    }

    deleteNode(node: Node) {

        // Delete note
        this.apiService.deleteNode(this.vocabulary, this.selection, node).subscribe(
            (success: boolean) => {
                if (success) this.deleteNodeSuccess(node);
                else this.deleteNodeError();
            },
            (error: any) => {
                this.deleteNodeError();
            }
        );

    }

    deleteNodeSuccess(node: Node) {

        // Remove node from the array
        const index: number = this.nodes.indexOf(node);
        if (index >= 0) this.nodes.splice(index, 1);

        //this.modalTitle = "Success";
        //this.modalText = "The node has been successfully deleted.";
        //this.modalService.open(this.infoModal);

    }

    deleteNodeError() {
        this.modalTitle = "Error";
        this.modalText = "The node could not be deleted.";
        this.modalService.open(this.infoModal);
    }

}
