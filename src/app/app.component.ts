import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "./api.service";
import { SelectionData } from "./selection-data";
import { Selection } from "./selection";
import { Node } from "./node";
import { NodeData } from "./node-data";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild("nodeModal") nodeModal: any;
    @ViewChild("infoModal") infoModal: any;
    @ViewChild("deleteModal") deleteModal: any;

    modalTitle: string = "";
    modalText: string = "";

    isLogged: boolean = false;
    login: string = "";
    password: string = "";

    vocabulary: string = "LIMC";
    selection: string = "article";

    selections: Selection[] = [];
    nodes: Node[] = [];

    node: Node = new Node();

    constructor(private apiService: ApiService, private modalService: NgbModal) {}

    ngOnInit() {}

    saveCredentials() {

        this.apiService.credentials =  btoa(this.login + ":" + this.password);

        this.apiService.getSelections(this.vocabulary).subscribe(
            (result: SelectionData) => {
                this.isLogged = true;
                this.selections = result.selections;
            },
            (error: any) => {
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
            },
            (error: any) => {
                this.nodes = [];
            }
        );
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

        // Add node to the array
        this.nodes.push(node);
        this.nodes.sort((a: Node, b: Node): number => {
            if (a.label["de"].toLowerCase() > b.label["de"].toLowerCase()) return 1;
            if (a.label["de"].toLowerCase() < b.label["de"].toLowerCase()) return -1;
            return 0;
        });
    }

    editNode(node: Node) {
        console.log("NODE EDITED");
    }

    deleteNode(node: Node) {
        console.log("NODE DELETED");

        // Remove node from the array
        const index: number = this.nodes.indexOf(node);
        if (index >= 0) this.nodes.splice(index, 1);

    }

}
