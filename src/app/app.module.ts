import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpClient, HttpClientModule } from "@angular/common/http";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { ApiService } from "./api.service";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        NgbModule.forRoot()
    ],
    providers: [HttpClient, ApiService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
